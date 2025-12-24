
import React, { useState, useEffect } from 'react';
import SynapseCard from '../../ui/SynapseCard';
import CircuitBreakerPulsar from './CircuitBreakerPulsar';
import POASGauge from './POASGauge';
import { useLivePOAS } from '../../../hooks/useLivePOAS';

const WarRoom: React.FC = () => {
    const [burnRate, setBurnRate] = useState(500);
    const gaugeData = useLivePOAS();

    useEffect(() => {
        const interval = setInterval(() => {
            setBurnRate(300 + Math.random() * 1200);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SynapseCard className="h-full flex flex-col items-center justify-around p-6">
            <CircuitBreakerPulsar burnRate={burnRate} />
            <div className="w-full border-t border-cyan-400/20 my-6"></div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 -mt-2">POAS WAR ROOM</h3>
            <div className="flex w-full items-center justify-around">
                {gaugeData.map(data => (
                    <POASGauge key={data.platform} data={data} />
                ))}
            </div>
        </SynapseCard>
    );
};

export default WarRoom;
