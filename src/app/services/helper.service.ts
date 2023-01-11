import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITEM_TYPE } from '../constants/item-types';
import linkifyHtml from 'linkify-html';


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
      modalRef.componentInstance.tags = item.tags;
    } else if (type == ITEM_TYPE.list) {
        modalRef.componentInstance.elementName = ITEM_TYPE.list;
        modalRef.componentInstance.title = item.title;
        modalRef.componentInstance.description = item.description;
        modalRef.componentInstance.status = item.status;
        modalRef.componentInstance.observations = item.observations;
    }
  }

  secondsToHoursMinutesSeconds (sec_num: any): string {
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let strHours = hours.toString(), strMinutes = minutes.toString(), strSeconds = seconds.toString();

    if (hours   < 10) {
      strHours   = "0" + hours;
    } 
    if (minutes < 10) {
      strMinutes = "0" + minutes;
    }
    if (seconds < 10) {
      strSeconds = "0" + seconds;
    }

    return strHours+':'+strMinutes+':'+strSeconds;
  }

  getSecondsDiff(startDate: any, endDate: any) {
    const msInSecond = 1000;
    return Math.round(
      Math.abs(endDate - startDate) / msInSecond
    );
  }

  linkifyText(text: string) {
    const options = { defaultProtocol: 'https', target: "_blank"};

    return linkifyHtml(text, options);
  }

  convertDate(date: any) {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }
}   