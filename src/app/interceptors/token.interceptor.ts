import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonService } from '../providers/common.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private cmP: CommonService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const token = localStorage.getItem('token');
        console.log(atob(token));
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: atob(token)
                }
            });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json',
                    Accept: 'application/json'
                }
            });
        }

        // request = request.clone({
        //     headers: request.headers.set('Accept', 'application/json')
        // });
        console.log(request.headers);

        console.log(request.headers);
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    if (event.body.loggedIn) {
                        console.log(event.body);
                        const secret = btoa(`Bearer ${event.body.token}`);
                        localStorage.setItem('data', JSON.stringify(event.body.userData));
                        localStorage.setItem('genData', JSON.stringify(event.body.genData));
                        localStorage.setItem('token', secret);
                    }
                }
                return event;
            }),
            // catchError(this.cmP.handleError('login', []))
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    //
                }
                return throwError(error);
            })
        );
    }
}
