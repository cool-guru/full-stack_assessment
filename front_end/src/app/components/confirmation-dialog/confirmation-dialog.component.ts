import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  @Input() message: string;
  constructor(public activeModal: NgbActiveModal) {
    this.message = 'Are you sure you want to delete this course?';
  }

  confirm(): void {
    this.activeModal.close(true);
  }

  dismiss(reason: string): void {
    this.activeModal.dismiss(reason);
  }
}
