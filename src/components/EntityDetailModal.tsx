import React from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GitBranch,
  Sliders,
  Check
} from 'lucide-react';
import { EntityMatchResult } from '../types/entity';

interface EntityDetailModalProps {
  matchResult: EntityMatchResult | null;
  onClose: () => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ matchResult, onClose }) => {
  if (!matchResult) return null;

  const { source1Entity, matchedEntities, isSingleton, candidatePairCount } = matchResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-600">{source1Entity.id}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">Reference Entity</span>
                {isSingleton ? (
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Singleton (Unmatched)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {matchedEntities.length} Verified Match{matchedEntities.length > 1 ? 'es' : ''}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{source1Entity.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Reference Entity Snapshot */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Source 1 Reference Record Attributes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Normalized Name</span>
                <span className="text-slate-900 font-bold">{source1Entity.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Address Line</span>
                <span className="text-slate-700">{source1Entity.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">City / Postal</span>
                <span className="text-slate-700">{source1Entity.city} {source1Entity.postalCode || ''}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Country</span>
                <span className="font-mono text-blue-600 font-bold">{source1Entity.country}</span>
              </div>
            </div>
          </div>

          {/* Blocking & Pair Stats Banner */}
          <div className="flex items-center justify-between text-xs bg-blue-50/60 border border-blue-200 rounded-xl p-3 text-blue-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                4-Stage Blocking Generated <strong>{candidatePairCount} candidate pairs</strong> for {source1Entity.id} across Sources 2 &amp; 3.
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-blue-700">
              Cutoff: &ge; 0.50
            </span>
          </div>

          {/* Matched Entities Side-by-Side */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Predicted Multi-Source Matches ({matchedEntities.length})
              </h4>
              <span className="text-xs text-slate-500">Classification: Random Forest Classifier</span>
            </div>

            {matchedEntities.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-800">Classified as Singleton Entity</div>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  None of the candidate pairs exceeded the precision threshold of 0.50. This enterprise represents an isolated entity without duplicate counterparts in Sources 2 and 3.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchedEntities.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                  >
                    {/* Match Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                          match.source === 'S2'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}>
                          {match.id} ({match.source})
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-700 font-medium">
                          Variation: <strong className="text-slate-900">{match.variationType}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Random Forest Prob.</div>
                          <div className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                            {(match.similarityScore * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Side-by-Side Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Left: S1 Reference */}
                      <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">Source 1 Reference</div>
                        <div className="font-bold text-slate-900">{source1Entity.name}</div>
                        <div className="text-slate-600 mt-1">{source1Entity.address}, {source1Entity.city}</div>
                        <div className="text-slate-500 font-mono mt-1 text-[11px]">Country: {source1Entity.country}</div>
                      </div>

                      {/* Right: Matched Target */}
                      <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">Matched {match.source} Candidate</div>
                        <div className="font-bold text-slate-900">{match.name}</div>
                        <div className="text-slate-600 mt-1">{match.address}, {match.city}</div>
                        <div className="text-slate-500 font-mono mt-1 text-[11px]">Country: {match.country}</div>
                      </div>
                    </div>

                    {/* Feature Vector Signals */}
                    <div className="pt-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Computed Feature Signals:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Name Levenshtein</span>
                          <span className="font-mono text-blue-600 font-bold tabular-nums">
                            {(match.levenshteinScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Name TF-IDF Cosine</span>
                          <span className="font-mono text-purple-600 font-bold tabular-nums">
                            {(match.tfidfScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Token Jaccard</span>
                          <span className="font-mono text-indigo-600 font-bold tabular-nums">
                            {(match.jaccardScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Address Levenshtein</span>
                          <span className="font-mono text-slate-800 font-bold tabular-nums">
                            {(match.addressScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-[#F8FAFC] text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span>{source1Entity.id}</span>
            <span>·</span>
            <span>TSV output row formatted</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
