import { ITEM_STATUS } from 'src/app/constants/item-status';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent  {

  @Output() createTaskConfirmation: EventEmitter<any> = new EventEmitter();

  title: any;
  emptyTitle: boolean = false;
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

    if  (this.title == null ||this.title.length == 0) {
      this.emptyTitle = true;
    } else {
      this.createTaskConfirmation.emit(obj);
      this.closeModal();
    }
  }

  closeModal() {
    this.modal.close();
  }

  tagsAddedHandler(tags: any) {
    this.tags = [];

    for (let i = 0; i < tags.length; ++i) {
      if (tags[i].title == null) {
        let color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.tags?.push({title: tags[i], color: color});
      } else {
        this.tags?.push(tags[i]);
      }
    }
  }
}
