import React, { useState, useEffect } from 'react';
import api from '../api';
import './Books.css';

const Books = ({ token }) => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [token, search]);

    const fetchBooks = () => {
        api.get('/books', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: search
            }
        })
        .then(response => {
            setBooks(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the books!', error);
        });
    };

    return (
        React.createElement('div', { className: 'books-container' },
            React.createElement('h1', { className: 'books-title' }, 'Books'),
            React.createElement('input', {
                type: 'text',
                placeholder: 'Search books...',
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: 'search-input'
            }),
            React.createElement('ul', { className: 'books-list' }, 
                books.map(book => 
                    React.createElement('li', { key: book.id, className: 'book-item' },
                        React.createElement('div', null, book.title),
                        React.createElement('a', {
                            href: `http://127.0.0.1:5000/books/${book.id}/download`,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'download-link'
                        }, 'Download')
                    )
                )
            )
        )
    );
};

export default Books;
