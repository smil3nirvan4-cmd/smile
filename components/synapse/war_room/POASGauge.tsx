
import React from 'react';
import { useCounter } from '../../../hooks/useCounter';
import { POASGaugeData } from '../../../types';

const POASGauge: React.FC<{ data: POASGaugeData }> = ({ data }) => {
    const { platform, poas, status } = data;
    const animatedPOAS = useCounter(poas, 1500, 2);

    const circumference = 2 * Math.PI * 24; // r=24
    const poasPercentage = Math.min(animatedPOAS / 6, 1);
    const offset = circumference - poasPercentage * circumference;

    const statusStyles = {
        positive: { color: '#2dd4bf', animationClass: '' },
        saturated: { color: '#facc15', animationClass: 'vibrating' },
        negative: { color: '#f87171', animationClass: '' },
    };
    const currentStyle = statusStyles[status];

    return (
        <div className={`relative flex flex-col items-center justify-center ${currentStyle.animationClass}`}>
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="24" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="4" fill="transparent" />
                <circle
                    cx="32" cy="32" r="24"
                    stroke={currentStyle.color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute text-center">
                <div className="text-xl font-bold font-data" style={{ color: currentStyle.color }}>
                    {animatedPOAS.toFixed(2)}x
                </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-gray-300">{platform}</div>
        </div>
    );
};

export default POASGauge;
