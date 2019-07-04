import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksPage } from './books.page';
// import { BooksMenuPage } from './books-menu/books-menu.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BooksPage }])
  ],
  declarations: [BooksPage]
})
export class BooksPageModule {}
