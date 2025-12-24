
import React from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { MROASDataPoint } from '../../../types';

interface MROASVectorChartProps {
    data: MROASDataPoint[];
    isInferring: boolean;
}

const MROASVectorChart: React.FC<MROASVectorChartProps> = ({ data, isInferring }) => {
    const width = 500;
    const height = 300;
    const padding = 20;

    const keys = ['tiktok', 'google', 'meta'] as const;
    const colors = { tiktok: '#A78BFA', google: '#38BDF8', meta: '#4ADE80' };

    // Create stacked data
    const stackedData = data.map(d => {
        let y0 = 0;
        const point = { date: d.date };
        keys.forEach(key => {
            point[key] = { y0, y1: y0 + d[key] };
            y0 += d[key];
        });
        return point;
    });

    const maxY = Math.max(...stackedData.map(d => d.meta.y1));

    const toAreaPath = (key: 'google' | 'meta' | 'tiktok') => {
        const points = stackedData.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
            const y0 = height - padding - (d[key].y0 / maxY) * (height - padding * 2);
            const y1 = height - padding - (d[key].y1 / maxY) * (height - padding * 2);
            return { x, y0, y1 };
        });

        const path1 = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y1.toFixed(2)}`).join(' ');
        const path2 = points.reverse().map((p, i) => `L ${p.x.toFixed(2)} ${p.y0.toFixed(2)}`).join(' ');
        
        return `${path1} ${path2} Z`;
    };

    return (
        <SynapseCard className="p-4 h-full flex flex-col" isInferring={isInferring}>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">mROAS Vector Contribution</h3>
            <div className="flex-grow">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    <defs>
                        {keys.map(key => (
                            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors[key]} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={colors[key]} stopOpacity={0.05} />
                            </linearGradient>
                        ))}
                    </defs>
                    {keys.map(key => (
                        <path key={key} d={toAreaPath(key)} fill={`url(#gradient-${key})`} stroke={colors[key]} strokeWidth="1.5" />
                    ))}
                </svg>
            </div>
            <div className="flex justify-center space-x-4 text-xs mt-2 font-data">
                <div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: colors.meta}}></div>Meta</div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: colors.google}}></div>Google</div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: colors.tiktok}}></div>TikTok</div>
            </div>
        </SynapseCard>
    );
};

export default MROASVectorChart;
