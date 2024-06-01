import React, { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken, setUserRole }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/login', { identifier, password });
            const token = response.data.access_token;
            const userRole = response.data.user_role; // Assuming the backend sends the user role in the response
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', userRole);
            setToken(token);
            setUserRole(userRole);
            setMessage('Login successful');
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Invalid credentials');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            <p className="login-message">{message}</p>
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
            <Link to="/register" className="login-link">Don't have an account? Register</Link>
        </div>
    );
};

export default Login;