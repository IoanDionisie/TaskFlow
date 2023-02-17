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

}