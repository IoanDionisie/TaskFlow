import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent  {

  @Output() createTaskConfirmation: EventEmitter<any> = new EventEmitter();

  title: any;
  description: any;
  
  constructor(private modal: NgbActiveModal) {}
  
  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
      status: "In Progress"
    }

    this.createTaskConfirmation.emit(obj);
    this.closeModal();

  }

  closeModal() {
    this.modal.close();
  }

}
