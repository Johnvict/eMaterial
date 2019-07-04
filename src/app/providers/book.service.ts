import { Injectable } from '@angular/core';
import { MenuPagesType } from '../interfaces/interface';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private bookMenuPages: MenuPagesType[] = [
    {
      title: 'Last Read',
      url: '/tabs/books-tab/reading',
      icon: 'book'
    },
    {
      title: 'Recent Books',
      url: '/tabs/books-tab/recent',
      icon: 'bookmarks'
    },
    {
      title: 'Favourite Books',
      url: '/tabs/books-tab/favourites',
      icon: 'star'
    },
    {
      title: 'Recommended Books',
      url: '/tabs/books-tab/recommended',
      icon: 'trending-up'
    }
  ];
  constructor(private cmP: CommonService) { }

  get allBookMenuPages() {
    return this.bookMenuPages;
  }

  getBook(): Observable<any> {
    return this.cmP.http.get<any>(`${this.cmP.url}/material/index`, this.cmP.opts);
  }
}
