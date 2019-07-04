import { Component, OnInit } from '@angular/core';
import { MenuPagesType } from '../interfaces/interface';
import { AccountService } from '../providers/account.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {
  private pages: MenuPagesType[];
  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.pages = this.accountService.allAccountMenuPages;
  }
}

