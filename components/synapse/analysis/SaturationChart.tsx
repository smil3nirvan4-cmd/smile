
import React from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { SaturationDataPoint } from '../../../types';

const SaturationChart: React.FC<{ data: SaturationDataPoint[] }> = ({ data }) => {
    const width = 300;
    const height = 200;
    const padding = { top: 10, right: 10, bottom: 20, left: 25 };
    const targetROAS = 1.5;

    const maxX = Math.max(...data.map(d => d.spend));
    const maxY = Math.max(...data.map(d => d.mROAS));

    const toPath = (points: SaturationDataPoint[]) => {
        return points.map((p, i) => {
            const x = padding.left + (p.spend / maxX) * (width - padding.left - padding.right);
            const y = padding.top + (1 - p.mROAS / maxY) * (height - padding.top - padding.bottom);
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ');
    };

    const targetY = padding.top + (1 - targetROAS / maxY) * (height - padding.top - padding.bottom);

    return (
        <SynapseCard className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">mROAS Saturation Curve</h3>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                <path d={toPath(data)} fill="none" stroke="#2dd4bf" strokeWidth="2" />
                <line
                    x1={padding.left} y1={targetY}
                    x2={width - padding.right} y2={targetY}
                    stroke="#f87171" strokeWidth="1" strokeDasharray="3 3"
                />
                <text x={padding.left + 5} y={targetY - 5} fill="#f87171" fontSize="8" className="font-data">
                    Target: {targetROAS}x
                </text>
            </svg>
        </SynapseCard>
    );
};

export default SaturationChart;
