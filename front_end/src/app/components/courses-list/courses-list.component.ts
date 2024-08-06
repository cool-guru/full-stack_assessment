import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course-service/course.service';
import { Router } from '@angular/router';
import { NgbPaginationConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Course } from '../../models/course.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {
  searchQuery = '';
  page = 1;
  pageSize = 10;
  collectionSize = 10;
  
  courses: Array<Course> = [];

  constructor(private courseService: CourseService, config: NgbPaginationConfig, private router: Router, private modalService: NgbModal) {
    config.size = 'md';
		config.boundaryLinks = true;
  }
  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses(this.searchQuery, 0 + this.pageSize * (this.page - 1), this.pageSize).subscribe(data => {
      this.courses = data.courses;
      this.courses = this.courses.map(course => ({
        ...course,
        currencySymbol: getSymbolFromCurrency(course.currency)
      }));
      this.collectionSize = data.total_course;
    });
  }
  editCourse(course: Course): void {
    this.router.navigate(['/edit-course', course._id], {state: {"course": course}});
  }

  deleteCourse(course: Course): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent);

    modalRef.result.then((result) => {
      if (result) {
        this.courseService.deleteCourse(course._id).subscribe({
          next: () => {
            this.loadCourses();
          },
          error: (error) => {
            console.error('Error deleting course:', error);
          }
        });
      }
    }, (reason) => {
      console.log('Dismissed', reason);
    });
  }

  getDuration(course: Course): any {
    const start = new Date(course.start_date);
    const end = new Date(course.end_date);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = end.getTime() - start.getTime();

    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffInDays = Math.ceil(diffInMilliseconds / millisecondsPerDay);

    return diffInDays;
  }
  filterCourses(): void {

  }
}
