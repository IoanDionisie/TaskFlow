import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../token-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  implements CanActivate {

constructor(private token: TokenStorageService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log("canActivate", this.token.getToken());
        if (this.token.getToken()) {
            return true;
        }
        window.alert('You have to be logged in to have access to this page!');
        this.router.navigate(['/login']);
        return false;
  }
}