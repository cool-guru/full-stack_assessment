import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { NgbPaginationConfig, NgbPaginationModule, NgbDatepickerModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { JsonPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CoursesListComponent,
    CourseFormComponent,
    AddCourseComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbAlertModule,
    JsonPipe,
    FormsModule
  ],
  providers: [NgbPaginationConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
