export interface UserData {
    id?: number;
    remoteId?: number;
    username: string;
    email?: string;
    password: string;
}

export interface UserDataComplete {
    courses: CourseCategory;
    department: { name: string };
    email: string;
    faculty: { name: string };
    level: { level: number };
    password?: string;
    remoteId: number;
    transactions: Transaction[];
    wallet: Wallet;
    username: string;
}

export interface CourseCategory {
    department: Course[];
    faculty: Course[];
    general: Course[];
}

export interface Course {
    code: string;
    title: string;
    materials: Material[];
}

export interface MyBooks {
    departmentCourses: Course[];
    facultyCourses: Course[];
    generalCourses: Course[];
}

export interface AllBooks {
    departmentCourses: Course[];
    facultyCourses: Course[];
    generalCourses: Course[];
}

export interface BookCategory {
    category: string; // department | faculty | general
    courseCode: string;
}

export interface Material {
    title: string;
    url: string;
    lecturer: string;
}

export interface Transaction {
    amount: number;
    confirmed: boolean;
    id: number;
    paid: boolean;
    reference: string;
    created_at: Date;
    updated_at: Date;
}

export interface Wallet {
    balance: number;
    id: number;
    created_at: Date;
    updated_at: Date;
}

export interface  Profile {
    userId?: number;
    username?: string;
    faculty: string;
    department: string;
    levele: number;
}

export interface ShortUserData {
    id: number;
    username: string;
}

export interface LoginUser {
    username: string;
    password: string;
    harsh: string;
}

export interface AuthUser {
    id?: number;
    username: string;
    email: string;
    faculty: string;
    department: string;
    levele: number;
}

export interface Subscription {
    userId?: number;
    walletBalance: number;
    amount: number;
    date: string;
}

export interface Book {
    id?: number;
    courseCode: string;
    title: string;
    faculty: string;
    department: string;
    levele: number;
}

export interface Favourite  {
    id?: number;
    userId: number;
    bookId: number;
}

export interface RecentBook {
    userId: number;
    bookId: number;
}

export interface Maintenance {
    type: string;
    description: string;
    dismissible: boolean;
    resolved: boolean;
}

export interface MenuPagesType {
    url: string;
    icon: string;
    title: string;
}

export interface NewSubscription {
    session: number;
    type: string;
    // semester?: string;
}

export interface GeneralData {
    sessions: Sessions[];
}
export interface Sessions {
    name?: string;
    id: number;
    fullPrice: number;
    halfPrice: number;
    active?: boolean | number;
}
