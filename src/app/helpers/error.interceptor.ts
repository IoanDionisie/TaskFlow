import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
    constructor(private toaster: ToastrService) { }
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                    console.log('This is client side error');
                    errorMsg = `Error: ${error.error.message}`;
                } else {
                    console.log('This is server side error');
                    errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                }
                this.toaster.error(error.error.message);
                return throwError(() => errorMsg);
            })
        );
    }
}

export const errorInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];