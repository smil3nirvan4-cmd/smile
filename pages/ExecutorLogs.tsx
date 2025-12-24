
import React from 'react';
import { useMockData } from '../hooks/useMockData';
import { ExecutorLog } from '../types';
import Card from '../components/ui/Card';

const LogEntry: React.FC<{ log: ExecutorLog }> = ({ log }) => {
    const typeColor = log.type === 'BidShaper' ? 'text-cyan-400' : 'text-amber-400';
    const strategyColor = log.strategy === 'CONQUESTING_HIGH_LTV' ? 'text-red-400' : log.strategy === 'BID_SHADING_VICKREY' ? 'text-green-400' : 'text-gray-400';
    const reasonColor = log.reason === 'FINANCIAL_BLEEDING' ? 'text-red-400' : 'text-yellow-400';

    return (
        <div className="flex items-start space-x-3 py-2 px-1">
            <span className="text-gray-500 text-xs min-w-[130px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`font-bold text-xs w-28 ${typeColor}`}>[{log.type}]</span>
            <div className="flex-1 text-xs text-gray-300">
                <span>{log.message}</span>
                {log.strategy && <span className={`ml-2 font-semibold ${strategyColor}`}>({log.strategy})</span>}
                {log.reason && <span className={`ml-2 font-semibold ${reasonColor}`}>({log.reason})</span>}
                <span className="ml-2 text-gray-500 font-mono">{JSON.stringify(log.details)}</span>
            </div>
        </div>
    );
};

const ExecutorLogs: React.FC = () => {
    const { logs } = useMockData();

    return (
        <Card className="p-4 bg-gray-900/80 border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Executor Log Stream</h2>
            <div className="font-mono bg-black/50 rounded-md p-4 h-[70vh] overflow-y-auto flex flex-col-reverse">
                <div className="space-y-1">
                    {logs.map(log => (
                        <LogEntry key={log.id} log={log} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ExecutorLogs;
