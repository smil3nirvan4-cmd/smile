
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNexusMockData } from '../../../hooks/useNexusMockData';
import { useLivePOAS } from '../../../hooks/useLivePOAS';

// Importar os novos componentes modulares
import LTVPropensityCard from '../intelligence/LTVPropensityCard';
import IntentCloud from '../intelligence/IntentCloud';
import WarRoom from '../war_room/WarRoom';
import ExecutionFeed from '../execution/ExecutionFeed';
import SaturationChart from '../analysis/SaturationChart';
import IdentitySynapse3D from '../intelligence/IdentitySynapse3D';

interface SynapseLayoutProps {
    poasStatus: 'healthy' | 'unstable';
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const SynapseLayout: React.FC<SynapseLayoutProps> = ({ poasStatus }) => {
    const { signal, intentCloud, saturationData, logs, externalIds } = useNexusMockData();
    const poasGauges = useLivePOAS();
    const [isInferring, setIsInferring] = useState(false);

    // Simula o estado de inferência da IA para o efeito de borda cintilante
    useEffect(() => {
        const interval = setInterval(() => {
            setIsInferring(true);
            setTimeout(() => setIsInferring(false), 2000);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* COLUNA A: Inteligência Preditiva */}
            <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
                <LTVPropensityCard signal={signal} isInferring={isInferring} />
                <IntentCloud nodes={intentCloud} />
            </motion.div>

            {/* COLUNA B: War Room Central */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
                <WarRoom poasGauges={poasGauges} />
            </motion.div>

            {/* COLUNA C: Execução em Tempo Real */}
            <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
                <ExecutionFeed logs={logs} />
                <SaturationChart data={saturationData} />
            </motion.div>
            
            {/* Novo Módulo 3D */}
            <motion.div className="lg:col-span-5" variants={itemVariants}>
                 <IdentitySynapse3D externalIds={externalIds} />
            </motion.div>
        </motion.div>
    );
};

export default SynapseLayout;
