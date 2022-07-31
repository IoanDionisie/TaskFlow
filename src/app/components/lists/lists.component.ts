import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { ITEM_TYPE } from 'src/app/constants/item-types';
import { ListActions } from 'src/app/enums/list-actions.model';
import { TaskService } from 'src/app/task.service';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';
import { ModifyItemComponent } from '../modals/modify-item/modify-item.component';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { TokenStorageService } from 'src/app/token-storage.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  animations: [
    trigger('incrementNumber', [
      state('initial', style({
        color: 'inherit'
      })),
      state('incrementing', style({
        color: 'green'
      })),
      transition('initial => incrementing', [
        animate('0.5s')
      ]),
      transition('incrementing => initial', [
        animate('0.5s')
      ])
    ]),
  ]
})

export class ListsComponent implements OnInit {
  @Input() inProgressLists:any;
  @Input() completedLists: any;
  @Input() selectedList:any;
  @Output() listEvent: EventEmitter<any> = new EventEmitter();
  @Input() incrementNumber: any;

  showInProgress: boolean | undefined;
  showCompleted: boolean | undefined;

  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private taskService: TaskService, private modalService: NgbModal, private token: TokenStorageService) {}

  ngOnInit(): void {
    this.showInProgress = true;
    this.showCompleted = false;
  }

  toggleInProgress() {
    this.showInProgress = !this.showInProgress;
  }

  toggleCompleted() {
    this.showCompleted = !this.showCompleted;
  }
  
  ngOnChanges(): void {
    if (this.selectedList == null) {
      this.selectedList = this.inProgressLists[0];
    }
  }
  
  modifyThisList(list: any) {
    const modalRef = this.modalService.open(ModifyItemComponent);
    modalRef.componentInstance.elementName = ITEM_TYPE.list;
    modalRef.componentInstance.title = list.title;
    modalRef.componentInstance.description = list.description;
    modalRef.componentInstance.userId = this.token.getUser().id;
    modalRef.componentInstance.status = list.status;
    modalRef.componentInstance.modifyItemConfirmation.subscribe((receivedData: any) => {
      if (receivedData.confirmation === true) {
        this.taskService.modifyList(list._id, receivedData).subscribe((response: any) => {
          list.title = receivedData.title;
          list.description = receivedData.description;
          this.pickListEvent(ListActions.modifyList, list);
        })
      }
    })
  }

  deleteThisList(list: any) {
    const modalRef = this.modalService.open(DeleteItemComponent);
    modalRef.componentInstance.elementName = ITEM_TYPE.list;
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteList(list._id).subscribe((response: any) => {
          this.pickListEvent(ListActions.deleteList, list);
        })
      }
    })
  }

  decrementListNumberAnimation() {
    this.incrementNumber = true;
    setTimeout(() =>{ 
      this.incrementNumber = false;
    }, 2000);
  }

  markAsCompleted(list: any) {
    list.status = ITEM_STATUS.completed;
    this.taskService.modifyList(list._id, {status: list.status}).subscribe((response: any) => {
      this.pickListEvent(ListActions.completeList, list);
    })
  }

  selectList(list: any)  {
    this.selectedList = list;
    this.pickListEvent(ListActions.selectList, list);
  }

  pickListEvent(listAction: any, list: any) {
    let emitObject = {listEvent: listAction, list: list};
    this.listEvent.emit(emitObject);
  }
}