import React, { useEffect, useState } from 'react';
import api from '../api';
import './Profile.css';

const Profile = ({ token, handleLogout }) => {
    const [profileDetails, setProfileDetails] = useState({});

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await api.get('/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileDetails(response.data);
            } catch (error) {
                console.error('Error fetching profile details:', error);
            }
        };

        fetchProfileDetails();
    }, [token]);

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="profile-details">
                <p><strong>Username:</strong> {profileDetails.username}</p>
                <p><strong>Email:</strong> {profileDetails.email}</p>
            </div>
            <div className="profile-actions">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Profile;
