import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITEM_TYPE } from './constants/item-types';


@Injectable({
    providedIn: 'root'
})
  
export class HelperService {
    readonly ITEM_TYPE = ITEM_TYPE;

   constructor() {

   }

  modalRefConfig(modalRef: any, type:  any, item: any) {
    if (type == ITEM_TYPE.task) {
      modalRef.componentInstance.elementName = ITEM_TYPE.task;
      modalRef.componentInstance.title = item.title;
      modalRef.componentInstance.description = item.description;
      modalRef.componentInstance.status = item.status;
      modalRef.componentInstance.observations = item.observations;
    } else if (type == ITEM_TYPE.list) {
        modalRef.componentInstance.elementName = ITEM_TYPE.list;
        modalRef.componentInstance.title = item.title;
        modalRef.componentInstance.description = item.description;
        modalRef.componentInstance.status = item.status;
        modalRef.componentInstance.observations = item.observations;
    }
  }
}