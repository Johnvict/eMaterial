import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserdataService } from '../../providers/local/userdata.service';
import { GeneralData, Sessions, NewSubscription, UserDataComplete } from '../../interfaces/interface';
import { CommonService } from '../../providers/common.service';
import { Router } from '@angular/router';
import { MarketService } from '../../providers/market.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit, OnDestroy {

  subscriber: any;
  subscriber2: any;
  sessions: Sessions[] = [];
  walletBalance = null;
  price: any = null;
  selectedSession: Sessions = { id: null, fullPrice: null, halfPrice: null };
  newSubscription: NewSubscription = { session: null, type: null };
  constructor(
    private router: Router,
    private usL: UserdataService,
    private cmP: CommonService,
    private mkP: MarketService
    ) {
    this.subscriber = this.usL.genData.subscribe(data => {
      this.sessions = data.sessions;
      console.log(this.sessions);
    });
    this.subscriber2 = this.usL.userRemoteData.subscribe( (data: UserDataComplete) => {
      this.walletBalance = data.wallet.balance;
      console.log(this.walletBalance);
    });
  }

ngOnInit() {
}

ngOnDestroy() {
  this.subscriber.unsubscribe();
  this.subscriber2.unsubscribe();
}

sessionSelected() {
  console.log(this.selectedSession);
  this.newSubscription.session = this.selectedSession.id;
}

saveSubscription() {
  this.price = this.sessions.filter((session: Sessions) => session.id === this.selectedSession.id)
  .map((sess: Sessions) => (this.newSubscription.type === 'full' ? this.selectedSession.fullPrice : this.selectedSession.halfPrice));
  if (this.walletBalance < this.price) {
    console.log(this.price);
    this.insufficientFund();
  } else {
    this.mkP.subscribeNew(this.newSubscription).subscribe( res => {
      console.log(res);
      if (res.duplicateSub) {
        this.cmP.showAlert(
          `Duplicate Subscription`,
          `You have a subscription already.
            If you had made a half subscription earlier kindly make another half to complete a full session subscription`,
          [
            { text: 'Ok' }
          ],
          false
        );
      }
      if (res.insufficient) {
        this.walletBalance = res.walletBalance;
        console.log(res);
        this.insufficientFund();
      } else if (res.success) {
        this.usL.updateWallet(res.wallet).then( rs => {
          console.log(rs);
          this.walletBalance = res.wallet.balance;
          this.cmP.showToast('Subcription made successfully', 'top', 5000, 'success');
          this.router.navigate(['tabs/books-tab']);
        });
      }
    });
  }
  console.log(this.newSubscription);
}

insufficientFund() {
  this.cmP.showAlert(
    `Insufficient Fund: (₦${this.walletBalance})`,
    `You need an additional of ₦${this.price[0] - this.walletBalance}. Do you wish to credit your wallet and try again?`,
    [
      { text: 'No' },
      { text: 'Yes', handler: () => this.router.navigate(['tabs/market-tab/credit']) }
    ],
    false
  );
}
}
