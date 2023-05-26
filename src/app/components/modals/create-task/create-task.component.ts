import { ITEM_STATUS } from 'src/app/constants/item-status';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { O } from '@angular/cdk/keycodes';
import { TagsComponent } from '../../tags/tags.component';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf, NgForOf, TagsComponent]
})

export class CreateTaskComponent implements OnInit  {

  @Output() createTaskConfirmation: EventEmitter<any> = new EventEmitter();

  title: any;
  emptyTitle: boolean = false;
  description: any;
  estimation: number;
  tags: Object[]|undefined;
  timeValues: number[];

  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private modal: NgbActiveModal) {
    this.timeValues = [];
    this.estimation = 0;
  }

  ngOnInit(): void {
    for (let i = 1; i < 13; ++i) {
      this.timeValues.push(i/2);
    }
  }

  confirm() {
    let obj = {
      confirmation: true,
      title: this.title,
      description: this.description,
      dateCreated: new Date(),
      estimation: this.estimation,
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

  pickEstimation(value: number) {
    this.estimation = value;
  }
}
