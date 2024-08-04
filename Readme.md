# Full-Stack Assessment to manage a list of university courses
#### _Philip Baker_

## Technology Stacks

- Python 3.10.12, FastAPI, MongoDB for back-end
- Angular 15.2.0
- Ng-Bootstrap

## Specification

- Download CSV file which represent Courses data:
- Build your back-end using Python 3+ and any web framework like Flask or FastAPI
- Build 4 web services including the usage of MongoDB queries and write operations:
- Create a UI using Angular 15+

## How to install
Ensure you already installed python3, node.js, angular-cli and MongoDB.

* Clone the repository using following command:
`git clone https://github.com/cool-guru/full-stack_assessment.git`
* Go to the project and run the FastAPI Server using following commands:
`cd full-stack_assessment`
`cd back-end`
`pip install fastapi[all] pymongo pandas requests`
`uvicorn main:app --realod`
* Go to the project, install the dependencies and run the Angular Application:
`cd front_end`
`npm install`
`ng serve`

Go to `http://localhost:4200` to check the project.

Thanks,
Philip
