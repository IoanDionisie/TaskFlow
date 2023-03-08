import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

    constructor() {}

    public storePageSize(pageSize: number) {
        localStorage.setItem('pageSize', pageSize.toString());
    }

    public getPageSize() {
        return localStorage.getItem('pageSize');
    }

    public storeShowTutorial(showTutorialValue: string, userId: string) {
        let showTutorialString = 'showTutorial' + userId;
        localStorage.setItem(showTutorialString, showTutorialValue);
    }

    public getShowTutorial(userId: string) {
        let showTutorialString = 'showTutorial' + userId;
        return localStorage.getItem(showTutorialString);
    }

}