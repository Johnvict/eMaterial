import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { NewSubscription } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private cmP: CommonService) { }

  subscribeNew(sub: NewSubscription): Observable<any> {
    return this.cmP.http.post<any>(`${this.cmP.url}sub/create`, sub, this.cmP.opts);
  }
}
