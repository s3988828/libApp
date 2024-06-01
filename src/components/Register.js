import React, { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/register', { username, password, email });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else if (error.request) {
                setMessage('No response from server. Please try again later.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        React.createElement('div', { className: 'register-container' },
            React.createElement('h2', null, 'Register'),
            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Username',
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    required: true,
                    className: 'register-input'
                }),
                React.createElement('input', {
                    type: 'password',
                    placeholder: 'Password',
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    required: true,
                    className: 'register-input'
                }),
                React.createElement('input', {
                    type: 'email',
                    placeholder: 'Email',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    className: 'register-input'
                }),
                React.createElement('button', { type: 'submit', className: 'register-button' }, 'Register')
            ),
            React.createElement('p', { className: 'register-message' }, message),
            React.createElement(Link, { to: '/login', className: 'register-link' }, 'Already have an account? Login')
        )
    );
};

export default Register;
