import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getCourses(search: string, skip: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`, { params: { search, skip, limit } });
  }

  createCourse(course: Course): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, course);
  }

  updateCourse(courseId: string, course: Course): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/courses/${courseId}`, course, { headers });
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}`);
  }
}
