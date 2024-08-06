import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import currencyToSymbolMap from 'currency-symbol-map/map'
import { CourseService } from '../../services/course-service/course.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {
  course: Course;
  currencies: string[] = Object.values(currencyToSymbolMap);
  courseForm: FormGroup;

  constructor(private courseService: CourseService, private router: Router, private fb: FormBuilder) {
  
    this.course = {
      _id: '',
      university: '',
      city: '',
      country: '',
      course_name: '',
      course_description: '',
      start_date: '',
      end_date: '',
      price: 0,
      currency: ''
    }
    const today = new Date();
    console.log('history.state', history.state);
    this.courseForm = this.fb.group({
      course_name: [{value: history.state.course['course_name'], disabled: true}, [Validators.required, Validators.minLength(3)]],
      university: [{value: history.state.course['university'], disabled: true}, Validators.required],
      country: [{value: history.state.course['country'], disabled: true}, Validators.required],
      city: [{value: history.state.course['city'], disabled: true}, Validators.required],
      price: [history.state.course['price'], [Validators.required, Validators.min(1)]],
      currency: [currencyToSymbolMap[history.state.course['currency']], Validators.required],
      start_date: [{
        year: Number(history.state.course['start_date'].split('-')[0]),
        month: Number(history.state.course['start_date'].split('-')[1]),
        day: Number(history.state.course['start_date'].split('-')[2])
      }, Validators.required],
      end_date: [{
        year: Number(history.state.course['end_date'].split('-')[0]),
        month: Number(history.state.course['end_date'].split('-')[1]),
        day: Number(history.state.course['end_date'].split('-')[2])
      }, Validators.required],
      course_description: [history.state.course['course_description'], [Validators.required, Validators.minLength(10)]]
    });
  }

  onDateSelect(date: NgbDateStruct, property: string) {
    this.courseForm.get(property)?.setValue(date);
  }

  updateCourse(): void {
    if (this.courseForm.valid) {
      console.log('Form submit', this.courseForm.value);
      this.course = this.courseForm.value;
      this.course._id = history.state.course['_id'];
      this.course.course_name = history.state.course['course_name'];
      this.course.university = history.state.course['university'];
      this.course.country = history.state.course['country'];
      this.course.city = history.state.course['city'];
      for (let [key, value] of Object.entries(currencyToSymbolMap)) {
        if (value === this.course.currency) {
          this.course.currency = key;
        }
      }

      this.course.start_date = String(this.courseForm.value.start_date.year) + '-' + String(this.courseForm.value.start_date.month) + '-' + String(this.courseForm.value.start_date.day);
      this.course.end_date = String(this.courseForm.value.end_date.year) + '-' + String(this.courseForm.value.end_date.month) + '-' + String(this.courseForm.value.end_date.day);

      this.courseService.updateCourse(this.course['_id'], this.course).subscribe(data => {
        this.router.navigate(['/']);
      });

    } else {
      console.log('Form invalid', this.courseForm);
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
