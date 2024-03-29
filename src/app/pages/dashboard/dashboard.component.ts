import { NgbModal, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DeleteItemComponent } from 'src/app/components/dialogs/delete-item/delete-item.component';
import { CreateTaskComponent } from 'src/app/components/modals/create-task/create-task.component';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ModifyItemComponent } from 'src/app/components/modals/modify-item/modify-item.component';
import { ListActions } from 'src/app/enums/list-actions.model';
import { Actions } from 'src/app/enums/actions';
import { ViewTaskComponent } from 'src/app/components/modals/view-task/view-task.component';
import { ITEM_TYPE } from 'src/app/constants/item-types';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { SettingsComponent } from 'src/app/components/modals/settings/settings.component';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { MyAccountComponent } from 'src/app/components/modals/my-account/my-account.component';
import { TagsListComponent } from 'src/app/components/modals/tags-list/tags-list.component';
import { List } from 'src/app/models/list.model';
import { ImageService } from 'src/app/services/image.service';
import { TASK_STATUS } from 'src/app/constants/task-status';
import { TaskTimer } from 'tasktimer';
import * as global from 'src/app/constants/variables';
import { BehaviorSubject, Subscription } from 'rxjs';
import { trigger, transition, animate, style, state } from '@angular/animations'
import { ANIMATIONS } from 'src/app/constants/animations';
import { SearchTaskFilterPipe } from '../../pipes/search-task-filter.pipe';
import { StatusCirclesComponent } from '../../components/status-circles/status-circles.component';
import { DisplayTagsComponent } from '../../components/display-tags/display-tags.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { ListsComponent } from '../../components/lists/lists.component';
import { ErrorMessageComponent } from '../../components/dialogs/error-message/error-message.component';
import { SuccessMessageComponent } from '../../components/dialogs/success-message/success-message.component';
import { WorkBreakComponent } from 'src/app/components/work-break/work-break.component';
import { FacadeService } from 'src/app/services/facade.service';
import { ChangelogComponent } from 'src/app/components/modals/changelog/changelog.component';
import { CustomPaginatorComponent } from 'src/app/components/custom-paginator/custom-paginator.component';
import { TestingComponent } from './testing/testing.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WelcomePageComponent } from 'src/app/components/modals/welcome-page/welcome-page.component';
import { TUTORIAL_STEPS } from 'src/app/constants/tutorialsteps';
import { USER_ROLES } from 'src/app/constants/user-roles';
import { Router } from '@angular/router';
import { UsersComponent } from 'src/app/components/modals/users/users.component';
import { HistoryComponent } from 'src/app/components/modals/history/history.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        trigger('slideAnimation', [
            state('completed', style({ transform: 'translateX(150%)' })),
            state('deleted', style({ transform: 'translateX(-150%)' })),
            transition(`* => ${ANIMATIONS.completed}`, animate(500)),
            transition(`* => ${ANIMATIONS.deleted}`, animate(500)),
        ]),
        trigger('cloneTaskAnimation', [
            state('default', style({ transform: 'translateX(150%)' })),
            state('cloned', style({ transform: 'translateX(0)' })),
            transition(`${ANIMATIONS.default} => ${ANIMATIONS.cloned}`, animate(500)),
        ]),
    ],
    standalone: true,
    imports: [TestingComponent, WorkBreakComponent,
       CustomPaginatorComponent, NgbDropdown, NgbDropdownToggle,
        NgbDropdownMenu, SuccessMessageComponent, ErrorMessageComponent,
         ListsComponent, NgIf, FormsModule, MatTabsModule, DragDropModule,
          NgForOf, DisplayTagsComponent, NgClass, StatusCirclesComponent,
           NgbTooltip, SearchTaskFilterPipe, NgxSpinnerModule]
})

export class DashboardComponent implements OnInit {
  lists: List[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  inProgressLists: List[] = [];
  completedLists: List[] = [];
  shownInProgressTasks: Task[] = [];
  shownCompletedTasks: Task[] = [];
  tasks: any;
  displayInProgress: boolean = true;
  selectedList: any;
  percentCompleted: number | undefined;
  successEventData: Object | undefined;
  errorEventData: Object | undefined;

  dummyCounter:number = 0;

  progressBarColor: any;

  userName: string = "";

  startedTasks: number = 0;

  tagsObject: any = {};

  version = global.version;

  readonly ITEM_TYPE = ITEM_TYPE;
  readonly ITEM_STATUS = ITEM_STATUS;
  readonly TASK_STATUS = TASK_STATUS;
  readonly USER_ROLES = USER_ROLES;
  profilePicture: any;
  public searchFilter: any = "";
  showSearch: boolean = false;

  setProfilePicture: Subscription = new Subscription();

  timers: Map<string, TaskTimer> = new Map<string, TaskTimer>();

  @HostBinding('class') class = 'center-component';

  inProgressSelected: boolean = true;

  private testObservableSource = new BehaviorSubject<any>(null);
  testObservable = this.testObservableSource.asObservable();

  listChanged: boolean = false;

  foundResults: number = 0;

  @ViewChild(CustomPaginatorComponent)
  private customPaginatorComponent: CustomPaginatorComponent | undefined;
  paginatorStartIndex: number = 0;
  paginatorEndIndex: number = 0;
  selectedPage: number = 0;

  showPagination: boolean = true;

  tutorialStep: number = -1;
  tutorialStepText: string = "";
  userRole: string = USER_ROLES.USER;

  constructor(private modalService: NgbModal,
    private facadeService: FacadeService,
    private imageService: ImageService,
    private router: Router) { }


  ngOnDestroy(): void {
    this.timers.forEach((timer: TaskTimer) => {
      timer.stop();
    });

    if (this.setProfilePicture) {
      this.setProfilePicture.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.userName = this.facadeService.getUser().username;
    this.imageService.setProfilePicture();
    this.setProfilePicture = this.imageService.profilePicture$.subscribe((response: any) => {
      this.profilePicture = response;
    });

    this.facadeService.getUserRole().subscribe(value => {
      console.log(value);
      this.userRole = value;
    });

    if (this.facadeService.getShowTutorial() !== "false") {
      let modalRef = this.modalService.open(WelcomePageComponent);
      modalRef.componentInstance.tutorial.subscribe((response: any) => {
        if (response == true) {
          this.showTutorial();
        } else {
          this.facadeService.storeShowTutorial("false");
          this.getAllLists();
        }
      });
    } else {
      this.getAllLists();
    }
  }

  showTutorial() {
    this.tutorialStep = 1;
    this.tutorialStepText = TUTORIAL_STEPS.createList;
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
    moveItemInArray(this.inProgressTasks, event.previousIndex + this.paginatorStartIndex, event.currentIndex + this.paginatorStartIndex);
    this.changeArrayOrder(this.inProgressTasks);
  }

  changeArrayOrder(tasks: any) {
    this.facadeService.modifyTasks(this.selectedList._id, tasks.map((task: any) =>  task._id)).subscribe((response: any) => {
    });
  }

  getAllLists() {
    this.facadeService.getLists().subscribe((response: any) => {
      if (response.length > 0) {
        this.lists = response;
        this.selectedList = this.lists[0];
        this.groupLists();
        this.getAllTasks(this.selectedList._id, ITEM_STATUS.inProgress);
      }  else {
        this.inProgressLists = [];
        this.inProgressTasks = [];
        this.completedLists = [];
        this.completedTasks = [];
      }
    });
  }

  getAllTasks(listId: any, listStatus: string) {
    this.inProgressTasks = [];
    this.completedTasks = [];

    this.facadeService.getTasks(listId).subscribe((response: any) => {
      this.sortTasks(response);
      this.setTasksTimer(this.inProgressTasks);
      this.calculatePercentCompleted();
      this.setProgressbarColor();
      this.createTagsStatistics();

      if (listStatus == ITEM_STATUS.inProgress) {
        this.customPaginatorComponent?.loadList(this.inProgressTasks);
      } else if (listStatus == ITEM_STATUS.completed) {
        this.customPaginatorComponent?.loadList(this.completedTasks);
      }

      let pageSize;
      if (this.facadeService.getPageSize() == null) {
        this.facadeService.storePageSize(global.defaultPageSize);
        pageSize = global.defaultPageSize;
      } else {
        pageSize = this.facadeService.getPageSize();
      }

      this.shownInProgressTasks = this.inProgressTasks.slice(0, Number(pageSize));
      this.shownCompletedTasks = this.completedTasks.slice(0, Number(pageSize));
    });
  }

  createTagsStatistics() {
    const tagsMap = new Map();
    var tagsArray = [];
    var colorScheme = [];

    for (var task of this.tasks) {
      for (var tag of task.tags) {
        if (tagsMap.has(tag.title)) {
          tag.value = tagsMap.get(tag.title).value + 1;
          tagsMap.set(tag.title, tag);
        } else {
          tag.value = 1;
          tagsMap.set(tag.title, tag);
        }
      }
    }

    for (var tag of tagsMap.values()) {
      tagsArray.push({name: tag.title, value: tag.value});
      colorScheme.push(tag.color);
    }

    this.tagsObject = {
      tagsArray: tagsArray,
      colorScheme: colorScheme
    };
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
    this.completedTasks.sort((objA:any, objB:any) => Number(new Date(objB.dateCompleted)) - Number(new Date(objA.dateCompleted)));
  }

  createNewTask() {
    const modalRef = this.modalService.open(CreateTaskComponent);
    modalRef.componentInstance.createTaskConfirmation.subscribe((response: any) => {
      if (response.confirmation === true) {
        this.facadeService.createTask(this.selectedList._id, response).subscribe((response: any) => {
          let pageSize = Number( this.facadeService.getPageSize());
          if (this.selectedPage == 0) {
            this.inProgressTasks.unshift(response);
            this.shownInProgressTasks.unshift(response);
            if (this.shownInProgressTasks.length > pageSize) {
              this.shownInProgressTasks.pop();
            }
          } else {
            this.selectedPage = 0;
            let startIndex = 0;
            let endIndex = pageSize;
            this.inProgressTasks.unshift(response);
            this.customPaginatorComponent?.loadList(this.inProgressTasks);
            this.shownInProgressTasks = this.inProgressTasks.slice(startIndex, endIndex);
          }
          this.customPaginatorComponent?.modifyPageCount(this.inProgressTasks);


          if (typeof this.tasks !== 'undefined') {
            this.tasks.unshift(response);
          } else {
            this.tasks = [];
            this.tasks.push(response);
          }


          this.calculatePercentCompleted();
          this.setProgressbarColor();
          this.showSuccessMessage(Actions.addTask, response.title);

          if (this.tutorialStep == 3) {
            this.tutorialStep = 4;
            this.tutorialStepText = TUTORIAL_STEPS.startTask;
          }
        })
      }
    });
  }

  deleteThisTask(task : any, index:number, type: string) {
    const modalRef = this.modalService.open(DeleteItemComponent);
    modalRef.componentInstance.elementName = ITEM_TYPE.task;
    modalRef.componentInstance.removeConfirmation.subscribe((receivedData: any) => {
      if (receivedData === true) {
        this.facadeService.deleteTask(this.selectedList._id, task._id).subscribe((response: any) =>  {
          task.animation = ANIMATIONS.deleted;
          let pageSize = Number(this.facadeService.getPageSize());
          let startIndex = this.selectedPage * pageSize;
          let endIndex = (this.selectedPage + 1) * pageSize;

          var timer = setInterval(() => {
            if (type == ITEM_STATUS.completed) {
              this.completedTasks.splice(startIndex + index, 1);
              this.customPaginatorComponent?.modifyPageCount(this.completedTasks);
              if (this.completedTasks.length % pageSize == 0 && this.completedTasks.length > 0 && this.selectedPage > 0) {
                this.selectedPage --;
                this.customPaginatorComponent?.modifySelectedPage(this.selectedPage);
                startIndex = this.selectedPage * pageSize;
                endIndex = (this.selectedPage + 1) * pageSize;
              }
              this.shownCompletedTasks = this.completedTasks.slice(startIndex, endIndex);

            } else if (type == ITEM_STATUS.inProgress) {
              this.inProgressTasks.splice(startIndex + index, 1);
              this.customPaginatorComponent?.modifyPageCount(this.inProgressTasks);
              if (this.inProgressTasks.length % pageSize == 0 && this.inProgressTasks.length > 0 && this.selectedPage > 0) {
                this.selectedPage --;
                this.customPaginatorComponent?.modifySelectedPage(this.selectedPage);
                startIndex = this.selectedPage * pageSize;
                endIndex = (this.selectedPage + 1) * pageSize;
              }
              this.shownInProgressTasks = this.inProgressTasks.slice(startIndex, endIndex);
            }

            this.startedTasks--;
            this.tasks.length--;
            this.calculatePercentCompleted();
            this.setProgressbarColor();
            this.showSuccessMessage(Actions.deleteTask, task.title);
            clearInterval(timer);
          }, 500);
        })
      }
    })
  }

  modifyThisTask(task: any) {
    const modalRef = this.modalService.open(ModifyItemComponent);
    this.facadeService.modalRefConfig(modalRef, ITEM_TYPE.task, task);

    modalRef.componentInstance.modifyItemConfirmation.subscribe((receivedData: any) => {
      if (receivedData.confirmation === true) {
        this.facadeService.modifyTask(this.selectedList._id, task._id, receivedData).subscribe((response: any) => {
          task.title = receivedData.title;
          task.description = receivedData.description;
          task.observations = receivedData.observations;
          task.estimation = receivedData.estimation;
          task.tags = receivedData.tags;
          this.showSuccessMessage(Actions.modifyTask, task.title);
        })
      }
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
    modalRef.componentInstance.tutorialStep = this.tutorialStep;
    modalRef.componentInstance.showMessage.subscribe((receivedData: any) => {
      this.showSuccessMessage(receivedData.message, receivedData.tagName);
      if (receivedData.message == Actions.importData) {
        this.ngOnInit();
      } else if (receivedData.message == Actions.addTagTutorial) {
        this.tutorialStep = 3;
        this.tutorialStepText = TUTORIAL_STEPS.createTask;
      }
    })
  }

  showTagsList() {
    const modalRef = this.modalService.open(TagsListComponent);
    modalRef.componentInstance.showMessage.subscribe((receivedData: any) => {
        this.showSuccessMessage(receivedData.message, receivedData.tagName);
        if (receivedData.refresh) {
          this.ngOnInit();
        }
    });
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
        this.searchFilter = "";
        this.showPagination = true;
        this.listChanged = false;
        this.getAllTasks(event.list._id, event.list.status);
        var timer = setInterval(() => {
          this.listChanged = true;
          clearInterval(timer);
        }, 1000);
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
    } else if (event.listEvent == ListActions.addList) {
      this.getAllLists();
      this.showSuccessMessage(Actions.addList, event.list.title);
    } else if (event.listEvent == ListActions.addListTutorial) {
      this.getAllLists();
      this.showSuccessMessage(Actions.addList, event.list.title);
      this.tutorialStep = 2;
      this.tutorialStepText = TUTORIAL_STEPS.createTags;
    } else if (event.listEvent == ListActions.completeListTutorial) {
      this.getAllLists();
      this.showSuccessMessage(Actions.completeList, event.list.title);
      this.tutorialStep = 7;
      this.tutorialStepText = TUTORIAL_STEPS.finishTutorial;

      var timer = setInterval(() => {
        this.facadeService.storeShowTutorial("false");
        this.tutorialStep = -1;
        clearInterval(timer);
      }, 5000);
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
    this.facadeService.showSpinner();
    var logoutInterval = setInterval(() => {
      this.facadeService.signOut();
      this.facadeService.hideSpinner();
      clearInterval(logoutInterval);
    }, 1500);
  }

  beginTask(task: any) {
    if (this.startedTasks < 2) {
      let data = {
        date: new Date(),
        isStarted: TASK_STATUS.started,
        workIntervals: task.workIntervals
      }

      this.facadeService.modifyTaskDates(this.selectedList._id, task._id, data).subscribe((response: any) => {
        task.isStarted = TASK_STATUS.started;
        task.workIntervals = response;
        this.incrementTaskWorkingTime(task);
        this.showSuccessMessage(Actions.beginTask, task.title);
        this.startedTasks ++;

        if (this.tutorialStep == 4) {
          this.tutorialStep = 5;
          this.tutorialStepText = TUTORIAL_STEPS.finishTask;
        }
      });
    } else {
      this.showErrorMessage(Actions.beginTask, task.title);
    }
  }

  pauseTask(task: any) {
    let data = {
      date: new Date(),
      isStarted: TASK_STATUS.paused,
      workIntervals: task.workIntervals
    }

    this.facadeService.modifyTaskDates(this.selectedList._id, task._id, data).subscribe((response: any) => {
      task.isStarted = TASK_STATUS.paused;
      task.showTimer = false;
      this.removeTimer(task._id);
      task.workIntervals = response;
      this.showSuccessMessage(Actions.pauseTask, task.title);
    });
  }

  resumeTask(task: any) {
    let data = {
      date: new Date(),
      isStarted: TASK_STATUS.started,
      workIntervals: task.workIntervals
    }

    this.facadeService.modifyTaskDates(this.selectedList._id, task._id, data).subscribe((response: any) => {
      task.isStarted = TASK_STATUS.started;
      task.workIntervals = response;
      this.incrementTaskWorkingTime(task);
      this.showSuccessMessage(Actions.resumeTask, task.title);
    });
  }

  completeTask(task: any, index: number) {
    let now = new Date();
    task.status = ITEM_STATUS.completed;
    let totalWorkingTime = this.calculateTotalWorkingTime(task, now);

    let data = {
      date: now,
      isStarted: TASK_STATUS.completed,
      workIntervals: task.workIntervals,
      status: ITEM_STATUS.completed,
      totalWorkingTime: totalWorkingTime
    }

    this.facadeService.modifyTaskDates(this.selectedList._id, task._id, data).subscribe((response: any) => {
      task.animation = ANIMATIONS.completed;
      var timer = setInterval(() => {
        task.totalWorkingTime = totalWorkingTime;
        task.dateCompleted = now;

        let pageSize = Number(this.facadeService.getPageSize());
        let startIndex = this.selectedPage * pageSize;
        let endIndex = (this.selectedPage + 1) * pageSize;

        this.inProgressTasks.splice(startIndex + index, 1);
        this.customPaginatorComponent?.modifyPageCount(this.inProgressTasks);
        if (this.inProgressTasks.length % pageSize == 0 && this.inProgressTasks.length > 0 && this.selectedPage > 0) {
          this.selectedPage --;
          this.customPaginatorComponent?.modifySelectedPage(this.selectedPage);
          startIndex = this.selectedPage * pageSize;
          endIndex = (this.selectedPage + 1) * pageSize;
        }
        this.shownInProgressTasks = this.inProgressTasks.slice(startIndex, endIndex);

        this.completedTasks.unshift(task);
        this.shownCompletedTasks.unshift(task);

        this.calculatePercentCompleted();
        this.setProgressbarColor();
        this.showSuccessMessage(Actions.completeTask, task.title);
        this.startedTasks--;
        task.animation = ANIMATIONS.none;

        if (this.tutorialStep == 5) {
          this.tutorialStep = 6;
          this.tutorialStepText = TUTORIAL_STEPS.finishList;
        }

        clearInterval(timer);
      }, 500);
    })
  }

  calculateTotalWorkingTime(task: any, date: Date) {
    task.workIntervals.push({
      date: date,
      type: TASK_STATUS.completed
    });

    var totalTime = 0;
    for (let i = 0; i < task.workIntervals.length; i++) {
      if (i % 2 == 0) {
        totalTime += this.facadeService.getSecondsDiff(new Date(task.workIntervals[i].date), new Date(task.workIntervals[i+1].date));
      }
    }
    return this.facadeService.secondsToHoursMinutesSeconds(totalTime);
  }

  cloneTask(task: any) {
    let data = {
      dateCreated: new Date(),
      taskId: task._id,
      listId: this.selectedList._id
    }
    this.facadeService.cloneTask(data).subscribe((response: any) => {
      response.animation = ANIMATIONS.default;

      let pageSize = Number( this.facadeService.getPageSize());
      if (this.selectedPage == 0) {
          this.inProgressTasks.unshift(response);
          this.shownInProgressTasks.unshift(response);
          if (this.shownInProgressTasks.length > pageSize) {
            this.shownInProgressTasks.pop();
          }
      } else {
        this.selectedPage = 0;
        let startIndex = 0;
        let endIndex = pageSize;
        this.inProgressTasks.unshift(response);
        this.customPaginatorComponent?.loadList(this.inProgressTasks);
        this.shownInProgressTasks = this.inProgressTasks.slice(startIndex, endIndex);
      }
      this.customPaginatorComponent?.modifyPageCount(this.inProgressTasks);


      if (typeof this.tasks !== 'undefined') {
        this.tasks.unshift(response);
      } else {
        this.tasks = [];
        this.tasks.push(response);
      }

      this.calculatePercentCompleted();
      this.setProgressbarColor();
      this.showSuccessMessage(Actions.cloneTask, task.title);

      var timer = setInterval(() => {
        response.animation = ANIMATIONS.cloned;
        clearInterval(timer);
      }, 500);
    });
  }

  incrementTaskWorkingTime(task: any) {
    let workIntervals = task.workIntervals;
    let timeWorkedSoFar = 0;
    let timer = this.timers.get(task._id);
    let dateStarted = new Date(workIntervals[workIntervals.length - 1].date);
    task.showTimer = true;

    for (let i = 0; i < workIntervals.length; i = i + 2) {
      if (workIntervals[i + 1] != undefined)
        timeWorkedSoFar += this.facadeService.getSecondsDiff(new Date(workIntervals[i].date), new Date(workIntervals[i + 1].date));
    }

    if (!timer) {
      timer = new TaskTimer();
      timer.add([
        {
            id: task._id,
            totalRuns: 0,
            callback(task) {}
        }
      ]);
      timer.on('tick', () => {
        task.workingTime = this.facadeService.secondsToHoursMinutesSeconds(this.facadeService.getSecondsDiff(dateStarted, new Date()) + timeWorkedSoFar);
      });

      timer.start();

      this.timers.set(task._id, timer);
    } else {
      timer.on('tick', () => {
        task.workingTime = this.facadeService.secondsToHoursMinutesSeconds(this.facadeService.getSecondsDiff(dateStarted, new Date()) + timeWorkedSoFar);
      });

      timer.start();
    }
  }

  removeTimer(taskId: string) {
    let timer = this.timers.get(taskId);
    if (timer) {
      timer.removeAllListeners();
    }
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
      this.setProfilePicture = this.imageService.profilePicture$.subscribe(response => {
        this.profilePicture = response;
      })
    });
  }

  showChangelog() {
    this.facadeService.getChangelog().subscribe(data => {
      const modalRef = this.modalService.open(ChangelogComponent);
      modalRef.componentInstance.changelog = data;
    })
  }

  paginatorEvent(event: any) {
    let pageSize = event.pageSize;
    let selectedPage = event.selectedPage;
    let pageSizeChanged = event.pageSizeChanged;
    let startIndex = selectedPage * pageSize;
    let endIndex = (selectedPage + 1) * pageSize;
    this.paginatorStartIndex = startIndex;
    this.selectedPage = selectedPage;

    if (pageSizeChanged) {
      this.shownInProgressTasks = this.inProgressTasks.slice(startIndex, endIndex);
      this.shownCompletedTasks = this.completedTasks.slice(startIndex, endIndex);
    } else {
      if (this.inProgressSelected)
        this.shownInProgressTasks = this.inProgressTasks.slice(startIndex, endIndex);
      else
        this.shownCompletedTasks = this.completedTasks.slice(startIndex, endIndex);
    }
  }

  tasksTabChange(event: any) {
    this.inProgressSelected = event.index == 0 ? true : false;

    if (this.selectedList.status == ITEM_STATUS.completed) {
      this.inProgressSelected = false;
    }

    if (this.customPaginatorComponent) {
      this.customPaginatorComponent.loadList(this.inProgressSelected == true ? this.inProgressTasks : this.completedTasks);
    }

    this.searchFilter = "";
    this.showPagination = true;

    let param = {
      selectedPage: 0,
      pageSize: Number(this.facadeService.getPageSize()),
      pageSizeChanged: false
    }
    this.paginatorEvent(param);
  }

  searchValueChanged(event: any) {
    let searchValue = event.target.value;
    if (searchValue != "") {
      this.showPagination = false;
      this.shownInProgressTasks = this.inProgressTasks;
      this.shownCompletedTasks = this.completedTasks;
      let pipe = new SearchTaskFilterPipe();
      this.foundResults = this.inProgressSelected == true ? pipe.transform(this.shownInProgressTasks, searchValue).length : pipe.transform(this.shownCompletedTasks, searchValue).length;
    } else {
      this.shownInProgressTasks = this.inProgressTasks.slice(0, Number(this.facadeService.getPageSize()));
      this.shownCompletedTasks = this.completedTasks.slice(0, Number(this.facadeService.getPageSize()));
      this.customPaginatorComponent?.modifySelectedPage(0);
      this.showPagination = true;
    }
  }

  openHistoryPage() {
    this.modalService.open(HistoryComponent);
  }

  showUsers() {
    this.modalService.open(UsersComponent);
  }
}
