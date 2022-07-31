import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {
  constructor(private router: Router) { }
  
  signOut(): void {
    console.log("Signing out!");
    window.sessionStorage.clear();
    this.router.navigate(['login']);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    console.log("Saving token: ", token);
  }

  public getToken(): string | null {
    console.log("Getting token: ", window.sessionStorage.getItem(TOKEN_KEY));
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    console.log("Saving user: ", JSON.stringify(user));
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    console.log("Getting user: ", window.sessionStorage.getItem(USER_KEY));
   
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      console.log(user);
      return JSON.parse(user);
    }
    return {};
  }
}