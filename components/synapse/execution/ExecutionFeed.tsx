
import React from 'react';
import { ExecutorLog } from '../../../types';
import { useTypewriter } from '../../../hooks/useTypewriter';

const LogLine: React.FC<{ log: ExecutorLog }> = ({ log }) => {
    const fullText = `[${log.strategy || log.type}] ${log.message}`;
    const typedText = useTypewriter(fullText, 2);
    const typeColor = log.type === 'BidShaper' ? 'text-cyan-400' : log.type === 'HygieneEnforcer' ? 'text-yellow-400' : 'text-purple-400';

    return (
        <div>
            <span className="text-green-700 mr-2">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}:</span>
            <span className={typeColor}>{typedText}</span>
        </div>
    );
};

const ExecutionFeed: React.FC<{ logs: ExecutorLog[] }> = ({ logs }) => {
    return (
        <div className="bg-black/30 border border-cyan-400/20 rounded-lg backdrop-blur-md shadow-lg h-full flex flex-col p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 flex-shrink-0">Real-Time Execution</h3>
            <div className="font-data flex-grow overflow-y-auto text-xs space-y-1 pr-2">
                {logs.map(log => (
                    <LogLine key={log.id} log={log} />
                ))}
            </div>
        </div>
    );
};

export default ExecutionFeed;
