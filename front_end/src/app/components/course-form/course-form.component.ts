import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import currencyToSymbolMap from 'currency-symbol-map/map'
import { CourseService } from '../../services/course-service/course.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  course: Course;
  start_date: NgbDateStruct;
  end_date : NgbDateStruct;
  currencies: string[] = Object.values(currencyToSymbolMap);

  constructor(private courseService: CourseService, private router: Router) {
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
    // Access the state passed from the previous page
    this.course = history.state.course;
    this.course.currency = currencyToSymbolMap[this.course.currency];
    this.start_date = {
      year: Number(this.course.start_date.split('-')[0]),
      month: Number(this.course.start_date.split('-')[1]),
      day: Number(this.course.start_date.split('-')[2])
    };
    this.end_date = {
      year: Number(this.course.end_date.split('-')[0]),
      month: Number(this.course.end_date.split('-')[1]),
      day: Number(this.course.end_date.split('-')[2])
    };
  }

  updateCourse(): void {

    for (let [key, value] of Object.entries(currencyToSymbolMap)) {
      if (value === this.course.currency) {
        this.course.currency = key;
      }
    }

    this.course.start_date = String(this.start_date.year) + '-' + String(this.start_date.month) + '-' + String(this.start_date.day);
    this.course.end_date = String(this.end_date.year) + '-' + String(this.end_date.month) + '-' + String(this.end_date.day);

    this.courseService.updateCourse(this.course._id, this.course).subscribe(data => {
      this.router.navigate(['/']);
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
