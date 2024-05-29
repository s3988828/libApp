import sqlite3

def initialize_database():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT,
            genre TEXT,
            published_date TEXT,
            file_path TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS borrowed_books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            book_id INTEGER,
            borrow_date TEXT,
            return_date TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (book_id) REFERENCES books (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            token TEXT NOT NULL,
            expiration_date DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    initialize_database()
