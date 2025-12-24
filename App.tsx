
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import IdentityVault from './pages/IdentityVault';
import SearchArbitrage from './pages/SearchArbitrage';
import CreativeDNA from './pages/CreativeDNA';
import ExecutorLogs from './pages/ExecutorLogs';
import NexusSynapse from './pages/NexusSynapse';
import { Page } from './types';
import { NAV_ITEMS } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Nexus Synapse');
    const [circuitBreakerActive, setCircuitBreakerActive] = useState(false);

    // Simulate circuit breaker status changes
    useEffect(() => {
        const interval = setInterval(() => {
            setCircuitBreakerActive(Math.random() < 0.1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const ActivePage = useMemo(() => {
        switch (currentPage) {
            case 'Nexus Synapse':
                return NexusSynapse;
            case 'Identity Vault':
                return IdentityVault;
            case 'Search Arbitrage':
                return SearchArbitrage;
            case 'Creative DNA':
                return CreativeDNA;
            case 'Executor Logs':
                return ExecutorLogs;
            default:
                return NexusSynapse;
        }
    }, [currentPage]);

    const currentNavItem = NAV_ITEMS.find(item => item.name === currentPage);

    return (
        <div className={`flex h-screen bg-[#050505] text-gray-200 font-sans ${circuitBreakerActive ? 'circuit-breaker-active' : ''}`}>
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-transparent p-4 flex items-center space-x-3 z-10">
                    {currentNavItem && (
                        <>
                            <div className="text-cyan-400">{currentNavItem.icon}</div>
                            <h1 className="text-xl font-bold text-gray-100">{currentPage}</h1>
                        </>
                    )}
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <ActivePage />
                </div>
            </main>
        </div>
    );
};

export default App;
