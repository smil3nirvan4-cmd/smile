
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const baseClasses = "bg-gray-800/50 border border-gray-700/60 rounded-lg shadow-lg transition-all duration-300";
    const clickableClasses = onClick ? "cursor-pointer hover:border-indigo-500/70 hover:shadow-indigo-500/10" : "";

    return (
        <div className={`${baseClasses} ${clickableClasses} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
