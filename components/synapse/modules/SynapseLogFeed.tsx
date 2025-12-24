
import React from 'react';
import { ExecutorLog } from '../../../types';
import { useTypewriter } from '../../../hooks/useTypewriter';

const LogLine: React.FC<{ log: ExecutorLog }> = ({ log }) => {
    const fullText = `[${log.type}] ${log.message} ${JSON.stringify(log.details)}`;
    const typedText = useTypewriter(fullText, 5);
    const typeColor = log.type === 'BidShaper' ? 'text-cyan-400' : 'text-amber-400';

    return (
        <div>
            <span className="text-green-600 mr-2">{new Date(log.timestamp).toLocaleTimeString()}:</span>
            <span className={typeColor}>{typedText}</span>
        </div>
    );
};

const SynapseLogFeed: React.FC<{ logs: ExecutorLog[] }> = ({ logs }) => {
    return (
        <div className="bg-black/30 border border-cyan-400/20 rounded-lg backdrop-blur-md shadow-lg h-full flex flex-col p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 flex-shrink-0">Nexus_Executor Feed</h3>
            <div className="font-data flex-grow overflow-y-auto text-xs space-y-1 pr-2">
                {logs.slice(0, 20).map(log => (
                    <LogLine key={log.id} log={log} />
                ))}
            </div>
        </div>
    );
};

export default SynapseLogFeed;
