
import { useState, useEffect } from 'react';
import { HighFrequencySignal, IntentClusterNode, SaturationDataPoint, ExecutorLog, ExternalIdWithScore } from '../types';

const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

const createInitialIntentCloud = (): IntentClusterNode[] => {
    const coreNode = { id: 'core', term: 'Tênis de Corrida Profissional', type: 'core' as const, x: 50, y: 50 };
    const nodes: IntentClusterNode[] = [coreNode];
    const terms = [
        { term: 'sapatilhas para maratona', type: 'high_intent' }, { term: 'calçado de performance', type: 'high_intent' },
        { term: 'tênis barato', type: 'low_intent' }, { term: 'sapatos casuais', type: 'low_intent' },
        { term: 'corrida de cavalos', type: 'drift' }, { term: 'tênis de mesa', type: 'drift' }
    ];
    terms.forEach((t, i) => {
        let radius, angle;
        if (t.type === 'high_intent') radius = 15 + Math.random() * 5;
        else if (t.type === 'low_intent') radius = 30 + Math.random() * 10;
        else radius = 45 + Math.random() * 5;
        angle = (i / terms.length) * 2 * Math.PI + Math.random() * 0.5;
        nodes.push({
            id: generateUUID(),
            term: t.term,
            type: t.type as any,
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
        });
    });
    return nodes;
};

const createSaturationData = (): SaturationDataPoint[] => {
    const data: SaturationDataPoint[] = [];
    for (let i = 0; i <= 100; i += 5) {
        const spend = i * 100;
        const mROAS = 5 * Math.exp(-0.03 * i) + (Math.random() - 0.5) * 0.5;
        data.push({ spend, mROAS: Math.max(0.5, mROAS) });
    }
    return data;
};

const createMockLog = (): ExecutorLog => {
    const logTypes = [
        { type: 'BidShaper', strategy: 'Bid Shading', message: 'Lucro retido: $3.50' },
        { type: 'BidShaper', strategy: 'Predatory Aggression', message: 'Lance agressivo em LTV > $500' },
        { type: 'HygieneEnforcer', strategy: 'Vectorial Negation', message: 'Termo "corrida de cavalos" negativado (dist > 0.4)' },
        { type: 'CreativeAI', strategy: 'AI Hook Generation', message: 'Novo hook "Visual Shock" gerado para criativo saturado' },
    ];
    const log = logTypes[Math.floor(Math.random() * logTypes.length)];
    return {
        id: generateUUID(),
        timestamp: new Date().toISOString(),
        type: log.type as any,
        strategy: log.strategy as any,
        message: log.message,
        details: { targetId: `aud-${Math.floor(1000 + Math.random() * 9000)}` }
    };
};

const createExternalIds = (): ExternalIdWithScore[] => [
    { source: 'Google Ads', id: `gclid_${generateUUID()}`, confidenceScore: 0.95 },
    { source: 'Meta Ads', id: `fbclid_${generateUUID()}`, confidenceScore: 0.88 },
    { source: 'TikTok', id: `ttclid_${generateUUID()}`, confidenceScore: 0.82 },
    { source: 'Direct', id: `session_${generateUUID()}`, confidenceScore: 0.75 },
];

export const useNexusMockData = () => {
    const [signal, setSignal] = useState<HighFrequencySignal>({
        propensityScore: 0.75,
        predictedLTV: 350.00,
        retainedProfit: 12345.00,
        activeAlerts: 0,
    });
    const [intentCloud] = useState<IntentClusterNode[]>(createInitialIntentCloud);
    const [saturationData] = useState<SaturationDataPoint[]>(createSaturationData);
    const [logs, setLogs] = useState<ExecutorLog[]>(() => Array.from({ length: 20 }, createMockLog));
    const [externalIds] = useState<ExternalIdWithScore[]>(createExternalIds);

    useEffect(() => {
        const signalInterval = setInterval(() => {
            setSignal({
                propensityScore: Math.random(),
                predictedLTV: 50 + Math.random() * 800,
                retainedProfit: signal.retainedProfit + Math.random() * 50,
                activeAlerts: Math.random() > 0.9 ? 1 : 0,
            });
        }, 2500);

        const logInterval = setInterval(() => {
            setLogs(prev => [createMockLog(), ...prev.slice(0, 19)]);
        }, 4000);

        return () => {
            clearInterval(signalInterval);
            clearInterval(logInterval);
        };
    }, [signal.retainedProfit]);

    return { signal, intentCloud, saturationData, logs, externalIds };
};
