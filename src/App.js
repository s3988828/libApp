import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Books from './components/Books';
import Home from './components/Home';
import './App.css';

function App() {
    const [token, setToken] = useState('');

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/books">Books</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/books" element={<Books token={token} />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
