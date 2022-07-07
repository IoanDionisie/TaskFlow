import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/task.service';
import { DeleteItemComponent } from 'src/app/components/dialogs/delete-item/delete-item.component';
import { CreateListComponent } from 'src/app/components/modals/create-list/create-list.component';
import { CreateTaskComponent } from 'src/app/components/modals/create-task/create-task.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ModifyItemComponent } from 'src/app/components/modals/modify-item/modify-item.component';
import { ListActions } from 'src/app/enums/list-actions.model';
import { Actions } from 'src/app/enums/actions';

@Component({
  animations: [],
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

  percentCompleted: number | undefined;

  successEventData: Object | undefined;
  dummyCounter:number = 0;

  @HostBinding('class') class = 'center-component';

  constructor(private taskService: TaskService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllLists();
  }

  drop(event: CdkDragDrop<Object[]>, tasks: any) {
    moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    this.changeArrayOrder(this.inProgressTasks);
  }

  changeArrayOrder(tasks: any) {
    this.taskService.modifyTasks(this.selectedList._id, tasks.map((task: any) =>  task._id)).subscribe((response: any) => {
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
      this.calculatePercentCompleted();
    });
  }

  /* Calculates the percent of tasks that have been completed, from a specific list */
  calculatePercentCompleted() {
    if (this.tasks.length == 0)
      this.selectedList.percentCompleted = 0;
    else
      this.selectedList.percentCompleted = Math.floor(this.completedTasks.length / this.tasks.length * 100);
  }

  /* Splits the task list in 2 lists, 'In Progress' and 'Completed', and then sorts the completed tasks by Date */
  sortTasks(tasks: any) {
    this.tasks = tasks;

    for (let i = 0; i < this.tasks.length; ++i) {
      tasks[i].status == "In Progress" ? this.inProgressTasks.push(tasks[i]) : this.completedTasks.push(tasks[i]);
    }

    this.completedTasks.sort((objA:any, objB:any) => Number(objB.date) - Number(objA.date));
  }

  createNewList() {
    const modalRef = this.modalService.open(CreateListComponent);
    modalRef.componentInstance.createListConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.taskService.createList(response).subscribe((response: any) => {
          this.lists.push(response);
          this.showSuccessMessage(Actions.addList, response.title);
        }); 
      }
    })
  }

  createNewTask() {
    const modalRef = this.modalService.open(CreateTaskComponent);
    modalRef.componentInstance.createTaskConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.taskService.createTask(this.selectedList._id, response).subscribe((response: any) => {
          this.inProgressTasks.unshift(response);
          this.tasks.unshift(response);
          this.calculatePercentCompleted();
          this.showSuccessMessage(Actions.addTask, response.title);
        })
      }
    });
  }

  deleteThisTask(task : any, index:number, type: string) {
    const modalRef = this.modalService.open(DeleteItemComponent);
    modalRef.componentInstance.elementName = "Task";
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteTask(this.selectedList._id, task._id).subscribe((response: any) =>  {
          if (type == "completed") {
            this.completedTasks.splice(index, 1);
            this.tasks.length--;
            this.calculatePercentCompleted();
          } else if (type == "progress") {
            this.inProgressTasks.splice(index, 1);
            this.tasks.length--;
            this.calculatePercentCompleted();
          }

          this.showSuccessMessage(Actions.deleteTask, task.title);
        })
      }
    })
  }

  modifyThisTask(task: any) {
    const modalRef = this.modalService.open(ModifyItemComponent);
    modalRef.componentInstance.elementName = "Task";
    modalRef.componentInstance.title = task.title;
    modalRef.componentInstance.description = task.description;
    modalRef.componentInstance.modifyItemConfirmation.subscribe((receivedData: any) => {
      if (receivedData.confirmation === true) {
        this.taskService.modifyTask(this.selectedList._id, task._id, receivedData).subscribe((response: any) => {
          task.title = receivedData.title;
          task.description = receivedData.description;
          this.showSuccessMessage(Actions.modifyTask, task.title);
        })
      }
    })
  }

  completeThisTask(task: any, index: number) {
    task.status = "Completed";
    task.dateCompleted = new Date();
    this.taskService.modifyTask(this.selectedList._id, task._id, task).subscribe((response: any) => {
      this.inProgressTasks.splice(index, 1);
      this.completedTasks.unshift(task);
      this.calculatePercentCompleted();
      this.showSuccessMessage(Actions.completeTask, task.title);
    })
  }

  changeTasksDisplayed() {
    this.displayInProgress = !this.displayInProgress;
  }

  showSettings() {

  }

  listEvent(event:any) {
    if (event.listEvent == ListActions.selectList) {
      if  (this.selectedList._id != event.list._id) {
        this.selectedList = event.list;
        this.getAllTasks(event.list._id);
      }
    } else if (event.listEvent == ListActions.modifyList) {

    } else if (event.listEvent == ListActions.deleteList) {
      this.getAllLists();
      this.showSuccessMessage(Actions.deleteList, event.list.title);
    }
  }

  showSuccessMessage(event: any, title: any) {
    this.successEventData = {
      counter: this.dummyCounter++,
      eventType: event,
      elementName: title
    }
  }

}