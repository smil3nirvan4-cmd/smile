
import React from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { useCounter } from '../../../hooks/useCounter';
import { HighFrequencySignal } from '../../../types';

interface LTVPropensityCardProps {
    signal: HighFrequencySignal;
    isInferring: boolean;
}

const LTVPropensityCard: React.FC<LTVPropensityCardProps> = ({ signal, isInferring }) => {
    const propensity = useCounter(signal.propensityScore * 100, 1500, 1);
    const ltv = useCounter(signal.predictedLTV, 1500, 2);

    return (
        <SynapseCard className="p-4" isInferring={isInferring}>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Predictive Intelligence</h3>
            <div className="space-y-5">
                <div>
                    <div className="text-xs text-cyan-400 font-data">pCVR (Propensity)</div>
                    <div className="text-3xl font-bold font-data text-white">{propensity.toFixed(1)}%</div>
                </div>
                <div>
                    <div className="text-xs text-cyan-400 font-data">pLTV (90-Day)</div>
                    <div className="text-3xl font-bold font-data text-white">${ltv.toFixed(2)}</div>
                </div>
            </div>
        </SynapseCard>
    );
};

export default LTVPropensityCard;
