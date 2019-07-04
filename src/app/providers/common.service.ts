import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  url: string;
  urlWeb: string;
  headers: HttpHeaders;
  opts: any;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public http: HttpClient,
    ) {
    this.url = 'http://localhost:8000/api/';
    this.urlWeb = 'http://localhost:8000/';
    // this.url = 'http://aem.my-backend.com.ng/api/';
    // this.urlWeb = 'http://aem.my-backend.com.ng/';

    this.createNewHeader();
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.error.message}`, 'middle', 'danger');

      // let message = '';
      // if (error.status === 401) {
      //   message =  'Invalid Login Credentials';
      // } else if (error.status === 400) {
      //   message = 'Bad Request';
      // } else if (error.status === 408) {
      //   message = 'Request Timeout. Please try again';
      // } else if (error.status === 404) {
      //   message = 'Request Not Found';
      // } else if (error.status === 500) {
      //   message = 'Internal Server Error';
      // } else if (error.status === 0) {
      //   message = 'Server Not available';
      // }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(message: string, position?: string,  type?: string) {
    this.showToast(message, position, 5000, type);
  }

  createNewHeader() {
    this.opts = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        enctype: 'multipart/form-data',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
  }

  async recreateAuthHeaders(bearer) {
    this.opts = null;
    this.opts = await {
      headers: new HttpHeaders({
        Authorization: bearer,
        Accept: 'application/json',
        enctype: 'multipart/form-data',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      })
    };
  }

  async showToast(message, position?, duration?, color?) {
    console.log({message, position, duration, color});
    const TOAST = await this.toastCtrl.create({
      message,
      position,
      duration,
      color
    });
    TOAST.present();
  }

  async showAlert(header, message, buttons, backdropDismiss = true) {
    const ALERT = await this.alertCtrl.create({
      header,
      message,
      buttons,
      backdropDismiss
    });
    ALERT.present();
  }
}

