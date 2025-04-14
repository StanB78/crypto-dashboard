import React from 'react';
import './coinList.css';

const FavToggle = ({ toggled, onToggle }) => {
    return (
        <button
            className={`toggle-button ${toggled ? 'toggled' : ''}`}
            onClick={onToggle}
        >
            <div className="thumb"></div>
        </button>
    );
};

export default FavToggle;
