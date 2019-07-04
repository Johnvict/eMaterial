CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, remoteId INTEGER, username TEXT, password TEXT, email TEXT);

CREATE TABLE IF NOT EXISTS profile(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, faculty TEXT, department TEXT, levele INTEGER);

CREATE TABLE IF NOT EXISTS subscription(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, walletBalance INTEGER, amount INTEGER, date TEXT);

CREATE TABLE IF NOT EXISTS book(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, courseCode TEXT, title TEXT, faculty TEXT, department TEXT, level INTEGER);

INSERT or IGNORE INTO book(id, userId, courseCode, title, faculty, department, level) VALUES (1, 1, 'general', 'Introduction', 'general', 'general', 0);

CREATE TABLE IF NOT EXISTS favourite(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER);

CREATE TABLE IF NOT EXISTS recentbook(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER);

CREATE TABLE IF NOT EXISTS maintenance(id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, description TEXT, dismissible BOOLEAN, solved BOOLEAN);
