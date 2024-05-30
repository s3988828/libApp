import React, { useState, useEffect } from 'react';
import axios from '../api'; 
import './Books.css';
 // Ensure this API setup is correct as shown in the previous message

const Books = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = () => {
      axios.get('/books', {
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
    fetchBooks();
  }, [token, search]);

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
              href={book.url}  // Updated to use the direct link from the API
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
