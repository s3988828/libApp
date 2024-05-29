import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => {
    return (
        React.createElement('div', { className: 'home-container' }, 
            React.createElement('header', { className: 'home-header' },
                React.createElement('h1', null, 'Welcome to the Library System'),
                React.createElement('p', null, 'Your gateway to a world of knowledge and information')
            ),
            React.createElement('section', { className: 'home-content' },
                React.createElement('div', { className: 'home-card' },
                    React.createElement('h2', null, 'Register'),
                    React.createElement('p', null, 'Create an account to start accessing our vast collection of books.'),
                    React.createElement(Link, { to: '/register', className: 'home-button' }, 'Register')
                ),
                React.createElement('div', { className: 'home-card' },
                    React.createElement('h2', null, 'Login'),
                    React.createElement('p', null, 'Already have an account? Log in to continue.'),
                    React.createElement(Link, { to: '/login', className: 'home-button' }, 'Login')
                ),
                React.createElement('div', { className: 'home-card' },
                    React.createElement('h2', null, 'Explore Books'),
                    React.createElement('p', null, 'Browse our collection and find your next great read.'),
                    React.createElement(Link, { to: '/books', className: 'home-button' }, 'Browse Books')
                )
            )
        )
    );
};

export default Home;
