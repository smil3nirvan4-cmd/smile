
import React from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { GraphNode, GraphLink } from '../../../types';

interface IdentitySynapseProps {
    data: {
        nodes: GraphNode[];
        links: GraphLink[];
    };
}

const IdentitySynapse: React.FC<IdentitySynapseProps> = ({ data }) => {
    const { nodes, links } = data;
    const width = 500;
    const height = 300;

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const centerNode = nodes.find(n => n.type === 'user');

    return (
        <SynapseCard className="p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Identity Synapse</h3>
            <div className="flex-grow bg-black/30 rounded-md overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <style>
                            {`
                                @keyframes synapse-fire {
                                    from { stroke-dashoffset: 200; }
                                    to { stroke-dashoffset: 0; }
                                }
                                .synapse-link {
                                    stroke-dasharray: 200;
                                    animation: synapse-fire 0.8s ease-out forwards;
                                }
                            `}
                        </style>
                    </defs>
                    
                    {/* Static Event Nodes */}
                    {nodes.filter(n => n.type === 'event').map(node => (
                         <circle
                            key={node.id}
                            cx={node.x * (width / 100)}
                            cy={node.y * (height / 100)}
                            r="2"
                            fill="#4A5568"
                        />
                    ))}

                    {/* Center Node */}
                    {centerNode && (
                        <circle
                            cx={centerNode.x * (width / 100)}
                            cy={centerNode.y * (height / 100)}
                            r="8"
                            fill="#A78BFA"
                            filter="url(#glow)"
                        />
                    )}

                    {/* Animated Links */}
                    {links.map((link, i) => {
                        const sourceNode = nodeMap.get(link.source);
                        const targetNode = nodeMap.get(link.target);
                        if (!sourceNode || !targetNode) return null;
                        return (
                            <line
                                key={`${link.source}-${link.target}-${i}`}
                                className="synapse-link"
                                x1={sourceNode.x * (width / 100)}
                                y1={sourceNode.y * (height / 100)}
                                x2={targetNode.x * (width / 100)}
                                y2={targetNode.y * (height / 100)}
                                stroke="#00FFFF"
                                strokeWidth="1.5"
                            />
                        );
                    })}
                </svg>
            </div>
        </SynapseCard>
    );
};

export default IdentitySynapse;
