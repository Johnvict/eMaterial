import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuPagesType, AllBooks, Material, MyBooks, Course } from '../interfaces/interface';
import { BookService } from '../providers/book.service';
import { UserdataService } from '../providers/local/userdata.service';
import { CommonService } from '../providers/common.service';
import { Events, Platform } from '@ionic/angular';

import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-books',
  templateUrl: 'books.page.html',
  styleUrls: ['books.page.scss']
})
export class BooksPage implements OnInit, OnDestroy {
  allBooks: AllBooks = null; // { departmentCourses: [], facultyCourses: [], generalCourses: [] };
  myBooks: AllBooks = null; // { departmentCourses: [],    facultyCourses: [],    generalCourses: [] };
  selectedView = 'StoredBooks';
  allBkSub: any;
  myBkSub: any;
  // name: string[] = [];
  private pages: MenuPagesType[];
  constructor(
    private bkS: BookService,
    private usL: UserdataService,
    private cmP: CommonService,
    private events: Events,

    private platform: Platform,
    private file: File,
    private ft: FileTransfer,
    private fileOpener: FileOpener,
    private document: DocumentViewer
    ) {
    // for (let i = 0; i < 2000; i++) {
    //   if (i) {
    //     this.name.push(`${i} x 10 = ${ i * 10}`);
    //   }
    // }
    this.loadBooks();
    this.events.subscribe('remote login success', () => {
      this.loadBooks();
    });
  }
  loadBooks() {
    this.allBkSub = this.usL.allbooks.subscribe(data => {
      this.allBooks = data;
      // console.log(this.allBooks);
    });

    // Change this later to DOWNLOADED BOOKS
    this.myBkSub = this.usL.mybooks.subscribe(data => {
      this.myBooks = data;
      // console.log(this.myBooks);
    });
  }
  ngOnInit() {
    this.pages = this.bkS.allBookMenuPages;
  }

  ngOnDestroy() {
    this.myBkSub.unsubscribe();
    this.allBkSub.unsubscribe();
  }

  onSwipeEvent() {
    console.log('swipe right ');
  }
  onSwipeLeft() {
    console.log('swipe left');
  }

  async downloadBook(book: Material, course: Course, category: string) {
  // CALL DOWNLOAD BOOK FROM SERVICE


    // const downloadUrl = `${this.cmP.urlWeb}${book.url}`;
    // const path = this.file.dataDirectory;
    // const transfer = this.ft.create();

    // await transfer.download(downloadUrl, path + `${book.title}.pdf`).then(entry => {
    //   const url = entry.toURL();

    //   if (this.platform.is('ios')) {
    //     this.document.viewDocument(url, 'application/pdf', {});
    //   } else {
    //     this.fileOpener.open(url, 'application/pdf')
    //       .then(() => console.log('File is opened'))
    //       .catch(e => console.log('Error opening file', e));
    //   }
    // });

  // AFTER DOWNLOAD COMPETE, SAVE BOOK TO LOCAL

    await this.usL.saveBook(book, course, category)
    // this.usL.saveABook(book, course, category, this.myBooks)
      .then(_ => {
        console.log('done saving book');
        this.loadBooks();
      });
  }

  openBook(book: Material) {
    console.log(book);

    const filePath = this.file.applicationDirectory + 'assets';

    if (this.platform.is('android')) {
      const fakeName = Date.now();
      this.file.copyFile(filePath, `${book.title}.pdf`, this.file.dataDirectory, `${fakeName}`).then(result => {
      // this.file.copyFile(filePath, `Boostnote.pdf`, this.file.dataDirectory, `${fakeName}`).then(result => {
        this.fileOpener.open(result.nativeURL, 'application/pdf')
          .then(() => {
            this.cmP.showToast('File opened successfully');
          })
          .catch(e => {
            this.cmP.showAlert(
              'Error',
              JSON.stringify(e),
              [{text: 'OK'}],
              false
            );
          });
      });
    } else {
      // Use Document viewer for iOS for a better UI
      const options: DocumentViewerOptions = { title: 'My PDF' };
      this.document.viewDocument(`${filePath}/${book.title}.pdf`, 'application/pdf', options);
    }
  }

  deleteBook(book: Material, course: Course, category: string) {
    console.log({book, course, category});
    this.cmP.showAlert(
      'Delete Device Copy',
      `Are you sure you want to delete ${book.title} (${course.code}). Note that You will need to download it if you delete`,
      [
        {
          text: 'Delete', handler: () => {
            this.usL.deleteBook(book, course, category);
            this.loadBooks();
          }
        },
        { text: 'Cancel' }
      ],
      true
    );
  }

  viewDetail(book: Material, course: Course, category: string, download?: boolean) {
    console.log({book, course, category});
    this.cmP.showAlert(
      'Material Detail',
      `Course Code: ${course.code}, Material Title: ${book.title}, Lecturer: ${book.lecturer}`,
      download === true ?
        [
          { text: 'Download', handler: () => this.downloadBook(book, course, category) }, { text: 'Ok' }
        ]
        :
        [{ text: 'Ok' }],
      true
    );
  }

}
