
import React, { useState, useEffect } from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { BidMatrixEntry } from '../../../types';

const BidShadingMatrix: React.FC<{ entries: BidMatrixEntry[] }> = ({ entries }) => {
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (entries.length > 0) {
            const newEntryId = entries[0].id;
            setHighlighted(prev => {
                const newSet = new Set(prev);
                newSet.add(newEntryId);
                return newSet;
            });
            const timer = setTimeout(() => {
                setHighlighted(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(newEntryId);
                    return newSet;
                });
            }, 2000); // Glow duration
            return () => clearTimeout(timer);
        }
    }, [entries]);

    const getActionStyle = (action: BidMatrixEntry['action']) => {
        switch (action) {
            case 'Predatory Aggression': return 'text-red-400';
            case 'Bid Shading': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <SynapseCard className="p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Bid Shading Matrix</h3>
            <div className="flex-grow overflow-y-auto">
                <table className="w-full text-left font-data text-xs">
                    <thead>
                        <tr className="text-gray-500 border-b border-cyan-400/20">
                            <th className="py-1">Target</th>
                            <th className="py-1">Action</th>
                            <th className="py-1 text-right">Bid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(entry => (
                            <tr 
                                key={entry.id} 
                                className={`border-b border-cyan-400/10 transition-all duration-500 ${highlighted.has(entry.id) ? 'bg-cyan-400/20' : ''}`}
                                style={highlighted.has(entry.id) ? {boxShadow: `0 0 10px ${entry.action === 'Predatory Aggression' ? '#F87171' : '#4ADE80'}`} : {}}
                            >
                                <td className="py-1.5">{entry.targetId}</td>
                                <td className={`py-1.5 font-bold ${getActionStyle(entry.action)}`}>{entry.action}</td>
                                <td className="py-1.5 text-right text-cyan-300">${entry.bidAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SynapseCard>
    );
};

export default BidShadingMatrix;
