import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  implements CanActivate {

constructor(private token: TokenStorageService, private router: Router) {}

    canActivate(routerSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.token.getToken()) {
            return true;
        }

        if (this.checkGoogleLogin(routerSnapshot)) {
            return true;
        }

        window.alert('You have to be logged in to have access to this page!');
        this.router.navigate(['/login']);
        return false;
  }

  checkGoogleLogin(routerSnapshot: ActivatedRouteSnapshot): boolean {
    var data;
    var accessToken: string;

    if (routerSnapshot.queryParams["accessToken"]) {
        accessToken = routerSnapshot.queryParams["accessToken"];
        this.token.saveToken(accessToken);
    } else {
        return false;
    }

    if (routerSnapshot.queryParams["username"]) {
        data = {
            username: routerSnapshot.queryParams["username"],
            accessToken: routerSnapshot.queryParams["accessToken"]
        }
        this.token.saveUser(data);
    } else {
        return false;

    }

    return true;
  }
}