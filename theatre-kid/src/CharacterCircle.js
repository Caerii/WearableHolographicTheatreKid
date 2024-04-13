import React from 'react';
import './CharacterCircle.css';

const CharacterCircle = ({ image }) => {
    return (
        <div className="circle-container">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`circle-item item-${index + 1}`}>
                    <img src={image} alt={`Character view ${index + 1}`} />
                </div>
            ))}
        </div>
    );
};

export default CharacterCircle;
