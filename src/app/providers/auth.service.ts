import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CommonService } from './common.service';
import { UserData, LoginUser } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string;
  requestOptions: any;
  private logginStatus = false;

  constructor(
    private cmP: CommonService,
    public router: Router,
  ) {
    this.url = this.cmP.url;
    this.requestOptions = this.cmP.opts;
  }

  get isLoggedIn() {
    return this.logginStatus;
  }

  setLogginStatus(value: boolean) {
    this.logginStatus = value;
  }


  login(data: UserData): Observable<any> {
    return this.cmP.http.post<any>(`${this.url}loginUser`, data)
      .pipe(
        tap( res => {
          console.log(res);
          this.cmP.log('login successful');
          this.setLogginStatus(true);
        }),
        catchError(this.cmP.handleError('login', []))
      );
  }

  logout(): Observable<any> {
    return this.cmP.http.get<any>(`${this.url}signout`)
      .pipe(
        tap(_ => {
          this.cmP.log('Logout successful');
          this.setLogginStatus(true);
        }),
        catchError(this.cmP.handleError('Logout', []))
      );
  }

}


