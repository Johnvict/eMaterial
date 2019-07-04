import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserdataService } from '../../providers/local/userdata.service';
import { UserDataComplete, Wallet, Transaction } from '../../interfaces/interface';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit, OnDestroy {

  subscriber: any;
  wallet: Wallet;
  transactions: Transaction[] = [];
  constructor(private usL: UserdataService) {
    this.subscriber = this.usL.userRemoteData.subscribe( (data: UserDataComplete) => {
      this.wallet = data.wallet;
      this.transactions = data.transactions;
      console.log(this.transactions, this.wallet);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  formatTimeDate(date) {
    return this.usL.getTimeFormat(date);
    // return DATE;
  }
  formatBoolean(val: number) {
    return val === 0 ? 'No' : 'Yes';
  }

}
