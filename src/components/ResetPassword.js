import React, { useState } from 'react';
import api from '../api';
import './ResetPassword.css';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/reset-password', { token, new_password: newPassword });
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
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Reset Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className="reset-password-input"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="reset-password-input"
                />
                <button type="submit" className="reset-password-button">Reset Password</button>
            </form>
            <p className="reset-password-message">{message}</p>
        </div>
    );
};

export default ResetPassword;
