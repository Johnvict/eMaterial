import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonService } from '../providers/common.service';
import { Events } from '@ionic/angular';
import { UserdataService } from '../providers/local/userdata.service';


@Injectable()
export class TokenNewInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private events: Events,
        private commonProvider: CommonService,
        private usL: UserdataService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = atob(localStorage.getItem('token'));

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json'
                }
            });
        }

        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });

        console.log({ Headers: request });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    if (event.body.loggedIn) {
                        console.log(event.body);
                        const secret = btoa(`Bearer ${event.body.token}`);
                        const data = this.usL.data;
                        // localStorage.setItem('data', JSON.stringify(data));
                        localStorage.setItem('data', JSON.stringify(event.body.userData));
                        localStorage.setItem('genData', JSON.stringify(event.body.genData));
                        console.log(event.body.genData.course);
                        console.log(event.body.genData);

                        this.events.publish('remote login success');
                        localStorage.setItem('token', secret);
                    }
                }

                return event;
            }),

            catchError((error: HttpErrorResponse) => {
                console.log('Error', error);
                if (error.status === 401) {
                    //
                }
                // if (error.error.checkLogin && error.error.notHere) {
                //     this.commonProvider.showToast('Please Login again', 'Token Expired', 'warning');
                //     const userType: string = localStorage.getItem('userType');
                //     localStorage.clear();
                //     if (userType === 'admin') {
                //         this.router.navigate(['/admin']);
                //     } else {
                //         this.router.navigate(['/login']);
                //     }
                // }
                return throwError(error);

            })
        );
    }
}
