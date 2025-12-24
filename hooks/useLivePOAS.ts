
import { useState, useEffect } from 'react';
import { POASGaugeData } from '../types';

const initialData: POASGaugeData[] = [
    { platform: 'Google', poas: 3.8, netProfit: 12500, status: 'positive' },
    { platform: 'Meta', poas: 4.2, netProfit: 23100, status: 'positive' },
    { platform: 'TikTok', poas: 2.9, netProfit: 8750, status: 'positive' },
];

export const useLivePOAS = () => {
    const [gaugeData, setGaugeData] = useState<POASGaugeData[]>(initialData);

    useEffect(() => {
        const interval = setInterval(() => {
            setGaugeData(prevData => 
                prevData.map(d => {
                    const profitChange = (Math.random() - 0.45) * 500;
                    const poasChange = (Math.random() - 0.48) * 0.2;
                    
                    const newProfit = d.netProfit + profitChange;
                    const newPoas = Math.max(0, d.poas + poasChange);

                    let status: POASGaugeData['status'] = 'positive';
                    if (newPoas < 2.0) {
                        status = 'negative';
                    } else if (Math.random() < 0.1) { // 10% chance to show saturation
                        status = 'saturated';
                    }

                    return {
                        ...d,
                        netProfit: newProfit,
                        poas: newPoas,
                        status: status,
                    };
                })
            );
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return gaugeData;
};
