import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { Book, Favourite, Subscription, RecentBook, UserData, AuthUser, Profile, ShortUserData } from '../interfaces/interface';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  users = new BehaviorSubject([]);
  books = new BehaviorSubject([]);
  favourites = new BehaviorSubject([]);
  recentBooks = new BehaviorSubject([]);
  subscriptions = new BehaviorSubject([]);
  profile = new BehaviorSubject([]);
  profileCompleted = new BehaviorSubject(false);

  constructor(
    private plt: Platform,
    private http: HttpClient,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private commonProvider: CommonService
  ) {
    if (this.plt.is('cordova') || this.plt.is('capacitor')) {
      this.plt.ready().then( () => {
        this.sqlite.create({
          name: 'materials.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
      });
    }
  }

  seedDatabase() {
    // this.http.get('assets/seed.sql', {responseType: 'text'})
    //   .subscribe(sql => {
    //     this.sqlitePorter.importSqlToDb(this.database, sql)
    //     .then( _ => {
    //       this.loadUsersData();
    //       // this.loadBooks();
    //       this.dbReady.next(true);
    //     })
    //     .catch(e => this.commonProvider.showToast('Db Error: ' + e));
    //   });
  }

  getDatabaseState(): Observable<boolean> {
    return this.dbReady.asObservable();
  }

  getProfileCompletionStatus(): Observable<boolean> {
    return this.profileCompleted.asObservable();
  }

  getBooks(): Observable<Book[]> {
    return this.books.asObservable();
  }

  getFavourites(): Observable<Favourite[]> {
    return this.favourites.asObservable();
  }

  getSubscriptions(): Observable<Subscription[]> {
    return this.subscriptions.asObservable();
  }

  getRecentBooks(): Observable<RecentBook[]> {
    return this.recentBooks.asObservable();
  }

  getAuthUser(): Observable<AuthUser[]> {
    return this.profile.asObservable();
  }

  createUser(userData: UserData) {
    const {username, password, email } = userData;
    const data = [username, password, email];
    return this.database.executeSql('INSERT INTO user ( remoteId, username, email, password) VALUES (?, ?, ? , ?)', data)
      .then( dataRes => {
        this.loadUsersData();
      });
  }

  createUserProfile(userData: Profile) {
    const {userId, faculty, department, levele} = userData;
    const data = [userId, faculty, department, levele];
    return this.database.executeSql('INSERT INTO profile (userId, faculty, department, levele) VALUES (?, ? , ?, ?)', data)
      .then( dataRes => {
        this.loadAuthUser({id: userId, username: userData.username});
      });
  }

  createFavourite(favourite: Favourite) {
    const {userId, bookId} = favourite;
    const data = [userId, bookId];
    return this.database.executeSql('INSERT INTO favourite (userId, bookId) VALUES (?, ?)', data)
      .then( dataRes => {
        this.loadFavourites(userId);
      });
  }

  createSubscription(subscription: Subscription) {
    const {userId, walletBalance, amount, date} = subscription;
    const data = [userId, walletBalance, amount, date];
    return this.database.executeSql('INSERT INTO subscription (userId, walletBalance, amount, date) VALUES (?, ?, ?, ?)', data)
      .then( dataRes => {
        this.loadSubscription(userId);
      });
  }

  createRecentBook(recentBook: RecentBook) {
    const {userId, bookId} = recentBook;
    const data = [userId, bookId];
    return this.database.executeSql('INSERT INTO recentbook (userId, bookId) VALUES (?, ?)', data)
      .then( dataRes => {
        this.loadRecentBooks(userId);
      });
  }

  resetRecentBooks(userId: number) {
    return this.database.executeSql('SELECT * FROM recentbook WHERE userId = ?', [userId])
      .then( data => {
        if (data.rows.length > 10) {
          const recentBooks: RecentBook[] = [];
          for (let i = data.rows.length - 1; i >= 0; i-- ) {
            recentBooks.push({
              userId: data.rows.item(i).userId,
              bookId: data.rows.item(i).bookId
            });
          }
          return this.database.executeSql('DROP TABLE IF EXISTS recentbooks', []).then( res => {
            return this.database.executeSql(`CREATE TABLE IF NOT EXISTS recentbook(
              id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER`).then( resp => {
                for (const book of recentBooks) {
                  this.createRecentBook(book);
                  // this.createRecentBook(recentBooks[j]);
                }
                // for (let j = 0; j < recentBooks.length; j++) {
                //   this.createRecentBook(recentBooks[j]);
                // }
              });
          });
        }
      });
  }

  deleteFavourite({id, userId}) {
    return this.database.executeSql('DELETE FROM favourite WHERE id = ?', [id]).then( _ => {
      this.loadFavourites(userId);
    });
  }

  loadUsersData() {
    return this.database.executeSql('SELECT * FROM user', []).then(data => {
      // tslint:disable-next-line:prefer-const
      let users: UserData[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          users.push({
            id: data.rows.item(i).id,
            remoteId: data.rows.item(i).remoteId,
            username: data.rows.item(i).username,
            password: data.rows.item(i).password,
            email: data.rows.item(i).email
          });
        }
      }
      this.users.next(users);
    });
  }

  loadAuthUser(user: ShortUserData) {
    // const query = 'SELECT * as userData FROM user WHERE username = ' + user.username + 'JOIN profile ON userId = ' + user.id;
    // return this.database.executeSql(query,  []).then(data => {
    return this.database.executeSql('SELECT * FROM profile WHERE userId = ?', [user.id]).then(data => {
      if (data.rows.length < 1) {
        return this.profileCompleted.next(false);
      } else {
        this.profileCompleted.next(true);
        return {
          id: data.rows.item(0).id,
          username: user.username,
          email: data.rows.item(0).email,
          faculty: data.rows.item(0).faculty,
          department: data.rows.item(0).department,
          levele: data.rows.item(0).levele
        };
      }
    });
  }

  loadFavourites(userId: number) {
    return this.database.executeSql('SELECT * FROM favourite WHERE userId = ?', [userId]).then(data => {
      const favourites: Favourite[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          favourites.push({
            id: data.rows.item(i).id,
            userId: data.rows.item(i).userId,
            bookId: data.rows.item(i).bookId,
          });
        }
      }
      this.favourites.next(favourites);
    });
  }

  loadBooks(userId: number) {
    return this.database.executeSql('SELECT * FROM book WHERE userId = ?', [userId]).then(data => {
      // tslint:disable-next-line:prefer-const
      let books: Book[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          books.push({
            id: data.rows.item(i).id,
            courseCode: data.rows.item(i).courseCode,
            title: data.rows.item(i).title,
            faculty: data.rows.item(i).faculty,
            department: data.rows.item(i).department,
            levele: data.rows.item(i).levele
          });
        }
      }
      this.books.next(books);
    });
  }

  loadSubscription(userId: number) {
    return this.database.executeSql('SELECT * FROM subscription WHERE userId = ?', [userId]).then(data => {
      // tslint:disable-next-line:prefer-const
      let subscriptions: Subscription[] = [];

      if (data.rows.length > 0) {
        // for (let i = 0; i < data.rows.length; i++) {
        //   subscriptions.push({
        //     walletBalance: data.rows.item(i).walletBalance,
        //     amount: data.rows.item(i).amount,
        //     date: data.rows.item(i).date,
        //   });
        // }
      }
      this.subscriptions.next(subscriptions);
    });
  }

  loadRecentBooks(userId: number) {
    return this.database.executeSql('SELECT * FROM recentbook WHERE userId = ?', [userId]).then(data => {
      // tslint:disable-next-line:prefer-const
      let recentBooks: RecentBook[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          recentBooks.push({
            bookId: data.rows.item(i).walletBalance,
            userId: data.rows.item(i).userId,
          });
        }
      }
      this.recentBooks.next(recentBooks);
    });
  }

}
