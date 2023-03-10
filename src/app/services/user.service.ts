import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) { }
  
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  userRole(): Observable<any> {
    return this.http.get(API_URL + "userRole", { responseType: 'text' });
  }

  getUsers(): Observable<any> {
    return this.http.get(API_URL + "users", { responseType: 'json' });
  }
  
  deleteUser(id: any): Observable<any> {
    return this.http.delete(API_URL + "deleteUser/" + id);
  }

  makeAdmin(id: any): Observable<any> {
    return this.http.patch(API_URL + "giveAdminRights/" + id, {});
  }

  removeAdmin(id: any): Observable<any> {
    return this.http.patch(API_URL + "removeAdminRights/" + id, {});
  }
}