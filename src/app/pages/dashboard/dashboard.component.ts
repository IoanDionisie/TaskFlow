import { ThisReceiver } from '@angular/compiler';
import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'mongoose';
import { TaskService } from 'src/app/task.service';
import { DeleteTaskComponent } from 'src/app/components/dialogs/delete-task/delete-task.component';
import { CreateListComponent } from 'src/app/components/modals/create-list/create-list.component';
import { CreateTaskComponent } from 'src/app/components/modals/create-task/create-task.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  lists: any[] = [];
  tasks: any;
  
  selectedList: any;

  @HostBinding('class') class = 'center-component';

  constructor(private taskService: TaskService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllLists();
  }

  getAllLists() {
    this.taskService.getLists().subscribe((response: any) => {
      this.lists = response;
      console.log(response);
      this.selectedList = this.lists[0];
      this.getAllTasks(this.selectedList._id);
    });
  }

  getAllTasks(listId: any) {
    this.taskService.getTasks(listId).subscribe((response: any) => {
      this.tasks = response;
    });
  }

  createNewList() {
    const modalRef = this.modalService.open(CreateListComponent);
    modalRef.componentInstance.createListConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.taskService.createList(response).subscribe((response: any) => {
          this.lists.push(response);
        }); 
      }
    })
  }

  createNewTask() {
    const modalRef = this.modalService.open(CreateTaskComponent);
    modalRef.componentInstance.createTaskConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.taskService.createTask(this.selectedList._id, response).subscribe((response: any) => {
          this.tasks.push(response);
        })
      }
    });
  }

  deleteThisTask(task : any) {
    const modalRef = this.modalService.open(DeleteTaskComponent);
    modalRef.componentInstance.elementName = "Task";
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteTask(this.selectedList._id, task._id).subscribe((response: any) =>  {
          this.getAllTasks(this.selectedList._id)
        })
      }
    })
  }

  deleteThisList(list: any) {
    const modalRef = this.modalService.open(DeleteTaskComponent);
    modalRef.componentInstance.elementName = "List";
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteList(list._id).subscribe((response: any) => {
          console.log(response);
          this.getAllLists();
        })
      }
    })
  }

  modifyThisTask(task: any) {

  }

  modifyThisList(list: any) {

  }

  completeThisTask(list: any) {

  }

  completeThisList(list: any) {
    
  }

  selectList(list: any) {
    this.selectedList = list;
    this.getAllTasks(list._id);
  }

}