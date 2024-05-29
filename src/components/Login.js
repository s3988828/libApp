import React, { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { username, password });
            setToken(response.data.access_token);
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
        React.createElement('div', { className: 'login-container' },
            React.createElement('h2', null, 'Login'),
            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Username',
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    required: true,
                    className: 'login-input'
                }),
                React.createElement('input', {
                    type: 'password',
                    placeholder: 'Password',
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    required: true,
                    className: 'login-input'
                }),
                React.createElement('button', { type: 'submit', className: 'login-button' }, 'Login')
            ),
            React.createElement('p', { className: 'login-message' }, message),
            React.createElement(Link, { to: '/register', className: 'login-link' }, 'Don\'t have an account? Register')
        )
    );
};

export default Login;
