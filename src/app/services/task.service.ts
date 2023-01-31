import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  
  constructor(private webReqService: WebRequestService) { }
  
  getTasks(listId : any) {
    let link = 'lists/' + listId + '/tasks';
    return this.webReqService.get(link);
  }

  createTask(listId: any, task: Object) {
    let link = 'lists/' + listId + '/tasks';
    return this.webReqService.post(link, task);
  }

  deleteTask(listId: any, taskId: any) {
    let link = 'lists/' + listId + '/tasks/' + taskId;
    return this.webReqService.delete(link);
  }

  modifyTask(listId: any, taskId: any, task: Object) {
    let link = 'lists/' + listId + '/tasks/' + taskId;
    return this.webReqService.patch(link, task);
  }

  modifyTaskDates(listId: any, taskId: any, task: Object) {
    let link = 'lists/' + listId + '/tasks/' + taskId + '/startPause';
    return this.webReqService.patch(link, task);
  }

  modifyTasks(listId: string, ids: string) {
    let link = 'lists/' + listId + '/reorderTasks';
    return this.webReqService.patch(link, {ids: ids});
  }
  
  cloneTask(data: any) {
    let link = 'lists/' + data.listId + '/cloneTask';
    return this.webReqService.post(link, data);
  }
}
