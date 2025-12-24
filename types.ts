
export type Page = 'Nexus Synapse' | 'Identity Vault' | 'Search Arbitrage' | 'Creative DNA' | 'Executor Logs';

export interface NavItem {
    name: Page;
    icon: JSX.Element;
}

export interface HighFrequencySignal {
    propensityScore: number;
    predictedLTV: number;
    retainedProfit: number;
    activeAlerts: number;
}

export interface IntentClusterNode {
    id: string;
    term: string;
    type: 'core' | 'high_intent' | 'low_intent' | 'drift';
    x: number;
    y: number;
}

export interface SaturationDataPoint {
    spend: number;
    mROAS: number;
}

export interface ExecutorLog {
    id: string;
    timestamp: string;
    type: 'BidShaper' | 'HygieneEnforcer' | 'CreativeAI';
    strategy?: 'Bid Shading' | 'Predatory Aggression' | 'Vectorial Negation' | 'AI Hook Generation';
    message: string;
    details: Record<string, any>;
}

export interface POASGaugeData {
    platform: 'Google' | 'Meta' | 'TikTok';
    poas: number;
    netProfit: number;
    status: 'positive' | 'saturated' | 'negative';
}

// Tipos legados para manter a compatibilidade com páginas antigas
export interface ExternalIdWithScore {
    source: string;
    id: string;
    confidenceScore: number;
}

export interface IdentityVaultEntry {
    nexus_id: string;
    email_sha256: string;
    phone_sha256: string;
    user_agent: string;
    ip_address: string;
    external_ids: ExternalIdWithScore[];
    created_at: string;
    updated_at: string;
}

export interface SearchTerm {
    term_id: string;
    search_term: string;
    platform: string;
    cost: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue_attributed: number;
    roas: number;
    date: string;
    embedding: [number, number];
}

// Adicionado para suportar a página CreativeDNA legada
export interface CreativeDNAEntry {
    creative_id: string;
    ad_name: string;
    asset_url: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
    visual_tags: string[];
    ocr_text: string;
    dominant_colors: string[];
    audio_transcription: string;
    sentiment_score: number;
    performance_score: number;
    created_at: string;
}

// Corrigido para estender CreativeDNAEntry e incluir todos os campos
export interface SynapseCreative extends CreativeDNAEntry {
    hook_type: 'Problem-Solution' | 'User Generated Content' | 'Unboxing' | 'Shock Factor';
    hookRate: { time: number, status: 'success' | 'fail' }[];
    ocrData: { text: string, position: { x: number, y: number } }[];
    pacing_score?: number;
    fatigue_prediction?: number;
}

// Adicionado para compatibilidade com useMockData
export interface FinancialMetrics {
    poas: number;
    spend_velocity: number;
    propensity_accuracy: number;
    ltv_forecast: number;
}
