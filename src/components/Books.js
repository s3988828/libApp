import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Books.css';

const Books = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [token, search]);

  const fetchBooks = () => {
    axios.get('http://127.0.0.1:5000/books', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: search }
    })
    .then(response => {
      setBooks(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the books!', error);
    });
  };

  return (
    <div className="books-container">
      <h1>Books</h1>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <ul className="books-list">
        {books.map(book => (
          <li key={book.id} className="book-item">
            <div>{book.title}</div>
            <div>{book.author}</div>
            <div>{book.genre}</div>
            <div>{book.published_date}</div>
            <a
              href={`http://127.0.0.1:5000/books/${book.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
