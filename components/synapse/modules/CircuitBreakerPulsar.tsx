
import React from 'react';
import { useCounter } from '../../../hooks/useCounter';

interface CircuitBreakerPulsarProps {
    burnRate: number; // Dollars per hour
}

const CircuitBreakerPulsar: React.FC<CircuitBreakerPulsarProps> = ({ burnRate }) => {
    const animatedBurnRate = useCounter(burnRate, 1000, 0);

    const getStatus = () => {
        if (burnRate > 1200) return { label: 'KILL-SWITCH', color: 'red', pulseDuration: '0.5s' };
        if (burnRate > 800) return { label: 'STRESS', color: 'yellow', pulseDuration: '1s' };
        return { label: 'SAFE', color: 'green', pulseDuration: '2s' };
    };

    const status = getStatus();
    const colorClasses = {
        red: 'border-red-500 text-red-500',
        yellow: 'border-yellow-400 text-yellow-400',
        green: 'border-green-400 text-green-400',
    };

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <div
                className={`absolute inset-0 rounded-full border-2 ${colorClasses[status.color]}`}
                style={{
                    animation: `pulse-color ${status.pulseDuration} infinite`,
                }}
            />
            <div
                className={`absolute inset-2 rounded-full border ${colorClasses[status.color]} opacity-50`}
                 style={{
                    animation: `pulse-color ${status.pulseDuration} infinite reverse`,
                }}
            />
            <div className="text-center z-10">
                <div className={`text-2xl font-bold font-data ${colorClasses[status.color]}`}>{status.label}</div>
                <div className="text-sm text-gray-300 font-data">${animatedBurnRate}/hr</div>
                <div className="text-xs text-gray-500">Burn Rate</div>
            </div>
            <style>
                {`
                    @keyframes pulse-color {
                        0%, 100% { transform: scale(0.95); opacity: 0.5; }
                        50% { transform: scale(1.05); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default CircuitBreakerPulsar;
