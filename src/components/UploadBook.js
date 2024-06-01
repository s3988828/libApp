import React, { useState } from 'react';
import axios from '../api';

const UploadBook = ({ token }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('published_date', publishedDate);
    formData.append('file', file);

    axios.post('/api/books', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}` 
      }
    })
    .then(response => {
      console.log('Book uploaded successfully');
      // Clear form fields
      setTitle('');
      setAuthor('');
      setGenre('');
      setPublishedDate('');
      setFile(null);
    })
    .catch(error => {
      console.error('There was an error uploading the book!', error);
    });
  };

  return (
    <div>
      <h1>Upload Book</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Published Date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadBook;