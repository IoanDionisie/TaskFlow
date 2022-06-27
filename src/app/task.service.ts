import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  

  constructor(private webReqService: WebRequestService) { }

  createList(title: string) {
    // We want to send a web request to create a list
    return this.webReqService.post('lists', {title});
  }

  getLists() {
    return this.webReqService.get('lists');
  }

  getTasks(listId : any) {
    let link = 'lists/' + listId + '/tasks';
    return this.webReqService.get(link);
  }

  createTask(listId: any, task: Object) {
    let link = 'lists/' + listId + '/tasks';
    return this.webReqService.post(link, task);
  }
}
