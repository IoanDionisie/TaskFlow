import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private webReqService: WebRequestService) { }

  createList(payload: any) {
    return this.webReqService.post('lists', payload);
  }

  getLists() {
    return this.webReqService.get('lists');
  }

  deleteList(listId: any) {
    let link = 'lists/' + listId;
    return this.webReqService.delete(link);
  }

  modifyList(listId: any, list: Object) {
    let link = 'lists/' + listId;
    return this.webReqService.patch(link, list);
  }

}
