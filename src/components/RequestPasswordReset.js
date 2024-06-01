import React, { useState } from 'react';
import api from '../api';
import './RequestPasswordReset.css';

const RequestPasswordReset = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/request-password-reset', { username });
            setMessage(`Reset token: ${response.data.token}`);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="request-password-reset-container">
            <h2>Request Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="request-password-reset-input"
                />
                <button type="submit" className="request-password-reset-button">Request Reset</button>
            </form>
            <p className="request-password-reset-message">{message}</p>
        </div>
    );
};

export default RequestPasswordReset;
