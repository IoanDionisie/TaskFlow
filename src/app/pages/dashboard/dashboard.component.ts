import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/task.service';
import { DeleteItemComponent } from 'src/app/components/dialogs/delete-item/delete-item.component';
import { CreateListComponent } from 'src/app/components/modals/create-list/create-list.component';
import { CreateTaskComponent } from 'src/app/components/modals/create-task/create-task.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  lists: any[] = [];

  inProgressTasks: any = [];
  completedTasks: any = [];
  tasks: any;
  displayInProgress: boolean = true;
  
  selectedList: any;

  @HostBinding('class') class = 'center-component';

  constructor(private taskService: TaskService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllLists();
  }

  drop(event: CdkDragDrop<Object[]>, tasks: any) {
    // console.log(tasks[event.previousIndex], tasks[event.currentIndex]);
    moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    this.changeArrayOrder(this.inProgressTasks);
    console.log(this.inProgressTasks);
  }

  changeArrayOrder(tasks: any) {
    this.taskService.modifyTasks(this.selectedList._id, tasks.map((task: any) =>  task._id)).subscribe((response: any) => {
      console.log(response);
    });
  }

  getAllLists() {
    this.taskService.getLists().subscribe((response: any) => {
      this.lists = response;
      this.selectedList = this.lists[0];
      this.getAllTasks(this.selectedList._id);
    });
  }

  getAllTasks(listId: any) {
    this.inProgressTasks = [];
    this.completedTasks = [];

    this.taskService.getTasks(listId).subscribe((response: any) => {
      this.sortTasks(response);
    });
    this.displayInProgress = true;
  }

  sortTasks(tasks: any) {
    this.tasks = tasks;
    for (let i = 0; i < this.tasks.length; ++i) {
      tasks[i].status == "In Progress" ? this.inProgressTasks.push(tasks[i]) : this.completedTasks.push(tasks[i]);
    }

    console.log(this.inProgressTasks);
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
          this.getAllTasks(this.selectedList._id);
        })
      }
    });
  }

  deleteThisTask(task : any) {
    const modalRef = this.modalService.open(DeleteItemComponent);
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
    const modalRef = this.modalService.open(DeleteItemComponent);
    modalRef.componentInstance.elementName = "List";
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteList(list._id).subscribe((response: any) => {
          this.getAllLists();
        })
      }
    })
  }

  modifyThisTask(task: any) {

  }

  modifyThisList(list: any) {

  }

  completeThisTask(task: any) {
    task.status = "Completed";
    this.taskService.modifyTask(this.selectedList._id, task._id, task).subscribe((response: any) => {
      this.getAllTasks(this.selectedList._id);
    })
  }

  completeThisList(list: any) {

  }

  selectList(list: any) {
    this.selectedList = list;
    this.getAllTasks(list._id);
  }

  changeTasksDisplayed() {
    this.displayInProgress = !this.displayInProgress;
  }

}