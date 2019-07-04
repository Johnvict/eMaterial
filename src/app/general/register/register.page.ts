import { Component, OnInit } from '@angular/core';
import { UserData } from './../../interfaces/interface';
import { Router } from '@angular/router';
import { AccountService } from './../../providers/account.service';
import { CommonService } from './../../providers/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private passEqual = false;
  private visible  = false;
  private user: UserData = { username: null, email: null, password: null };
  constructor(
    private router: Router,
    private accP: AccountService,
    private cmP: CommonService,
    ) { }

  ngOnInit() {
  }


  async register() {
    console.log(this.user);
    this.accP.register({username: this.user.username, password: this.user.password});
    // this.cmP.showToast('Password is not equal to Confirm Password', 'bottom', 4000, 'danger');
  }


}
