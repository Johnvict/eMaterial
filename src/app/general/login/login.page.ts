import { Component, OnInit } from '@angular/core';
import { UserData, LoginUser } from './../../interfaces/interface';
import { Router } from '@angular/router';

import { AuthService } from './../../providers/auth.service';
import { CommonService } from '../../providers/common.service';
import { DatabaseService } from '../../providers/database.service';
import { UserdataService } from '../../providers/local/userdata.service';
import { AuthlocalService } from '../../providers/local/authlocal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private attemptingUser: LoginUser = { username: null, password: null, harsh: null };
  // private deviceUserData: UserData = {username: null, password: null };   // remove on deploy
  private deviceUserData: UserData[] = [];         // ADD ON DEPLOY

  constructor(
    private db: DatabaseService,
    private router: Router,
    private athP: AuthService,
    private cmP: CommonService,
    private usL: UserdataService,
    private athL: AuthlocalService,
  ) {
    //  REMOVE THE FOLLOWING ON DEPLOY
    this.fetchUserData();
    // this.usL.fetchUserData.subscribe(data => {
    //   this.deviceUserData = data;
    // });
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        // this.userData = this.db.users;     //ON IMPLEMENTATION
        this.attemptingUser = JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  fetchUserData() {
    this.usL.fetchUserData.subscribe(data => {
      this.deviceUserData = data;
    });
    console.log('user data obtained', this.deviceUserData);
  }

  ngOnInit() {
    setTimeout(() => {
      localStorage.setItem('user',
      `[{"id":6,"remoteId":6,"username":"john","email":"john@test.com",
      "password":"$2a$04$I6Ny10ZZiXvuBAVW11Jny.h1YRC1azgf4aFnhd/kR1gWkoyEzn5zC"}]`
    );
      console.log('user data saved');
      this.fetchUserData();
    }, 3000);
  }

  async login() {
    console.log(this.attemptingUser);
    console.log(this.deviceUserData);
    let userFound = false;
    await this.deviceUserData.forEach((userData: UserData) => {
      if (userData.username.toLowerCase() === this.attemptingUser.username.toLowerCase()) {
        this.attemptingUser.harsh = userData.password;
        userFound = true;
      }
    });

    if (userFound) {
      const LOGGIN = await this.athL.loginDevice(this.attemptingUser);
      if (LOGGIN) {
        this.cmP.showToast('Welcome back ' + this.attemptingUser.username, 'top', 3000, 'success');
        this.router.navigate(['tabs']);
        this.cmP.showAlert(
          'Use App Online',
          'Do you wish to login to access online resources too?',
          [
            { text: 'No', handler: () => this.router.navigate(['tabs']) },
            { text: 'Yes', handler: () => {
              this.athP.login(this.attemptingUser).subscribe( res => {
                if (res.loggedIn) {
                  this.cmP.showToast('Remote login successful', 'bottom', 3000, 'success');
                }
              });
            } }
          ],
          false
          );
      } else {
        this.attemptingUser.username = null;
        this.cmP.showToast('Invalid Password', 'bottom', 3000, 'danger');
      }
    } else {
      this.cmP.showToast('Sorry, user not found', 'bottom', 3000, 'danger');
    }

  }

}
