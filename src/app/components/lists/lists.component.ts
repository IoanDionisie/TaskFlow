import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { ITEM_TYPE } from 'src/app/constants/item-types';
import { ListActions } from 'src/app/enums/list-actions.model';
import { TaskService } from 'src/app/services/task.service';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';
import { ModifyItemComponent } from '../modals/modify-item/modify-item.component';
import { TokenStorageService } from '../../services/token-storage.service';
import { HelperService } from '../../services/helper.service';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ViewTaskComponent } from '../modals/view-task/view-task.component';
import { ViewListComponent } from '../modals/view-list/view-list.component';
import { List } from 'src/app/models/list.model';


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
  @Input() inProgressLists: List[] = [];
  @Input() completedLists: List[] = [];
  @Input() selectedList: List = new List();
  @Output() listEvent: EventEmitter<any> = new EventEmitter();
  @Input() incrementNumber: any;
  @Input() progressBarColor: any;

  showInProgress: boolean | undefined;
  showCompleted: boolean | undefined;

  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private taskService: TaskService, private modalService: NgbModal, private token: TokenStorageService,
    private helperService: HelperService) {
    }

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
  
  modifyThisList(list: List) {
    const modalRef = this.modalService.open(ModifyItemComponent);
    this.helperService.modalRefConfig(modalRef, ITEM_TYPE.list, list);

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

  deleteThisList(list: List) {
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

  markAsCompleted(list: List) {
    list.status = ITEM_STATUS.completed;
    list.dateCompleted = new Date();
    this.taskService.modifyList(list._id, list).subscribe((response: any) => {
      this.pickListEvent(ListActions.completeList, list);
    })
  }

  selectList(list: List)  {
    this.selectedList = list;
    console.log(this.selectedList);

    this.pickListEvent(ListActions.selectList, list);
  }

  pickListEvent(listAction: any, list: List) {
    let emitObject = {listEvent: listAction, list: list};
    this.listEvent.emit(emitObject);
  }

  showListInfo(list: List) {
    const modalRef = this.modalService.open(ViewListComponent);
    modalRef.componentInstance.list = list;
  }

}