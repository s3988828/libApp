import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Books from './components/Books';
import UploadBook from './components/UploadBook';
import Home from './components/Home';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        } else {
            localStorage.removeItem('userRole');
        }
    }, [userRole]);

    const handleLogout = () => {
        setToken('');
        setUserRole('');
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul className="nav-left">
                        <li><Link to="/">Home</Link></li>
                    </ul>
                    <ul className="nav-right">
                        {token ? (
                            <>
                                <li><Link to="/books">Books</Link></li>
                                {userRole === 'admin' && <li><Link to="/upload">Upload Book</Link></li>}
                                <li><Link to="/profile">Profile</Link></li>
                                <li><a href="/" onClick={handleLogout}>Logout</a></li>
                            </>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />
                    <Route path="/books" element={token ? <Books token={token} /> : <Navigate to="/login" />} />
                    <Route path="/upload" element={token && userRole === 'admin' ? <UploadBook token={token} /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={token ? <Profile token={token} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;