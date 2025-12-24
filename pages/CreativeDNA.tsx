
import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { CreativeDNAEntry } from '../types';
import Card from '../components/ui/Card';

const CreativeDetailModal: React.FC<{ creative: CreativeDNAEntry; onClose: () => void }> = ({ creative, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-white mb-4">{creative.ad_name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <img src={creative.asset_url} alt={creative.ad_name} className="rounded-lg w-full" />
                            <div className="mt-4">
                                <p className="text-sm text-gray-400">Performance Score</p>
                                <p className="text-2xl font-bold text-indigo-400">{creative.performance_score.toFixed(1)}</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-400">Visual Tags</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {creative.visual_tags.map(tag => <span key={tag} className="bg-gray-700 px-2 py-1 rounded text-gray-300 text-xs">{tag}</span>)}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400">OCR Text</p>
                                <p className="bg-gray-700 p-2 rounded mt-1 text-gray-200 font-mono">{creative.ocr_text}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400">Dominant Colors</p>
                                <div className="flex gap-2 mt-1">
                                    {creative.dominant_colors.map(color => <div key={color} style={{ backgroundColor: color }} className="w-6 h-6 rounded-full border-2 border-gray-600" title={color}></div>)}
                                </div>
                            </div>
                             <div>
                                <p className="font-semibold text-gray-400">Audio Summary</p>
                                <p className="text-gray-300 italic">"{creative.audio_transcription}"</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400">Sentiment Score</p>
                                <p className={`font-bold ${creative.sentiment_score > 0.3 ? 'text-green-400' : creative.sentiment_score < -0.3 ? 'text-red-400' : 'text-yellow-400'}`}>{creative.sentiment_score.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreativeCard: React.FC<{ creative: CreativeDNAEntry; onClick: () => void }> = ({ creative, onClick }) => (
    <Card onClick={onClick} className="overflow-hidden group">
        <div className="relative">
            <img src={creative.asset_url} alt={creative.ad_name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-2 right-2 bg-indigo-600/80 text-white text-xs font-bold px-2 py-1 rounded-full">{creative.performance_score.toFixed(0)}</div>
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-white truncate">{creative.ad_name}</h3>
            <p className="text-xs text-gray-400">{creative.media_type}</p>
            <div className="flex flex-wrap gap-1 mt-2">
                {creative.visual_tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md">{tag}</span>
                ))}
            </div>
        </div>
    </Card>
);

const CreativeDNA: React.FC = () => {
    const { creatives } = useMockData();
    const [selectedCreative, setSelectedCreative] = useState<CreativeDNAEntry | null>(null);

    const sortedCreatives = [...creatives].sort((a, b) => b.performance_score - a.performance_score);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {sortedCreatives.map(creative => (
                    <CreativeCard key={creative.creative_id} creative={creative} onClick={() => setSelectedCreative(creative)} />
                ))}
            </div>
            {selectedCreative && <CreativeDetailModal creative={selectedCreative} onClose={() => setSelectedCreative(null)} />}
        </div>
    );
};

export default CreativeDNA;
