import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CommonService } from './common.service';
import { UserData, MenuPagesType } from '../interfaces/interface';
import { AuthService } from './auth.service';
import { UserdataService } from './local/userdata.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountMenuPages: MenuPagesType[] = [
    {
      title: 'Profile',
      url: '/tabs/account-tab/profile',
      icon: 'person'
    },
    {
      title: 'Subscriptions',
      url: '/tabs/account-tab/subscriptions',
      icon: 'information-circle'
  }
  ];

  constructor(
    private router: Router,
    private db: DatabaseService,
    private auth: AuthService,
    private cmP: CommonService,
    private usL: UserdataService,
  ) {

    this.db.getProfileCompletionStatus().subscribe(completed => {
      // if profile is not setup competely then promts user to do so
      if (!completed) {
        // SHOW ALERT TO COMPLETE PROFILE;
        // this.commonProvider.showAlert(
        //   'Uncomplete Profile',
        //   'Click Ok to complete your profile',
        //   [{ text: 'Ok', handler: () => this.router.navigate(['/profile-setup']) }],
        //   false
        // );
      }
    });
  }

  get allAccountMenuPages() {
    return this.accountMenuPages;
  }

  async register(data: UserData) {
    return this.registerRemote(data).subscribe(res => {
      console.log(res);
      if (res.duplicate) {
        // DONT FORGET THE DEVICE ID MUST BE SENT FOR REGISTRATION AS WELL
        // WE MUST ALSO GIVE USERS PERMISION TO CHANGE DEVICE n TIMES
        this.cmP.showAlert('Duplicate Registration', 'Sorry, you cannot register more than once.',
          [
            { text: 'Ok', handler: () => this.router.navigate(['/login']) },    // LET THIS RECREATE USER DATA ON DEVICE
            { text: 'Login Now', handler: () => this.router.navigate(['/login']) }
          ],
          false);
      } else if (res.success) {
        const resUserData: UserData = res.userData;
        resUserData.password = data.password;
        this.usL.saveUserRegData(resUserData).then( () => {
          this.cmP.showToast('Registration Successful', 'bottom', 3000, 'success');
          this.router.navigate(['login']);
        });
      }
    }, (err) => {
      this.cmP.showToast('Registration Failure: ' + err, 'middle', 5000, 'bottom');
    });
  }

  registerRemote(userData: UserData): Observable<any> {
    console.log('USer DAta for reg', userData);
    return this.cmP.http.post<any>(`${this.cmP.url}createUser`, userData, this.cmP.opts)
      .pipe(
        tap(_ => this.cmP.log('Registration Successful', 'bottom', 'success')),
        catchError(this.cmP.handleError('Registration', []))
      );
  }

}
