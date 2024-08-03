import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import currencyToSymbolMap from 'currency-symbol-map/map'
import { CourseService } from '../../services/course-service/course.service';
import { Course } from '../../models/course.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  course: Course;
  start_date: NgbDateStruct;
  end_date : NgbDateStruct;

  currencies: string[] = Object.values(currencyToSymbolMap);
  courseNames: string[] = [];
  universityNames: string[] = [];
  countryNames: string[] = [];
  cityNames: string[] = [];

  constructor(private courseService: CourseService, private router: Router) {
    this.course = {
      _id: '',
      course_name: '',
      university: '',
      country: '',
      city: '',
      price: 0,
      currency: '',
      start_date: '',
      end_date: '',
      course_description: ''
    };
    const today = new Date();
    this.start_date = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
    this.end_date = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }

  ngOnInit(): void {
    this.loadCourses();
    
  }

  loadCourses(): void {
    this.courseService.getCourses('', 0, 100).subscribe(data => {
      this.courseNames = data.courses.map((item: any) => item.course_name);
      this.universityNames = data.courses.map((item: any) => item.university);
      this.countryNames = data.courses.map((item: any) => item.country);
      this.cityNames = data.courses.map((item: any) => item.city);
    });
  }

  addCourse(): void {
    for (let [key, value] of Object.entries(currencyToSymbolMap)) {
      if (value === this.course.currency) {
        this.course.currency = key;
      }
    }

    this.course.start_date = String(this.start_date.year) + '-' + String(this.start_date.month) + '-' + String(this.start_date.day);
    this.course.end_date = String(this.end_date.year) + '-' + String(this.end_date.month) + '-' + String(this.end_date.day);

    
    this.courseService.createCourse(this.course).subscribe(data => {
      this.router.navigate(['/']);
    });
  }

  searchCourse = (text$: Observable<string>) => 
    text$.pipe(
      map(term => term === '' ? []
        : this.courseNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchUniversity = (text$: Observable<string>) => 
    text$.pipe(
      map(term => term === '' ? []
        : this.universityNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchCity = (text$: Observable<string>) => 
    text$.pipe(
      map(term => term === '' ? []
        : this.cityNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchCountry = (text$: Observable<string>) => 
    text$.pipe(
      map(term => term === '' ? []
        : this.countryNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  cancel(): void {
    this.router.navigate(['/']);
  }
}
