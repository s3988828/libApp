import React, { useState } from 'react';
import api from '../api';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/request-password-reset', { email });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        React.createElement('div', { className: 'forgot-password-container' },
            React.createElement('h2', null, 'Forgot Password'),
            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('input', {
                    type: 'email',
                    placeholder: 'Enter your email',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    className: 'forgot-password-input'
                }),
                React.createElement('button', { type: 'submit', className: 'forgot-password-button' }, 'Submit')
            ),
            React.createElement('p', { className: 'forgot-password-message' }, message)
        )
    );
};

export default ForgotPassword;
