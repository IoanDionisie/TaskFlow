import { ITEM_STATUS } from 'src/app/constants/item-status';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent  {

  @Output() createTaskConfirmation: EventEmitter<any> = new EventEmitter();

  title: any;
  description: any;
  tags: Object[]|undefined;

  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private modal: NgbActiveModal) {
  }
  
  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
      dateCreated: new Date(),
      status: ITEM_STATUS.inProgress,
      tags: this.tags
    }

    this.createTaskConfirmation.emit(obj);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }

  tagsAddedHandler(tags: string[]) {
    this.tags = [];

    for (let i = 0; i < tags.length; ++i) {
      this.tags?.push({title: tags[i]});
    }
  }
}
