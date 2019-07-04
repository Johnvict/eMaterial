import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'register', loadChildren: './general/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './general/login/login.module#LoginPageModule' },
  // { path: 'books-menu', loadChildren: './menu/books-menu/books-menu.module#BooksMenuPageModule' },
  // { path: 'account-menu', loadChildren: './menu/account-menu/account-menu.module#AccountMenuPageModule' },
  // { path: 'market-menu', loadChildren: './menu/market-menu/market-menu.module#MarketMenuPageModule' },
  // { path: 'settings-menu', loadChildren: './menu/settings-menu/settings-menu.module#SettingsMenuPageModule' },
  // { path: 'privacy', loadChildren: './settings/privacy/privacy.module#PrivacyPageModule' },
  // { path: 'about', loadChildren: './settings/about/about.module#AboutPageModule' },
  // { path: 'feedback', loadChildren: './settings/feedback/feedback.module#FeedbackPageModule' },

  // { path: 'profile', loadChildren: './account/profile/profile.module#ProfilePageModule' },
  // { path: 'subscriptions', loadChildren: './account/subscriptions/subscriptions.module#SubscriptionsPageModule' },

  // { path: 'subscribe', loadChildren: './market/subscribe/subscribe.module#SubscribePageModule' },
  // { path: 'credit', loadChildren: './market/credit/credit.module#CreditPageModule' },
  // { path: 'extra', loadChildren: './market/extra/extra.module#ExtraPageModule' },

  // { path: 'favourites', loadChildren: './books/favourites/favourites.module#FavouritesPageModule' },
  // { path: 'recent', loadChildren: './books/recent/recent.module#RecentPageModule' },
  // { path: 'recommended', loadChildren: './books/recommended/recommended.module#RecommendedPageModule' },
  // { path: 'reading', loadChildren: './books/reading/reading.module#ReadingPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
