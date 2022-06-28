import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.scss']
})

export class DeleteTaskComponent  {

  @Output() removeConfirmation: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal) {}
  
  removeTask(remove: boolean) {
    this.removeConfirmation.emit(remove);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }
  
}
