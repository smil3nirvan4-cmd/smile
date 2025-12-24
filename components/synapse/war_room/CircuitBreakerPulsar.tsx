
import React from 'react';
import { useCounter } from '../../../hooks/useCounter';

interface CircuitBreakerPulsarProps {
    burnRate: number;
}

const CircuitBreakerPulsar: React.FC<CircuitBreakerPulsarProps> = ({ burnRate }) => {
    const animatedBurnRate = useCounter(burnRate, 1000, 0);

    const getStatus = () => {
        if (burnRate > 1200) return { label: 'KILL-SWITCH', color: '#f87171', pulseDuration: '0.5s' };
        if (burnRate > 800) return { label: 'STRESS', color: '#facc15', pulseDuration: '1s' };
        return { label: 'SAFE', color: '#2dd4bf', pulseDuration: '2s' };
    };

    const status = getStatus();

    return (
        <div className="relative flex items-center justify-center w-48 h-48">
            <div
                className="absolute inset-0 rounded-full border-2"
                style={{
                    borderColor: status.color,
                    animation: `pulse-color ${status.pulseDuration} infinite`,
                    boxShadow: `0 0 20px ${status.color}`
                }}
            />
            <div className="text-center z-10">
                <div className="text-3xl font-bold font-data" style={{ color: status.color }}>{status.label}</div>
                <div className="text-lg text-gray-300 font-data">${animatedBurnRate}/hr</div>
                <div className="text-xs text-gray-500">Burn Rate</div>
            </div>
            <style>
                {`
                    @keyframes pulse-color {
                        0%, 100% { transform: scale(0.95); opacity: 0.7; }
                        50% { transform: scale(1.0); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default CircuitBreakerPulsar;
