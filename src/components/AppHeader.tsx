import React from 'react';
import logo from '../logo.png';
import './AppHeader.css';

export const AppHeader: React.FC = () => {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
        </header>
    );
};
