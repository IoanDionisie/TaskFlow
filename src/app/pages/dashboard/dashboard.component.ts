import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/services/task.service';
import { DeleteItemComponent } from 'src/app/components/dialogs/delete-item/delete-item.component';
import { CreateListComponent } from 'src/app/components/modals/create-list/create-list.component';
import { CreateTaskComponent } from 'src/app/components/modals/create-task/create-task.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModifyItemComponent } from 'src/app/components/modals/modify-item/modify-item.component';
import { ListActions } from 'src/app/enums/list-actions.model';
import { Actions } from 'src/app/enums/actions';
import { ViewTaskComponent } from 'src/app/components/modals/view-task/view-task.component';
import { ITEM_TYPE } from 'src/app/constants/item-types';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { HelperService } from 'src/app/services/helper.service';
import { SettingsComponent } from 'src/app/components/modals/settings/settings.component';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MyAccountComponent } from 'src/app/components/modals/my-account/my-account.component';
import { TagsListComponent } from 'src/app/components/modals/tags-list/tags-list.component';
import { List } from 'src/app/models/list.model';
import { ImageService } from 'src/app/services/image.service';
import { TASK_STATUS } from 'src/app/constants/task-status';
import { E } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  lists: List[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  inProgressLists: List[] = [];
  completedLists: List[] = [];
  tasks: any;
  displayInProgress: boolean = true;
  selectedList: any;
  percentCompleted: number | undefined;
  successEventData: Object | undefined;
  errorEventData: Object | undefined;

  dummyCounter:number = 0;
  incrementNumber = false;
  progressBarColor: any;
  
  userName: string = "";

  startedTasks: number = 0;

  readonly ITEM_TYPE = ITEM_TYPE;
  readonly ITEM_STATUS = ITEM_STATUS;
  readonly TASK_STATUS = TASK_STATUS;
  readonly profilePicture = window.sessionStorage.getItem("profilepicture");

  public searchFilter: any = "";

  showSearch: boolean = false;

  @HostBinding('class') class = 'center-component';

  constructor(private taskService: TaskService, private modalService: NgbModal,
    private token: TokenStorageService, private helperService: HelperService,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.getAllLists();
    this.userName = this.token.getUser().username;
    this.imageService.setProfilePicture();
  }

  groupLists() {
    this.inProgressLists = [];
    this.completedLists = [];

    for (let i = 0; i < this.lists.length; ++i) {
        if (this.lists[i].status == ITEM_STATUS.completed) {
          this.completedLists.push(this.lists[i]);
        } else if (this.lists[i].status == ITEM_STATUS.inProgress) {
          this.inProgressLists.push(this.lists[i]);
        }
    }
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
      if (response.length > 0) {
        this.lists = response;
        this.selectedList = this.lists[0];
        this.groupLists();
        this.getAllTasks(this.selectedList._id);
      }  else {
        this.inProgressLists = [];
        this.inProgressTasks = [];
        this.completedLists = [];
        this.completedTasks = [];
      }
    });
  }

  getAllTasks(listId: any) {
    this.inProgressTasks = [];
    this.completedTasks = [];

    this.taskService.getTasks(listId).subscribe((response: any) => {
      this.sortTasks(response);
      this.setTasksTimer(this.inProgressTasks);
      this.calculatePercentCompleted();
      this.setProgressbarColor();
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
    this.startedTasks = 0;
    this.showSearch = this.tasks.length > 0 ? true : false; 

    for (let i = 0; i < this.tasks.length; ++i) {
      tasks[i].status == ITEM_STATUS.inProgress ? this.inProgressTasks.push(tasks[i]) : this.completedTasks.push(tasks[i]);
      if (tasks[i].status == ITEM_STATUS.inProgress &&
        tasks[i].isStarted == TASK_STATUS.started) {
          this.startedTasks++;
        }
    }
    /* TODO */
    this.completedTasks.sort((objA:any, objB:any) => Number(new Date(objB.dateCompleted)) - Number(new Date(objA.dateCompleted)));
  }

  createNewList() {
    const modalRef = this.modalService.open(CreateListComponent);
    modalRef.componentInstance.createListConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.taskService.createList(response).subscribe((response: any) => {
          this.lists.push(response);
          if (this.lists.length == 1) {
            this.selectedList = response;
          }
          this.groupLists();
          this.showSuccessMessage(Actions.addList, response.title);
          this.incrementListNumberAnimation()
        }); 
      }
    })
  }

  incrementListNumberAnimation() {
    this.incrementNumber = true;
    setTimeout(() =>{ 
      this.incrementNumber = false;
    }, 2000);
  }
  
  createNewTask() {
    const modalRef = this.modalService.open(CreateTaskComponent);
    modalRef.componentInstance.createTaskConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.taskService.createTask(this.selectedList._id, response).subscribe((response: any) => {
          this.inProgressTasks.unshift(response);
          if (typeof this.tasks !== 'undefined') {
            this.tasks.unshift(response);
          } else {
            this.tasks = [];
            this.tasks.push(response);
          }

          this.calculatePercentCompleted();
          this.setProgressbarColor();
          this.showSuccessMessage(Actions.addTask, response.title);
        })
      }
    });
  }

  deleteThisTask(task : any, index:number, type: string) {
    const modalRef = this.modalService.open(DeleteItemComponent);
    modalRef.componentInstance.elementName = ITEM_TYPE.task;
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.taskService.deleteTask(this.selectedList._id, task._id).subscribe((response: any) =>  {
          if (type == ITEM_STATUS.completed) {
            this.completedTasks.splice(index, 1);
          } else if (type == ITEM_STATUS.inProgress) {
            this.inProgressTasks.splice(index, 1);
          }

          this.startedTasks--;
          this.tasks.length--;
          this.calculatePercentCompleted();
          this.setProgressbarColor();
          this.showSuccessMessage(Actions.deleteTask, task.title);
        })
      }
    })
  }

  modifyThisTask(task: any) {
    const modalRef = this.modalService.open(ModifyItemComponent);
    this.helperService.modalRefConfig(modalRef, ITEM_TYPE.task, task);

    modalRef.componentInstance.modifyItemConfirmation.subscribe((receivedData: any) => {
      if (receivedData.confirmation === true) {
        this.taskService.modifyTask(this.selectedList._id, task._id, receivedData).subscribe((response: any) => {
          task.title = receivedData.title;
          task.description = receivedData.description;
          task.observations = receivedData.observations;
          task.tags = receivedData.tags;
          this.showSuccessMessage(Actions.modifyTask, task.title);
        })
      }
    })
  }

  completeThisTask(task: any, index: number) {
    task.status = ITEM_STATUS.completed;
    task.dateCompleted = new Date();

    this.taskService.modifyTask(this.selectedList._id, task._id, task).subscribe((response: any) => {
      this.inProgressTasks.splice(index, 1);
      this.completedTasks.unshift(task);
      this.calculatePercentCompleted();
      this.setProgressbarColor();
      this.showSuccessMessage(Actions.completeTask, task.title);
      this.startedTasks--;
    })
  }

  notStartedTask(task: any) {
    this.showErrorMessage(Actions.completeTask, task.title);
  }

  openTaskModal(task: any) {
    const modalRef = this.modalService.open(ViewTaskComponent);
    modalRef.componentInstance.task = task;
  }

  changeTasksDisplayed() {
    this.displayInProgress = !this.displayInProgress;
  }

  showSettings() {
    const modalRef = this.modalService.open(SettingsComponent);
    modalRef.componentInstance.showMessage.subscribe((receivedData: any) => {
      this.showSuccessMessage(receivedData.message, receivedData.tagName);
    })
  }

  showTagsList() {
    const modalRef = this.modalService.open(TagsListComponent);
  }

  setProgressbarColor() {
    let percentCompleted = this.selectedList.percentCompleted;

    if (percentCompleted < 30) {
      this.progressBarColor = "danger";
    } else if (percentCompleted >=30 && percentCompleted < 70) {
      this.progressBarColor = "warning";
    } else if (percentCompleted >= 70) {
      this.progressBarColor = "success"
    }
  }

  listEvent(event:any) {
    if (event.listEvent == ListActions.selectList) {
      if  (this.selectedList._id != event.list._id) {
        this.selectedList = event.list;
        this.getAllTasks(event.list._id);
      }
    } else if (event.listEvent == ListActions.modifyList) {
      this.showSuccessMessage(Actions.modifyList, event.list.title)
    } else if (event.listEvent == ListActions.deleteList) {
      this.getAllLists();
      this.groupLists();
      this.showSuccessMessage(Actions.deleteList, event.list.title);
    } else if (event.listEvent == ListActions.completeList) {
      this.getAllLists();
      this.groupLists();
      this.showSuccessMessage(Actions.completeList, event.list.title);
    }
  }

  showSuccessMessage(event: any, title: any) {
    this.successEventData = {
      counter: this.dummyCounter++,
      eventType: event,
      elementName: title
    }
  }

  showErrorMessage(event: any, title: any) {
   this.errorEventData = {
      counter: this.dummyCounter++,
      eventType: event,
      elementName: title
    }
  }

  logOut() {
    this.token.signOut();
  }

  beginTask(task: any) {
    if (this.startedTasks < 2) {
      let date = new Date();
      let data = {
        dateStarted: date,
        isStarted: TASK_STATUS.started
      }
  
      this.taskService.modifyTask(this.selectedList._id, task._id, data).subscribe((response: any) => {
        task.dateStarted = date;
        task.isStarted = TASK_STATUS.started;
        this.incrementTaskWorkingTime(task);
        this.showSuccessMessage(Actions.beginTask, task.title);
        this.startedTasks ++;
      });
    } else {
      this.showErrorMessage(Actions.beginTask, task.title);
    }
  }

  pauseTask(task: any) {
    let date = new Date();

    let data = {
      datePaused: date,
      isStarted: TASK_STATUS.paused
    }

    this.taskService.modifyTask(this.selectedList._id, task._id, data).subscribe((response: any) => {
      task.isStarted = TASK_STATUS.paused;
      this.incrementTaskWorkingTime(task);
      this.showSuccessMessage(Actions.pauseTask, task.title);
    });
  }

  resumeTask(task: any) {
    let date = new Date();    
    let data = {
      dateStarted: date,
      isStarted: TASK_STATUS.started
    }

    this.taskService.modifyTask(this.selectedList._id, task._id, data).subscribe((response: any) => {
      task.isStarted = TASK_STATUS.started;
      this.incrementTaskWorkingTime(task);
      this.showSuccessMessage(Actions.resumeTask, task.title);
    });
  }

  cloneTask(task: any) {
    let data = {
      dateCreated: new Date(),
      taskId: task._id,
      listId: this.selectedList._id
    }
    this.taskService.cloneTask(data).subscribe((response: any) => {
      this.inProgressTasks.unshift(response);
      if (typeof this.tasks !== 'undefined') {
        this.tasks.unshift(response);
      } else {
        this.tasks = [];
        this.tasks.push(response);
      }

      this.calculatePercentCompleted();
      this.setProgressbarColor();
      this.showSuccessMessage(Actions.cloneTask, task.title);
    });
  }

  incrementTaskWorkingTime(task: any) {
    let dateNow, dateStarted;
    setInterval(() => {
      dateStarted = task.dateStarted;
      dateNow = new Date();
      task.workingTime = this.helperService.secondsToHoursMinutesSeconds(this.helperService.getSecondsDiff(new Date(dateStarted), dateNow));
    }, 1000);
  }

  setTasksTimer(tasks: any) {
    for (let i = 0; i < tasks.length; ++i) {
      if (tasks[i].isStarted == TASK_STATUS.started) {
        this.incrementTaskWorkingTime(tasks[i]);
      }
    }
  }

  openAccountModal() {
    const modalRef = this.modalService.open(MyAccountComponent);
    modalRef.componentInstance.username = this.userName;
    modalRef.componentInstance.changedPassword.subscribe(() => {
      this.showSuccessMessage(Actions.changedPassword, null);
    })
    modalRef.componentInstance.changedProfilePicture.subscribe((data: any) => {
      this.showSuccessMessage(Actions.changeProfilePicture, null);
    });
  }
}