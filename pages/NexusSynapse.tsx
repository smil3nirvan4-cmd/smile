
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SynapseLayout from '../components/synapse/layout/SynapseLayout';

const NexusSynapse: React.FC = () => {
    const [poasStatus, setPoasStatus] = useState<'healthy' | 'unstable'>('healthy');

    // Simula flutuações no status do POAS para acionar mudanças globais na UI
    useEffect(() => {
        const interval = setInterval(() => {
            const isUnstable = Math.random() < 0.2; // 20% de chance de ficar instável
            setPoasStatus(isUnstable ? 'unstable' : 'healthy');
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            animate={{
                filter: poasStatus === 'unstable' ? 'grayscale(80%) saturate(50%)' : 'grayscale(0%) saturate(100%)',
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
        >
            <SynapseLayout poasStatus={poasStatus} />
        </motion.div>
    );
};

export default NexusSynapse;
