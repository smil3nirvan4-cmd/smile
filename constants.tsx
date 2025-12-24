
import React from 'react';
import { NavItem } from './types';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-6 h-6">{children}</div>
);

export const NAV_ITEMS: NavItem[] = [
    {
        name: 'Nexus Synapse',
        icon: (
            <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            </IconWrapper>
        )
    },
    {
        name: 'Identity Vault',
        icon: (
            <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </IconWrapper>
        ),
    },
    {
        name: 'Search Arbitrage',
        icon: (
            <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </IconWrapper>
        ),
    },
    {
        name: 'Creative DNA',
        icon: (
            <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.47 2.118 2.25 2.25 0 0 1-2.47-2.118c0-.62.28-1.22.755-1.622a3 3 0 0 0 4.136-1.622 3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.47-2.118 2.25 2.25 0 0 1 2.47-2.118c.62 0 1.22.28 1.622.755a3 3 0 0 0 1.622 4.136 3 3 0 0 0 1.128-5.78 2.25 2.25 0 0 1 2.118-2.47 2.25 2.25 0 0 1 2.118 2.47c0 .62-.28 1.22-.755 1.622a3 3 0 0 0-4.136 1.622 3 3 0 0 0 5.78 1.128 2.25 2.25 0 0 1 2.47 2.118 2.25 2.25 0 0 1 2.47-2.118c0-.62-.28-1.22-.755-1.622a3 3 0 0 0-1.622-4.136 3 3 0 0 0-1.128 5.78 2.25 2.25 0 0 1-2.118 2.47 2.25 2.25 0 0 1-2.118-2.47c0-.62.28-1.22.755-1.622a3 3 0 0 0 4.136-1.622Z" />
                </svg>
            </IconWrapper>
        ),
    },
    {
        name: 'Executor Logs',
        icon: (
            <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </IconWrapper>
        ),
    },
];
