import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData, UserDataComplete, GeneralData, Wallet, MyBooks, Material, BookCategory, Course } from '../../interfaces/interface';
import { AuthlocalService } from './authlocal.service';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { CommonService } from '../common.service';
import { filter } from 'rxjs/internal/operators/filter';

const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

data =
{
    faculty: { id: 4, name: 'Science' },
    department: { id: 1, name: 'Animal and Environmental Biology' },
    level: { level: 100 }, email: 'john@test.com', username: 'John', remoteId: 2,
    courses: {
        general: [
            {
                code: 'GST 111', title: 'Communication  in English',
                materials: [
                    { title: 'Bostnote', lecturer: 'Mr. Johnvict', url: 'misc/files/directory/materials/Boostnote.pdf' },
                    { title: 'First Materials', lecturer: 'Mr. John', url: 'materials/this.pdf' },
                    { title: 'Material two', lecturer: 'Mr. Johnvict', url: 'materials/another.pdf' }
                ]
            },
            {
                code: 'GST 113', title: 'Nigerian Peoples and Culture',
                materials: []
            },
            {
                code: 'GST 121', title: 'Use of Library, Studies Skills and Information Communication Technology',
                materials: []
            },
            {
                code: 'GST123A', title: 'Commumcatlon in French',
                materials: []
            },
            {
                code: 'GST 123B', title: 'Commumcatlon in Arabic',
                materials: []
            },
            {
                code: 'ENT 121', title: 'Introduction to Entrepreneurship',
                materials: []
            }
        ],
        faculty: [
            {
                code: 'MAT 101', title: 'General Mathematics I',
                materials: [
                    { title: 'Introductory Class', lecturer: 'Mr. Oke', url: 'materials/this.pdf' },
                    { title: 'Advanced Numbering System', lecturer: 'Mr. Johnvict', url: 'materials/another.pdf' }
                ]
            },
            {
                code: 'BIO 101', title: 'General Biology I',
                materials: [
                    { title: 'Introductory Class', lecturer: 'Dr. Ajayi', url: 'materials/this.pdf' },
                    { title: 'Introduction to Genetics', lecturer: 'Mr. Johnvict', url: 'materials/another.pdf' }
                ]
            }
        ],
        department: [
            {
                code: 'CSC 101', title: 'Introduction to Computer Science',
                materials: [
                    { title: 'Introductory Class', lecturer: 'Mr. Aju', url: 'materials/this.pdf' },
                    { title: 'Binary Conversion System', lecturer: 'Dr. Aranuwa', url: 'materials/another.pdf' }
                ]
            },
            {
                code: 'CSC 103', title: 'CSC 103',
                materials: [
                    { title: 'Introduction to Logic Design', lecturer: 'Dr. Ajayi', url: 'materials/this.pdf' },
                    { title: 'Computer Programming I', lecturer: 'Mr. Orogun', url: 'materials/another.pdf' }
                ]
            }
        ]
    },
    wallet: { id: 1, user_id: 2, balance: 920, created_at: '2019-06-12 00:00:00', updated_at: '2019-06-25 15:18:17' },
    transactions: [
        {
          id: 1, user_id: 2, reference: 'edFGijKnmoRef001', amount: 500, paid: 1,
          confirmed: 1, created_at: '2019-06-04 00:00:00', updated_at: '2019-06-04 00:00:00' },
        { id: 2, user_id: 2, reference: 'hijkmNIPJNKnjfnREf002', amount: 1000, paid: 1,
          confirmed: 0, created_at: '2019-06-05 00:00:00', updated_at: '2019-06-05 00:00:00' },
        { id: 3, user_id: 2, reference: 'hijkmNIPJNKnjfnREf002', amount: 1000, paid: 1,
          confirmed: 0, created_at: '2019-06-21 16:00:11', updated_at: '2019-06-05 00:00:00' }
    ]
};

  userData = new BehaviorSubject([]);
  GenData = new BehaviorSubject(null);
  UserRemoteData = new BehaviorSubject(null);
  MyBooks: BehaviorSubject<MyBooks> = new BehaviorSubject(null);
  AllBooks: BehaviorSubject<MyBooks> = new BehaviorSubject(null);

  constructor(
    private athL: AuthlocalService,
    private cmP: CommonService
  ) { }

  get fetchUserData(): Observable<UserData[]> {
    const user = localStorage.getItem('user');
    if (user) {
      const USER: UserData[] = JSON.parse(user);
      console.log(USER);
      this.userData.next(USER);
    }
    return this.userData.asObservable();
  }

  async saveUserRegData(data: UserData) {
    const PASS = this.athL.hashPassword(data.password);
    let USERS: UserData[] = [];

    const DEVICEUSERS = localStorage.getItem('user');
    if (DEVICEUSERS) {
      USERS = JSON.parse(DEVICEUSERS);
    }
    // we shall remove this on production
    USERS.push({
      id: data.remoteId,
      remoteId: data.remoteId,
      username: data.username,
      email: data.email,
      password: PASS
    });

    localStorage.setItem('user', JSON.stringify(USERS));   //  REMOVE ON DEPLOY
    this.userData.next(USERS);
          // this.db.createUser(USER).then( _ => {                  //  ADD ON DEPLOY
          //   return {done: true};
          // }, e => {
          //   return {error: true};
          // });

    // this.db.loadUsersData();

    return true;
  }

  get userRemoteData(): Observable<UserDataComplete> {
    const data = localStorage.getItem('data');
    // localStorage.setItem('data', JSON.stringify(this.data));
    // const data = JSON.stringify(this.data);
    if (data !== null) {
      this.UserRemoteData.next(JSON.parse(data));
    }
    return this.UserRemoteData.asObservable();
  }

  get genData(): Observable<GeneralData> {
    const data = localStorage.getItem('genData');
    if (data !== null) {
      this.GenData.next(JSON.parse(data));
    }
    return this.GenData.asObservable();
  }

  async updateWallet(wallet: Wallet) {
    return this.userRemoteData.subscribe(dat => {
      const data: UserDataComplete = dat;
      data.wallet = wallet;
      localStorage.setItem('data', JSON.stringify(data));
    });
  }
  getTimeFormat(date) {
    return moment(date).calendar();
  }

  get mybooks(): Observable<MyBooks> {
    const department =  localStorage.getItem('departmentCourses');
    const faculty =  localStorage.getItem('facultyCourses');
    const general =  localStorage.getItem('generalCourses');

    const bks: MyBooks = {departmentCourses: [], facultyCourses: [], generalCourses: [] };
    bks.departmentCourses =  department !== null ?  JSON.parse(department) : [];
    bks.facultyCourses =  faculty !== null ?  JSON.parse(faculty) : [];
    bks.generalCourses =  general !== null ?  JSON.parse(general) : [];

    this.MyBooks.next(bks);
    return this.MyBooks.asObservable();
  }

  async saveMyBooks(myBooks: MyBooks) {
    const books = myBooks !== null ? JSON.stringify(myBooks) : myBooks;
    localStorage.setItem('myBooks', JSON.stringify(books));
  }

  checkForNUll(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  checkForCourse(courses: Course[], singleCourse: Course) {
    let present = false;
    let index: number = null;
    courses.forEach((course: Course, ind) => {
      if (course.code === singleCourse.code) {
        present = true;
        index = ind;
      }
    });
    console.log({present, index});
    return { present, index};
  }

  checkForMaterial(materials: Material[], singleMaterial: Material) {
    let found = false;
    materials.forEach((material: Material) => {
      if (material.title === singleMaterial.title) {
        found = true;
      }
    });
    return found;
  }

  async saveBook(
    aBook: Material,
    course: Course,
    CATEGORY: string,
  ) {
    const MYBOOKS = localStorage.getItem(CATEGORY);
    let courses: Course[] = [];
    if (MYBOOKS !== null) {
      courses = JSON.parse(MYBOOKS);

      const isCourseThere: { present: boolean, index: number } = this.checkForCourse(courses, course);

      if (isCourseThere.present) {
        const isMaterialThere = this.checkForMaterial(courses[isCourseThere.index].materials, aBook);
        if (isMaterialThere) {
          this.cmP.showAlert(
            'Duplicate',
            'This book has been downloaded by you already',
            [ { text: 'OK' } ],
            false
          );
        } else {
          courses[isCourseThere.index].materials.push(aBook);
        }
      } else {
        console.log('courses length', courses.length);
        // courses[courses.length] = course;
        await courses.push(course);
        courses[courses.length - 1].materials = await [];
        await courses[courses.length - 1].materials.push(aBook);
      }
    } else {
        courses[0] = await course;
        courses[0].materials = await [];
        courses[0].materials.push(aBook);
    }

    await console.log(courses);
    await localStorage.setItem(CATEGORY, JSON.stringify(courses));
  }

  async deleteBook(book: Material, course: Course, category: string) {
    // const courseCats: Course[] = this.getCourseCategory(category);
    // await console.log('Book b4', courseCats);
    // const booksToStore: Course[] = courseCats.map((COURSE: Course) => {
    //   const cos: Course = COURSE;
    //   cos.materials = COURSE.materials.map((CourseMat: Material) => {
    //     if (CourseMat.title.toLocaleLowerCase() !== book.title.toLocaleLowerCase()) {
    //       return CourseMat;
    //     }
    //   });
    //   return cos;
    // });

    // console.log({bookb4: courseCats, bookToStore: booksToStore});
    course.materials = course.materials.map((material: Material) => {
      if (material.title.toLocaleLowerCase() !== book.title.toLocaleLowerCase()) {
        return material;
      }
    });
    console.log(course.materials);
  }

  getCourseCategory(category: string) {
    const categoryBooks = localStorage.getItem(category);
    return  categoryBooks === null ? [] : JSON.parse(categoryBooks);
  }

  get allbooks(): Observable<MyBooks> {

    const BOOKS =  localStorage.getItem('data');

    if (BOOKS !== null) {
    // if (books !== null) {
      // const books: UserDataComplete = BOOKS !== null ? JSON.parse(localStorage.getItem('data')) : [];
      const books: UserDataComplete = BOOKS !== null ? JSON.parse(BOOKS) : [];
      const bks: MyBooks = { departmentCourses: [], facultyCourses: [],  generalCourses: [] };
      bks.departmentCourses = books.courses.department;
      bks.facultyCourses = books.courses.faculty;
      bks.generalCourses = books.courses.general;
      this.AllBooks.next(bks);
    }
    return this.AllBooks.asObservable();
  }

  async saveAllBooks(myBooks: MyBooks[]) {
    // ALL BOOKS HAVE BEEN SAVED WHEN THE USER LOGS IN @token-inerceptor
    // const books = myBooks !== [] ? JSON.stringify(myBooks) : myBooks;
    // localStorage.setItem('myBooks', JSON.stringify(books));
  }
}



