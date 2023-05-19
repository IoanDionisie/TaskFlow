import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})

export class HistoryService {


  constructor(private webReqService: WebRequestService) { }


  getHistory() {
    return this.webReqService.get("history");
  }
}
