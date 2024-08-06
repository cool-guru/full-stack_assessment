import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import currencyToSymbolMap from 'currency-symbol-map/map'
import { CourseService } from '../../services/course-service/course.service';
import { Course } from '../../models/course.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  course: Course;
  courseForm: FormGroup;

  currencies: string[] = Object.values(currencyToSymbolMap);
  courseNames: string[] = [];
  universityNames: string[] = [];
  countryNames: string[] = [];
  cityNames: string[] = [];

  constructor(private courseService: CourseService, private router: Router, private fb: FormBuilder) {
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
    this.courseForm = this.fb.group({
      course_name: ['', [Validators.required, Validators.minLength(3)]],
      university: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      currency: ['$', Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      course_description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    
  }

  loadCourses(): void {
    this.courseService.getCourses('', 0, 100).subscribe(data => {
      this.courseNames = data.courses.map((item: any) => item.course_name).reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []);
      this.universityNames = data.courses.map((item: any) => item.university).reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []);
      this.countryNames = data.courses.map((item: any) => item.country).reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []);
      this.cityNames = data.courses.map((item: any) => item.city).reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []);
    });
  }

  onDateSelect(date: NgbDateStruct, property: string) {
    this.courseForm.get(property)?.setValue(date);
  }

  addCourse(): void {
    if (this.courseForm.valid) {
      console.log('Form submit', this.courseForm.value);
      this.course = this.courseForm.value;
      for (let [key, value] of Object.entries(currencyToSymbolMap)) {
        if (value === this.course.currency) {
          this.course.currency = key;
        }
      }

      this.course.start_date = String(this.courseForm.value.start_date.year) + '-' + String(this.courseForm.value.start_date.month) + '-' + String(this.courseForm.value.start_date.day);
      this.course.end_date = String(this.courseForm.value.end_date.year) + '-' + String(this.courseForm.value.end_date.month) + '-' + String(this.courseForm.value.end_date.day);

      
      this.courseService.createCourse(this.course).subscribe(data => {
        this.router.navigate(['/']);
      });

    } else {
      console.log('Form invalid', this.courseForm);
    }
    
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
