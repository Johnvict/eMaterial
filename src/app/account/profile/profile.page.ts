import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserdataService } from '../../providers/local/userdata.service';
import { UserDataComplete } from '../../interfaces/interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  userData: UserDataComplete;
  subscriber: any;
  constructor(private usL: UserdataService) {
    this.subscriber = this.usL.userRemoteData.subscribe( data => {
      this.userData = data;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}
