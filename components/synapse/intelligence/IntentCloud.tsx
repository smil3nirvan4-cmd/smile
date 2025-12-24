
import React from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { IntentClusterNode } from '../../../types';

interface IntentCloudProps {
    nodes: IntentClusterNode[];
}

const IntentCloud: React.FC<IntentCloudProps> = ({ nodes }) => {
    const width = 300;
    const height = 300;

    const colorMap = {
        core: '#A78BFA',
        high_intent: '#2dd4bf',
        low_intent: '#facc15',
        drift: '#f87171'
    };

    return (
        <SynapseCard className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Semantic Intent Cloud</h3>
            <svg viewBox={`0 0 100 100`} className="w-full h-auto">
                {nodes.map(node => (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.type === 'core' ? 4 : 2.5}
                            fill={colorMap[node.type]}
                            className="opacity-80"
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="6"
                            fill={colorMap[node.type]}
                            className="opacity-20"
                        />
                    </g>
                ))}
            </svg>
        </SynapseCard>
    );
};

export default IntentCloud;
