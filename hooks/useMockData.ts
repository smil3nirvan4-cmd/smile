
import { useState, useEffect, useMemo } from 'react';
import { IdentityVaultEntry, SearchTerm, SynapseCreative, ExecutorLog, FinancialMetrics } from '../types';

const generateSHA256 = () => [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

const createMockIdentity = (): IdentityVaultEntry => ({
    nexus_id: generateUUID(),
    email_sha256: generateSHA256(),
    phone_sha256: generateSHA256(),
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    ip_address: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.***.***`,
    external_ids: [
        { source: 'ga_client_id', id: `GA1.1.${Math.floor(Math.random()*1e9)}.${Math.floor(Math.random()*1e9)}`, confidenceScore: 0.9 },
        { source: 'fbp', id: `fb.1.${Date.now()}.${Math.floor(Math.random()*1e9)}`, confidenceScore: 0.85 }
    ],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
});

const searchTermsPool = ['blue suede shoes', 'running shoes for men', 'best sneakers 2024', 'waterproof hiking boots', 'leather dress shoes', 'sustainable footwear', 'vegan leather boots', 'custom sneakers online', 'orthopedic work shoes'];
const createMockSearchTerm = (): SearchTerm => {
    const cost = Math.random() * 100;
    const conversions = Math.floor(Math.random() * 10);
    const revenue = conversions * (50 + Math.random() * 150);
    return {
        term_id: generateUUID(),
        search_term: searchTermsPool[Math.floor(Math.random() * searchTermsPool.length)],
        platform: ['Google Ads', 'Bing', 'Amazon Ads'][Math.floor(Math.random() * 3)],
        cost: parseFloat(cost.toFixed(2)),
        impressions: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 500),
        conversions,
        revenue_attributed: parseFloat(revenue.toFixed(2)),
        roas: cost > 0 ? parseFloat((revenue / cost).toFixed(2)) : 0,
        date: new Date().toISOString().split('T')[0],
        embedding: [Math.random(), Math.random()],
    };
};

const createMockCreative = (): SynapseCreative => ({
    creative_id: generateUUID(),
    ad_name: `Summer_Sale_Video_Ad_${Math.floor(Math.random()*100)}`,
    asset_url: `https://picsum.photos/seed/${Math.random()}/400/300`,
    media_type: 'VIDEO',
    visual_tags: ['Smiling person', 'Red background', 'Product shot', 'Outdoors'][Math.floor(Math.random()*4)].split(', '),
    ocr_text: ['50% OFF', 'LIMITED TIME', 'SHOP NOW'][Math.floor(Math.random()*3)],
    dominant_colors: ['#FF5733', '#33FF57', '#3357FF'],
    audio_transcription: "Sample audio transcription for the ad.",
    sentiment_score: Math.random() * 2 - 1,
    performance_score: parseFloat((Math.random() * 100).toFixed(2)),
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    hook_type: ['Problem-Solution', 'User Generated Content', 'Unboxing', 'Shock Factor'][Math.floor(Math.random()*4)] as any,
    hookRate: [],
    ocrData: [],
    pacing_score: Math.random() * 100,
    fatigue_prediction: Math.random() * 100,
});

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

export const useMockData = () => {
    const financialMetrics = useMemo<FinancialMetrics>(() => ({
        poas: parseFloat((2.5 + Math.random() * 2).toFixed(2)),
        spend_velocity: parseFloat((450 + Math.random() * 100).toFixed(2)),
        propensity_accuracy: parseFloat((0.85 + Math.random() * 0.1).toFixed(2)),
        ltv_forecast: parseFloat((150 + Math.random() * 50).toFixed(2)),
    }), []);

    const [identities] = useState<IdentityVaultEntry[]>(() => Array.from({ length: 50 }, createMockIdentity));
    const [searchTerms] = useState<SearchTerm[]>(() => Array.from({ length: 100 }, createMockSearchTerm));
    const [creatives] = useState<SynapseCreative[]>(() => Array.from({ length: 24 }, createMockCreative));
    const [logs, setLogs] = useState<ExecutorLog[]>(() => Array.from({ length: 20 }, createMockLog).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prevLogs => [createMockLog(), ...prevLogs.slice(0, 49)].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return { financialMetrics, identities, searchTerms, creatives, logs };
};
