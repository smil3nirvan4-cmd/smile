
import React, { useState, useMemo } from 'react';
import { useMockData } from '../hooks/useMockData';
import { SearchTerm } from '../types';
import Card from '../components/ui/Card';
import { useGemini } from '../hooks/useGemini';
import Spinner from '../components/ui/Spinner';

const EmbeddingScatterPlot: React.FC<{ 
    terms: SearchTerm[]; 
    onSelect: (term: SearchTerm) => void;
    selectedTerms: SearchTerm[];
}> = ({ terms, onSelect, selectedTerms }) => {
    const selectedIds = new Set(selectedTerms.map(t => t.term_id));
    return (
        <Card className="p-4 h-96">
            <h3 className="text-lg font-semibold text-white mb-2">Semantic Space</h3>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {terms.map(term => {
                    const isSelected = selectedIds.has(term.term_id);
                    const color = term.roas > 3 ? 'text-green-400' : term.roas > 1 ? 'text-yellow-400' : 'text-red-400';
                    return (
                        <circle
                            key={term.term_id}
                            cx={term.embedding[0] * 100}
                            cy={term.embedding[1] * 100}
                            r={isSelected ? 1.5 : 0.75}
                            className={`${color} transition-all duration-200 cursor-pointer hover:opacity-100`}
                            opacity={isSelected ? 1 : 0.6}
                            onClick={() => onSelect(term)}
                        >
                            <title>{`${term.search_term} (ROAS: ${term.roas})`}</title>
                        </circle>
                    );
                })}
            </svg>
        </Card>
    );
};

const SearchArbitrage: React.FC = () => {
    const { searchTerms } = useMockData();
    const [selectedTerms, setSelectedTerms] = useState<SearchTerm[]>([]);
    const { isLoading, result, generateContent } = useGemini();

    const handleSelectTerm = (term: SearchTerm) => {
        setSelectedTerms(prev => {
            const isSelected = prev.find(t => t.term_id === term.term_id);
            if (isSelected) {
                return prev.filter(t => t.term_id !== term.term_id);
            }
            return [...prev, term].slice(-10); // Limit selection
        });
    };

    const analyzeSelection = () => {
        if (selectedTerms.length < 2) return;
        const prompt = `
            You are an AdTech expert analyzing search term performance for arbitrage opportunities.
            Here is a list of selected search terms with their ROAS (Return on Ad Spend):
            ${selectedTerms.map(t => `- "${t.search_term}" (ROAS: ${t.roas})`).join('\n')}

            Based on their semantic similarity (they are close in the embedding space) and differing ROAS, explain the arbitrage opportunity.
            Identify high-performing terms to scale and low-performing but semantically similar terms to potentially re-evaluate or use for negative targeting.
            Be concise and actionable.
        `;
        generateContent(prompt);
    };

    const sortedTerms = useMemo(() => [...searchTerms].sort((a, b) => b.cost - a.cost), [searchTerms]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Search Term Performance</h3>
                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700/30 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Search Term</th>
                                    <th scope="col" className="px-4 py-3">Platform</th>
                                    <th scope="col" className="px-4 py-3">Cost</th>
                                    <th scope="col" className="px-4 py-3">Revenue</th>
                                    <th scope="col" className="px-4 py-3">ROAS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTerms.slice(0, 50).map(term => (
                                    <tr key={term.term_id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-4 py-3 font-medium text-white truncate max-w-xs">{term.search_term}</td>
                                        <td className="px-4 py-3 text-gray-300">{term.platform}</td>
                                        <td className="px-4 py-3 text-gray-300">${term.cost.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-gray-300">${term.revenue_attributed.toFixed(2)}</td>
                                        <td className={`px-4 py-3 font-bold ${term.roas > 3 ? 'text-green-400' : term.roas > 1 ? 'text-yellow-400' : 'text-red-400'}`}>{term.roas.toFixed(2)}x</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <EmbeddingScatterPlot terms={searchTerms} onSelect={handleSelectTerm} selectedTerms={selectedTerms} />
                <Card className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">AI Arbitrage Analysis</h3>
                    {selectedTerms.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-400 mb-2">Selected Terms:</p>
                            <div className="flex flex-wrap gap-1">
                                {selectedTerms.map(t => <span key={t.term_id} className="bg-indigo-500/30 text-indigo-200 text-xs px-2 py-1 rounded">{t.search_term}</span>)}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={analyzeSelection}
                        disabled={selectedTerms.length < 2 || isLoading}
                        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
                    >
                        {isLoading ? <Spinner size="sm" /> : 'Analyze Opportunity'}
                    </button>
                    {result && (
                        <div className="mt-4 text-sm text-gray-300 leading-relaxed">
                            {result}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SearchArbitrage;
