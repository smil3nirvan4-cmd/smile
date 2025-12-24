
import React, { useState } from 'react';
import SynapseCard from '../../ui/SynapseCard';
import { SynapseCreative } from '../../../types';

const CreativeCard: React.FC<{ creative: SynapseCreative }> = ({ creative }) => {
    const [showOcr, setShowOcr] = useState(false);

    return (
        <SynapseCard 
            className="p-3 relative overflow-hidden cursor-pointer"
            onMouseEnter={() => setShowOcr(true)}
            onMouseLeave={() => setShowOcr(false)}
        >
            <img src={creative.asset_url} alt={creative.ad_name} className="rounded w-full h-32 object-cover" />
            
            {/* Hook Rate Timeline */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
                {creative.hookRate.map((hook, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full" style={{ backgroundColor: hook.status === 'success' ? '#2dd4bf' : '#f87171' }}></div>
                ))}
            </div>

            {/* OCR Overlay */}
            <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${showOcr ? 'opacity-100' : 'opacity-0'}`}>
                {creative.ocrData.map((ocr, i) => (
                    <div 
                        key={i} 
                        className="absolute font-data text-white text-xs bg-black/70 px-1 rounded"
                        style={{ left: `${ocr.position.x}%`, top: `${ocr.position.y}%`, border: '1px solid #00FFFF' }}
                    >
                        {ocr.text}
                    </div>
                ))}
            </div>

            <div className="mt-2">
                <h4 className="text-xs font-semibold text-white truncate">{creative.ad_name}</h4>
                <p className="text-xs text-cyan-400">{creative.hook_type}</p>
            </div>
        </SynapseCard>
    );
};


const CreativeDNAGallery: React.FC<{ creatives: SynapseCreative[] }> = ({ creatives }) => {
    return (
        <SynapseCard className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Multimodal Creative DNA</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {creatives.slice(0, 8).map(creative => (
                    <CreativeCard key={creative.creative_id} creative={creative} />
                ))}
            </div>
        </SynapseCard>
    );
};

export default CreativeDNAGallery;
