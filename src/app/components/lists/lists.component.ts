import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ListActions } from 'src/app/enums/list-actions.model';
import { TaskService } from 'src/app/task.service';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})

export class ListsComponent implements OnInit {
 
  @Input() lists:any;
  @Input() selectedList:any;

  @Output() listEvent: EventEmitter<any> = new EventEmitter();

  constructor(private taskService: TaskService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.selectedList == null)
      this.selectedList = this.lists[0];
  }
  
  modifyThisList(list: any) {
    this.pickListEvent(ListActions.modifyList, list)
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

  selectList(list: any)  {
    this.selectedList = list;
    this.pickListEvent(ListActions.selectList, list);
  }

  pickListEvent(listAction: any, list: any) {
    let emitObject = {listEvent: listAction, list: list};
    this.listEvent.emit(emitObject);
  }
}