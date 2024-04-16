import React from 'react';

const InfoBox = ({ type, message, onClose }) => {
    return (
        <div className={`info-box ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-button">✖</button>
        </div>
    );
};

export default InfoBox;
