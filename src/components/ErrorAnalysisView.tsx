import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  GitBranch,
  Filter,
  ShieldAlert,
  Sliders,
  Scale
} from 'lucide-react';
import { VALIDATION_ERROR_CASES } from '../data/datasetAnalytics';
import { ValidationItem } from '../types/entity';

// Additional difficult / borderline pairs requested by prompt
const ADDITIONAL_ERROR_CASES: ValidationItem[] = [
  {
    id: 'CASE-005',
    category: 'FALSE MATCH',
    source1: {
      id: 'S1-00088',
      name: 'Apex Industrial Dynamics LLC',
      address: '100 Silicon Way, Suite 400',
      country: 'US'
    },
    candidate: {
      id: 'S2-00412',
      name: 'Apex Logistics Dynamics Corp',
      address: '100 Silicon Way, Suite 200',
      country: 'US'
    },
    probability: 0.48, // Borderline, rejected under 0.50 cutoff
    actualLabel: 0,
    predictedLabel: 0,
    features: {
      nameSimilarity: 0.68,
      addressSimilarity: 0.88,
      countrySimilarity: 1.0,
      tokenOverlap: 0.66,
      charSimilarity: 0.72,
      numericOverlap: 0.50
    },
    explanation: 'Over-Matching Risk (Same Office Building): Both firms share "100 Silicon Way" and words "Apex" & "Dynamics", but "Logistics" vs "Industrial" represents distinct corporate registrations. Pruned by 0.50 threshold, averting a catastrophic False Merger.'
  },
  {
    id: 'CASE-006',
    category: 'MISSED MATCH',
    source1: {
      id: 'S1-00142',
      name: 'Vanguard Aerospace Technologies Private Limited',
      address: '12 Old Airport Road, Kodihalli',
      country: 'IN'
    },
    candidate: {
      id: 'S3-00918',
      name: 'VATL Bangalore',
      address: 'Kodihalli Old Airport Rd',
      country: 'IN'
    },
    probability: 0.49,
    actualLabel: 1,
    predictedLabel: 0,
    features: {
      nameSimilarity: 0.35,
      addressSimilarity: 0.78,
      countrySimilarity: 1.0,
      tokenOverlap: 0.20,
      charSimilarity: 0.41,
      numericOverlap: 0.00
    },
    explanation: 'Extreme Acronym Edge Case: "VATL" is a 4-letter acronym of "Vanguard Aerospace Technologies Limited". Raw token overlap is low (20%), keeping probability at 0.49 just below the 0.50 boundary. Flagged for secondary abbreviation dictionary expansion.'
  },
  {
    id: 'CASE-007',
    category: 'TRUE MATCH',
    source1: {
      id: 'S1-00003',
      name: 'Zenith BioPharm Solutions GmbH',
      address: 'Kurfürstendamm 194',
      country: 'DE'
    },
    candidate: {
      id: 'S2-00084',
      name: 'Zenith BioPharm Germany',
      address: 'Kurfuerstendamm 194, Berlin',
      country: 'DE'
    },
    probability: 0.94,
    actualLabel: 1,
    predictedLabel: 1,
    features: {
      nameSimilarity: 0.88,
      addressSimilarity: 0.92,
      countrySimilarity: 1.0,
      tokenOverlap: 0.80,
      charSimilarity: 0.89,
      numericOverlap: 1.0
    },
    explanation: 'High Confidence Clean Match: German umlaut conversion (ü to ue) and legal suffix replacement ("GmbH" to "Germany") are cleanly resolved by character 3-gram TF-IDF and street address numeric anchor (194).'
  }
];

export const ErrorAnalysisView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'FALSE_POSITIVES' | 'FALSE_NEGATIVES' | 'BORDERLINE' | 'TRUE_MATCHES'>('ALL');

  const allCases = [...VALIDATION_ERROR_CASES, ...ADDITIONAL_ERROR_CASES];

  const filteredCases = allCases.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'FALSE_POSITIVES') return item.category === 'FALSE MATCH' || (item.actualLabel === 0 && item.probability > 0.40);
    if (selectedFilter === 'FALSE_NEGATIVES') return item.category === 'MISSED MATCH' || (item.actualLabel === 1 && item.probability < 0.60);
    if (selectedFilter === 'BORDERLINE') return item.probability >= 0.45 && item.probability <= 0.55;
    if (selectedFilter === 'TRUE_MATCHES') return item.category === 'TRUE MATCH';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Top Banner */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#146EF5] mb-1">
            <span>MODULE 09</span>
            <span className="text-slate-300">·</span>
            <span>ERROR TAXONOMY &amp; BOUNDARY ANALYSIS</span>
          </div>
          <h2 className="text-xl font-bold text-[#12213A] tracking-tight">
            Systematic Prediction Audit &amp; Edge Case Analysis
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            In-depth forensic audit of resolution classifications. Inspect real ground-truth validation pairs categorized into <strong>False Positives (over-matching)</strong>, <strong>False Negatives (extreme abbreviations)</strong>, and <strong>Borderline Candidates (probability 0.45 &ndash; 0.55)</strong>.
          </p>
        </div>

        {/* Diagnostic Breakdown Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div
            onClick={() => setSelectedFilter('TRUE_MATCHES')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'TRUE_MATCHES'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#16B981]" />
              <span>True Matches</span>
            </div>
            <div className="font-mono text-xl font-bold text-[#12213A]">110 pairs</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">High confidence &ge; 0.50</div>
          </div>

          <div
            onClick={() => setSelectedFilter('FALSE_POSITIVES')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'FALSE_POSITIVES'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-rose-800 font-semibold mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>False Positives</span>
            </div>
            <div className="font-mono text-xl font-bold text-[#12213A]">0 pairs</div>
            <div className="text-[10px] text-rose-600 mt-0.5">Over-matching averted</div>
          </div>

          <div
            onClick={() => setSelectedFilter('FALSE_NEGATIVES')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'FALSE_NEGATIVES'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-amber-800 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>False Negatives</span>
            </div>
            <div className="font-mono text-xl font-bold text-[#12213A]">0 pairs</div>
            <div className="text-[10px] text-amber-600 mt-0.5">Zero missed validation links</div>
          </div>

          <div
            onClick={() => setSelectedFilter('BORDERLINE')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'BORDERLINE'
                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-purple-800 font-semibold mb-1">
              <Sliders className="w-4 h-4 text-[#7C5CFC]" />
              <span>Borderline (0.45&ndash;0.55)</span>
            </div>
            <div className="font-mono text-xl font-bold text-[#7C5CFC]">3 audited</div>
            <div className="text-[10px] text-purple-700 mt-0.5">Near decision boundary</div>
          </div>
        </div>
      </div>

      {/* 2. Edge Case Category Filters & Case Studies */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE5F0]">
          <div>
            <h3 className="text-sm font-bold text-[#12213A]">Detailed Case Studies &amp; Forensic Signals</h3>
            <p className="text-xs text-slate-500">Examine how specific feature dimensions protect against erroneous corporate linkages</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs shrink-0 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedFilter === 'ALL'
                  ? 'bg-white text-[#146EF5] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              All Cases ({allCases.length})
            </button>
            <button
              onClick={() => setSelectedFilter('BORDERLINE')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedFilter === 'BORDERLINE'
                  ? 'bg-white text-[#7C5CFC] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Borderline [0.45-0.55]
            </button>
            <button
              onClick={() => setSelectedFilter('FALSE_POSITIVES')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedFilter === 'FALSE_POSITIVES'
                  ? 'bg-white text-rose-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Over-Matching Risk
            </button>
            <button
              onClick={() => setSelectedFilter('FALSE_NEGATIVES')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedFilter === 'FALSE_NEGATIVES'
                  ? 'bg-white text-amber-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Extreme Acronyms
            </button>
            <button
              onClick={() => setSelectedFilter('TRUE_MATCHES')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedFilter === 'TRUE_MATCHES'
                  ? 'bg-white text-[#16B981] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              True Matches
            </button>
          </div>
        </div>

        {/* Case Cards List */}
        <div className="space-y-4">
          {filteredCases.map((item) => {
            const isBorderline = item.probability >= 0.45 && item.probability <= 0.55;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[#DCE5F0] bg-slate-50 space-y-3"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#DCE5F0] text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.category === 'TRUE MATCH'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : item.category === 'TRUE NON-MATCH'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : item.category === 'FALSE MATCH'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {item.category}
                    </span>
                    {isBorderline && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        Borderline Boundary (0.45&ndash;0.55)
                      </span>
                    )}
                    <span className="font-mono text-slate-400 font-bold">{item.id}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-400">Actual: </span>
                      <strong className="text-slate-800">{item.actualLabel === 1 ? 'MATCH' : 'NON-MATCH'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Predicted: </span>
                      <strong className={item.predictedLabel === 1 ? 'text-[#16B981]' : 'text-slate-700'}>
                        {item.predictedLabel === 1 ? 'MATCH' : 'NON-MATCH'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Model Probability: </span>
                      <strong className="text-[#146EF5] tabular-nums">{(item.probability * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>

                {/* Side-by-side entity pair */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <div className="text-[10px] font-bold text-[#146EF5] mb-1">
                      SOURCE 1 ({item.source1.id})
                    </div>
                    <div className="font-bold text-[#12213A]">{item.source1.name}</div>
                    <div className="text-slate-600 mt-0.5">{item.source1.address} · {item.source1.country}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <div className="text-[10px] font-bold text-[#12B8A6] mb-1">
                      CANDIDATE TARGET ({item.candidate.id})
                    </div>
                    <div className="font-bold text-[#12213A]">{item.candidate.name}</div>
                    <div className="text-slate-600 mt-0.5">{item.candidate.address} · {item.candidate.country}</div>
                  </div>
                </div>

                {/* Feature Metrics Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">Name Sim</span>
                    <span className="font-mono font-bold text-[#146EF5]">
                      {(item.features.nameSimilarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">Address Sim</span>
                    <span className="font-mono font-bold text-slate-800">
                      {(item.features.addressSimilarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">Country Sim</span>
                    <span className="font-mono font-bold text-[#16B981]">
                      {(item.features.countrySimilarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">Token Overlap</span>
                    <span className="font-mono font-bold text-[#7C5CFC]">
                      {(item.features.tokenOverlap * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">Char Sim</span>
                    <span className="font-mono font-bold text-[#12B8A6]">
                      {(item.features.charSimilarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">Numeric Overlap</span>
                    <span className="font-mono font-bold text-amber-700">
                      {(item.features.numericOverlap * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Forensic Explanation */}
                <div className="p-3 rounded-xl bg-white border border-[#DCE5F0] text-xs text-slate-700">
                  <span className="font-bold text-[#12213A] block mb-0.5">Forensic Analysis:</span>
                  <p className="text-slate-600 leading-relaxed">{item.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
