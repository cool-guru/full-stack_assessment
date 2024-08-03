from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pymongo import MongoClient, ASCENDING
from datetime import datetime
from pydantic import BaseModel
import requests
import asyncio
from bson import ObjectId

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase']
collection = db['courses']
collection.create_index([("created_at", ASCENDING)], expireAfterSeconds=600)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class Course(BaseModel):
    university: str
    city: str
    country: str
    course_name: str
    course_description: str
    start_date: str
    end_date: str
    price: float
    currency: str

@app.on_event("startup")
async def startup_event():
    # Start the background task
    asyncio.create_task(periodic_download_task())

def convert_object_id(course):
    if '_id' in course:
        course['_id'] = str(course['_id'])
    return course

def download_csv():
    try:
        # Send a GET request to the URL
        CSV_URL = 'https://api.mockaroo.com/api/501b2790?count=100&key=8683a1c0'
        response = requests.get(CSV_URL)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Save the content to a CSV file with a timestamp
            filename = f'UniversitySchema.csv'
            with open(filename, 'wb') as file:
                file.write(response.content)

            df = pd.read_csv(filename)
            df.rename(columns={
                'University': 'university',
                'City': 'city',
                'Country': 'country',
                'CourseName': 'course_name',
                'CourseDescription': 'course_description',
                'StartDate': 'start_date',
                'EndDate': 'end_date',
                'Price': 'price',
                'Currency': 'currency'
            }, inplace=True)
            df['created_at'] = datetime.utcnow()

            # Convert DataFrame to dictionary and insert into MongoDB
            records = df.to_dict('records')
            collection.insert_many(records)
            print("Data uploaded successfully")
            print(f"CSV file downloaded and saved as '{filename}'.")
        else:
            print(f"Failed to download file. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

async def periodic_download_task():
    while True:
        download_csv()
        await asyncio.sleep(600)  # Wait for 10 minutes

@app.get("/courses")
async def get_courses(search: str = "", skip: int = 0, limit: int = 10):
    query = {"$or": [
        {"university": {"$regex": search, "$options": "i"}},
        {"city": {"$regex": search, "$options": "i"}},
        {"country": {"$regex": search, "$options": "i"}},
        {"course_name": {"$regex": search, "$options": "i"}},
        {"course_description": {"$regex": search, "$options": "i"}}
    ]}
    courses_cursor = collection.find(query).skip(skip).limit(limit)
    total_course = collection.count_documents({})
    courses = {
        'courses': [convert_object_id(course) for course in courses_cursor], 
        'total_course': total_course, 
        'skip': skip
    }
    return courses

@app.post("/courses", response_model=Course)
async def create_course(course: Course):
    try:
        course_dict = course.dict()
        course_dict['created_at'] = datetime.utcnow()
        result = collection.insert_one(course_dict)
        return Course(**course_dict)
    except Exception as e:
        print(f"Error: {e}")  # Log the error
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@app.put("/courses/{course_id}")
async def update_course(course_id: str, course: Course):
    result = collection.update_one({"_id": ObjectId(course_id)}, {"$set": course.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "success"}

@app.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    result = collection.delete_one({"_id": ObjectId(course_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "success"}