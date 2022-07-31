import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent  {

  @Output() createTaskConfirmation: EventEmitter<any> = new EventEmitter();

  title: any;
  description: any;
  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private modal: NgbActiveModal) {}
  
  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
      dateCreated: new Date(),
      status: ITEM_STATUS.inProgress
    }

    this.createTaskConfirmation.emit(obj);
    this.closeModal();

  }

  closeModal() {
    this.modal.close();
  }

}
