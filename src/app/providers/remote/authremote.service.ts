import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonService } from '../common.service';
import { UserData } from '../../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthremoteService {

  constructor(
    private athP: AuthService,
    private cmP: CommonService,
  ) { }


  loginRemote(userData: UserData) {
    this.athP.login(userData)
      .subscribe(resp => {
        if (resp.success) {
          this.cmP.showToast('Login Successful', 'middle', 5000, 'success');
          // this.router.navigate(['tabs']);
        }
      }, (err) => {
        this.cmP.showToast('Login Failure', 'middle', 'middle', 4000);
      });
  }
}
