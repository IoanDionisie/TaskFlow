import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListActions } from 'src/app/enums/list-actions.model';
import { TaskService } from 'src/app/task.service';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';
import { ModifyItemComponent } from '../modals/modify-item/modify-item.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})

export class ListsComponent implements OnInit {
  @Input() lists:any;
  @Input() selectedList:any;
  @Output() listEvent: EventEmitter<any> = new EventEmitter();

  inProgressLists: any;
  completedLists: any;

  showInProgress: boolean | undefined;
  showCompleted: boolean | undefined;

  constructor(private taskService: TaskService, private modalService: NgbModal) {}


  ngOnInit(): void {
    this.showInProgress = true;
    this.showCompleted = false;
  }

  groupLists() {
    for (let i = 0; i < this.lists.length; ++i) {
      if (this.lists[i].status == "Completed") {
        this.completedLists.push(this.lists[i]);
      } else if (this.lists[i].status == "InProgress") {
        this.inProgressLists.push(this.lists[i]);
      }
    }
  }

  toggleInProgress() {
    this.showInProgress = !this.showInProgress;
  }

  toggleCompleted() {
    this.showCompleted = !this.showCompleted;
  }
  

  ngOnChanges(): void {
    if (this.selectedList == null) {
      this.selectedList = this.lists[0];
    }

    this.groupLists();
  }
  
  modifyThisList(list: any) {
    const modalRef = this.modalService.open(ModifyItemComponent);
    modalRef.componentInstance.elementName = "List";
    modalRef.componentInstance.title = list.title;
    modalRef.componentInstance.description = list.description;
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
    modalRef.componentInstance.elementName = "List";
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteList(list._id).subscribe((response: any) => {
          this.pickListEvent(ListActions.deleteList, list);
        })
      }
    })
  }

  markAsCompleted(list: any) {
    list.status = list.status == "Completed" ? "InProgress" : "Completed";
    this.taskService.modifyList(list._id, list).subscribe((response: any) => {
      console.log(list + " modified");
      this.pickListEvent(ListActions.modifyList, list);
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