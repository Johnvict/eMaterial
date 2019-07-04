import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'books-tab',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'books-tab',
        children: [
          {
            path: '',
            loadChildren: '../books/books.module#BooksPageModule'
            // loadChildren: '../menu/books-menu/books-menu.module#BooksMenuPageModule'
          },
          { path: 'reading', loadChildren: '../books/reading/reading.module#ReadingPageModule' },
          { path: 'recent', loadChildren: '../books/recent/recent.module#RecentPageModule' },
          { path: 'favourites', loadChildren: '../books/favourites/favourites.module#FavouritesPageModule' },
          { path: 'recommended', loadChildren: '../books/recommended/recommended.module#RecommendedPageModule' },
        ]
      },
      {
        path: 'account-tab',
        children: [
          {
            path: '',
            loadChildren: '../account/account.module#AccountPageModule'
            // loadChildren: '../menu/account-menu/account-menu.module#AccountMenuPageModule'
          },
          { path: 'profile', loadChildren: '../account/profile/profile.module#ProfilePageModule' },
          { path: 'subscriptions', loadChildren: '../account/subscriptions/subscriptions.module#SubscriptionsPageModule' },
        ]
      },
      {
        path: 'market-tab',
        children: [
          // {
          //   path: '',
          //   loadChildren: '../menu/market-menu/market-menu.module#MarketMenuPageModule'
          // },
          {
            path: '',
            loadChildren: '../market/market.module#MarketPageModule'
          },
          { path: 'subscribe', loadChildren: '../market/subscribe/subscribe.module#SubscribePageModule' },
          { path: 'credit', loadChildren: '../market/credit/credit.module#CreditPageModule' },
          { path: 'extra', loadChildren: '../market/extra/extra.module#ExtraPageModule' },
        ]
      },
      {
        path: 'settings-tab',
        children: [
          // {
          //   path: '',
          //   loadChildren: '../menu/settings-menu/settings-menu.module#SettingsMenuPageModule'
          // },
          {
            path: '',
            loadChildren: '../settings/settings.module#SettingsPageModule'
          },
          { path: 'privacy', loadChildren: '../settings/privacy/privacy.module#PrivacyPageModule' },
          { path: 'about', loadChildren: '../settings/about/about.module#AboutPageModule' },
          { path: 'feedback', loadChildren: '../settings/feedback/feedback.module#FeedbackPageModule' },
        ]
      },
      {
        path: '',
        redirectTo: 'tabs/books-tab',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
