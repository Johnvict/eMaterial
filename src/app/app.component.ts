import { Component } from '@angular/core';

import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BookService } from './providers/book.service';
import { MenuPagesType } from './interfaces/interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  selectedPath = '';
  pages: MenuPagesType[];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuController,
    private events: Events,
    private bookService: BookService,
  ) {
    this.initializeApp();
    this.events.subscribe('App Routed', url => {
      console.log(this.selectedPath = url);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.menu.swipeEnable(true);
      this.pages = this.bookService.allBookMenuPages;
    });
  }
}
