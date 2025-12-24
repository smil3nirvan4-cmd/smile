
import React from 'react';

interface SynapseCardProps {
    children: React.ReactNode;
    className?: string;
    isInferring?: boolean;
}

const SynapseCard: React.FC<SynapseCardProps> = ({ children, className = '', isInferring = false }) => {
    const baseClasses = "bg-cyan-400/5 border border-cyan-400/20 rounded-lg backdrop-blur-xl shadow-lg shadow-cyan-500/5 transition-all duration-300";
    const inferringClasses = isInferring ? "shimmering-border" : "";

    return (
        <div 
            className={`${baseClasses} ${inferringClasses} ${className}`}
        >
            {children}
        </div>
    );
};

export default SynapseCard;
