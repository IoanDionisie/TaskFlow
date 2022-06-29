import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent  {

  @Output() createTaskConfirmation: EventEmitter<any> = new EventEmitter();
  
  constructor(private modal: NgbActiveModal) {}
  
  confirm() {
    this.createTaskConfirmation.emit(true);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }

}
