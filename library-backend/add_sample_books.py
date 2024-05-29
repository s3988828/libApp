import sqlite3

def add_sample_books():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()

    sample_books = [
        ('Book Title 1', 'Author 1', 'Genre 1', '2020-01-01', 'books/book1.pdf'),
        ('Book Title 2', 'Author 2', 'Genre 2', '2020-02-01', 'books/book2.pdf'),
        ('Book Title 3', 'Author 3', 'Genre 3', '2020-03-01', 'books/book3.pdf'),
        ('Book Title 4', 'Author 4', 'Genre 4', '2020-04-01', 'books/book4.pdf'),
        ('Book Title 5', 'Author 5', 'Genre 5', '2020-05-01', 'books/book5.pdf'),
        ('Book Title 6', 'Author 6', 'Genre 6', '2020-06-01', 'books/book6.pdf'),
        ('Book Title 7', 'Author 7', 'Genre 7', '2020-07-01', 'books/book7.pdf'),
        ('Book Title 8', 'Author 8', 'Genre 8', '2020-08-01', 'books/book8.pdf'),
        ('Book Title 9', 'Author 9', 'Genre 9', '2020-09-01', 'books/book9.pdf'),
        ('Book Title 10', 'Author 10', 'Genre 10', '2020-10-01', 'books/book10.pdf')
    ]

    cursor.executemany('INSERT INTO books (title, author, genre, published_date, file_path) VALUES (?, ?, ?, ?, ?)', sample_books)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_sample_books()
