
import React from 'react';
import { useCounter } from '../../../hooks/useCounter';
import { POASGaugeData } from '../../../types';

const POASGauge: React.FC<{ data: POASGaugeData }> = ({ data }) => {
    const { platform, poas, netProfit, status } = data;
    
    const animatedProfit = useCounter(netProfit, 2000, 0);
    const animatedPOAS = useCounter(poas, 2000, 2);

    const circumference = 2 * Math.PI * 28; // r=28
    const poasPercentage = Math.min(animatedPOAS / 6, 1); // Max POAS of 6 for gauge
    const offset = circumference - poasPercentage * circumference;

    const statusStyles = {
        positive: { color: '#2dd4bf', animationClass: 'shimmering-border', animationDuration: '2s' },
        saturated: { color: '#facc15', animationClass: 'vibrating', animationDuration: '0.2s' },
        negative: { color: '#f87171', animationClass: '', animationDuration: '0s' },
    };

    const currentStyle = statusStyles[status];

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className={`relative w-32 h-32 ${currentStyle.animationClass}`} style={{ animationDuration: currentStyle.animationDuration }}>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="28" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="3" fill="transparent" />
                    <circle
                        cx="40" cy="40" r="28"
                        stroke={currentStyle.color}
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xl font-bold font-data" style={{ color: currentStyle.color }}>
                        {animatedPOAS.toFixed(2)}x
                    </div>
                    <div className="text-xs text-gray-400 -mt-1">POAS</div>
                </div>
            </div>
            <div className="mt-2 text-center">
                <div className="text-base font-data text-white">${animatedProfit.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{platform}</div>
            </div>
        </div>
    );
};

export default POASGauge;
