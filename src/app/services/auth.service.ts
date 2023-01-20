import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:3000/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {

    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  changePassword(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'changePassword', {
      username,
      password
    }, httpOptions);
  }

  changePasswordUsingMail(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'changePasswordUsingMail', {
      email,
      password
    }, httpOptions); 
  }

  resetPassword(email: any) {
    return this.http.post(AUTH_API + 'sendResetPasswordLink', {
      email
    }, httpOptions);
  }

  checkResetPasswordLink(queryParams: any) {
    let params = new HttpParams();
    for (let i in queryParams) {
      params = params.append(i, queryParams[i]);
    }
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params
    };
    
    return this.http.get(AUTH_API + 'checkResetPasswordLink', options);
  }
}