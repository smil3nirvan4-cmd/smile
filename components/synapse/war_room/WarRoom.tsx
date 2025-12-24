
import React, { useState, useEffect } from 'react';
import SynapseCard from '../../ui/SynapseCard';
import CircuitBreakerPulsar from './CircuitBreakerPulsar';
import POASGauge from './POASGauge';
import { POASGaugeData } from '../../../types';

interface WarRoomProps {
    poasGauges: POASGaugeData[];
}

const WarRoom: React.FC<WarRoomProps> = ({ poasGauges }) => {
    const [burnRate, setBurnRate] = useState(500);

    useEffect(() => {
        const interval = setInterval(() => {
            setBurnRate(300 + Math.random() * 1200);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SynapseCard className="h-full flex flex-col items-center justify-between p-6">
            <h3 className="text-lg font-bold text-white font-data tracking-widest">NEXUS WAR ROOM</h3>
            <CircuitBreakerPulsar burnRate={burnRate} />
            <div className="w-full border-t border-cyan-400/20 my-4"></div>
            <div className="flex w-full items-center justify-around">
                {poasGauges.map(data => (
                    <POASGauge key={data.platform} data={data} />
                ))}
            </div>
        </SynapseCard>
    );
};

export default WarRoom;
