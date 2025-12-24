
import React, { useState, useMemo } from 'react';
import { useMockData } from '../hooks/useMockData';
import { IdentityVaultEntry } from '../types';
import Card from '../components/ui/Card';

const IdentityDetails: React.FC<{ identity: IdentityVaultEntry }> = ({ identity }) => (
    <Card className="p-6 mt-6">
        <h3 className="text-lg font-bold text-indigo-400 truncate">{identity.nexus_id}</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-gray-400">Email SHA256</p>
                <p className="font-mono text-xs text-gray-300 truncate">{identity.email_sha256}</p>
            </div>
            <div>
                <p className="text-gray-400">Phone SHA256</p>
                <p className="font-mono text-xs text-gray-300 truncate">{identity.phone_sha256}</p>
            </div>
            <div className="md:col-span-2">
                <p className="text-gray-400">User Agent</p>
                <p className="font-mono text-xs text-gray-300">{identity.user_agent}</p>
            </div>
            <div>
                <p className="text-gray-400">IP Address</p>
                <p className="font-mono text-gray-300">{identity.ip_address}</p>
            </div>
            <div>
                <p className="text-gray-400">Created At</p>
                <p className="text-gray-300">{new Date(identity.created_at).toLocaleString()}</p>
            </div>
        </div>
        <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">External IDs & User Journey</h4>
            <div className="space-y-3">
                {identity.external_ids.map((extId, index) => (
                    <div key={index} className="bg-gray-700/50 p-3 rounded-md">
                        <p className="text-xs text-indigo-300 font-semibold">{extId.source}</p>
                        <p className="font-mono text-xs text-gray-300 break-all">{extId.id}</p>
                    </div>
                ))}
            </div>
        </div>
    </Card>
);

const IdentityVault: React.FC = () => {
    const { identities } = useMockData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIdentity, setSelectedIdentity] = useState<IdentityVaultEntry | null>(null);

    const filteredIdentities = useMemo(() => {
        if (!searchTerm) return [];
        return identities.filter(id => 
            id.nexus_id.includes(searchTerm) || 
            id.email_sha256.includes(searchTerm)
        ).slice(0, 5);
    }, [searchTerm, identities]);

    const handleSelect = (identity: IdentityVaultEntry) => {
        setSelectedIdentity(identity);
        setSearchTerm('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">Identity Vault Search</h2>
                <p className="text-sm text-gray-400 mb-4">Search for a user by Nexus ID or Email SHA256. Raw PII is never displayed.</p>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter Nexus ID or SHA256 hash..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {filteredIdentities.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                            {filteredIdentities.map(id => (
                                <li
                                    key={id.nexus_id}
                                    onClick={() => handleSelect(id)}
                                    className="px-4 py-2 cursor-pointer hover:bg-indigo-500/20"
                                >
                                    <p className="font-mono text-sm text-gray-200 truncate">{id.nexus_id}</p>
                                    <p className="font-mono text-xs text-gray-400 truncate">{id.email_sha256}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Card>

            {selectedIdentity ? (
                <IdentityDetails identity={selectedIdentity} />
            ) : (
                <div className="mt-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <p className="mt-4 text-gray-500">Search for an identity to view details.</p>
                </div>
            )}
        </div>
    );
};

export default IdentityVault;
