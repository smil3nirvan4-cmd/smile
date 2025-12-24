
import React from 'react';
import { Page } from '../../types';
import { NAV_ITEMS } from '../../constants';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    return (
        <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-700/50 flex flex-col">
            <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
                <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0 1 15.75 11.25h2.25a2.25 2.25 0 0 1 2.25 2.25V21M3 3h18M3 21h18M9 3v18m0 0h6M9 3a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 9 21m-3-9h3m9-3h3m-3 6h3m-3 6h3" />
                    </svg>
                    <h1 className="text-2xl font-bold text-white">Nexus Core</h1>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 sidebar-scrollbar overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item.name);
                        }}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            currentPage === item.name
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                        }`}
                    >
                        {item.icon}
                        <span className="ml-4">{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">© 2024 Nexus Arbitrage Inc.</p>
                <p className="text-xs text-gray-500">Version 1.0.0</p>
            </div>
        </aside>
    );
};

export default Sidebar;
