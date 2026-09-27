import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BarChart3,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { FEATURE_METRICS } from '../data/mockEntities';
import { FeatureMetric } from '../types/entity';

function calculateLevenshtein(s1: string, s2: string): number {
  const str1 = s1.toLowerCase().trim();
  const str2 = s2.toLowerCase().trim();
  if (str1 === str2) return 1.0;
  if (!str1.length || !str2.length) return 0.0;

  const d: number[][] = [];
  for (let i = 0; i <= str1.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }

  const distance = d[str1.length][str2.length];
  const maxLen = Math.max(str1.length, str2.length);
  return Math.max(0, 1 - distance / maxLen);
}

function calculateJaccard(s1: string, s2: string): number {
  const tokens1 = new Set(s1.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean));
  const tokens2 = new Set(s2.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean));

  if (!tokens1.size || !tokens2.size) return 0;
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  return intersection.size / union.size;
}

export const FeaturesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Name' | 'Address' | 'Country' | 'Statistical'>('All');

  // Interactive Sandbox state
  const [recordAName, setRecordAName] = useState('ABC Technologies Pvt Ltd');
  const [recordBName, setRecordBName] = useState('ABC Technology Private Limited');
  const [recordAAddress, setRecordAAddress] = useState('Plot 42, Electronics City Phase 1, Hosur Road');
  const [recordBAddress, setRecordBAddress] = useState('42 Electronics City, Hosur Rd');

  const filteredFeatures = useMemo(() => {
    if (selectedCategory === 'All') return FEATURE_METRICS;
    return FEATURE_METRICS.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  // Live computed scores
  const liveLevenshtein = useMemo(() => calculateLevenshtein(recordAName, recordBName), [recordAName, recordBName]);
  const liveJaccard = useMemo(() => calculateJaccard(recordAName, recordBName), [recordAName, recordBName]);
  const liveAddressLev = useMemo(() => calculateLevenshtein(recordAAddress, recordBAddress), [recordAAddress, recordBAddress]);
  const liveAddressJaccard = useMemo(() => calculateJaccard(recordAAddress, recordBAddress), [recordAAddress, recordBAddress]);

  // Simulated Random Forest probability approximation based on weighted sum of top features
  const estimatedRfProb = Math.min(
    0.99,
    Math.max(
      0.02,
      liveLevenshtein * 0.40 +
      liveJaccard * 0.25 +
      liveAddressLev * 0.25 +
      liveAddressJaccard * 0.10
    )
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <span>FEATURE VECTOR ARCHITECTURE</span>
            <span className="text-slate-300">·</span>
            <span>22 ENGINEERED METRICS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Comprehensive Entity Similarity Feature Space
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every candidate pair is parameterized into 22 orthogonal signals capturing string distance, character n-grams, token overlap, legal suffix canonicalization, postal anchors, and source lineage.
          </p>
        </div>

        {/* Feature Category Breakdown Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 block">NAME FEATURES</span>
            <span className="text-base font-bold font-mono text-blue-600">10 features</span>
            <span className="text-[11px] text-slate-500 block">58.6% Total Importance</span>
          </div>
          <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 block">ADDRESS FEATURES</span>
            <span className="text-base font-bold font-mono text-purple-600">7 features</span>
            <span className="text-[11px] text-slate-500 block">28.0% Total Importance</span>
          </div>
          <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 block">COUNTRY FEATURES</span>
            <span className="text-base font-bold font-mono text-teal-700">2 features</span>
            <span className="text-[11px] text-slate-500 block">5.7% Total Importance</span>
          </div>
          <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 block">STATISTICAL / OTHER</span>
            <span className="text-base font-bold font-mono text-amber-600">3 features</span>
            <span className="text-[11px] text-slate-500 block">7.7% Total Importance</span>
          </div>
        </div>
      </div>

      {/* Live Feature Calculator Sandbox */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Interactive Feature Vector Calculator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Type two arbitrary business titles or addresses to test real-time feature extraction &amp; model scoring
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Real-Time In-Browser
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Entity A Input */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Entity A (Reference)
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Business Name</label>
              <input
                type="text"
                value={recordAName}
                onChange={(e) => setRecordAName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Address</label>
              <input
                type="text"
                value={recordAAddress}
                onChange={(e) => setRecordAAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Entity B Input */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Entity B (Candidate Target)
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Business Name</label>
              <input
                type="text"
                value={recordBName}
                onChange={(e) => setRecordBName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Address</label>
              <input
                type="text"
                value={recordBAddress}
                onChange={(e) => setRecordBAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Live Vector Output Bar */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">name_levenshtein</span>
              <span className="font-mono text-base font-bold text-blue-600 tabular-nums">
                {(liveLevenshtein * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">name_token_jaccard</span>
              <span className="font-mono text-base font-bold text-indigo-600 tabular-nums">
                {(liveJaccard * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">address_levenshtein</span>
              <span className="font-mono text-base font-bold text-purple-600 tabular-nums">
                {(liveAddressLev * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">address_token_jaccard</span>
              <span className="font-mono text-base font-bold text-slate-700 tabular-nums">
                {(liveAddressJaccard * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="border-l border-slate-200 pl-4 text-right">
            <span className="text-[10px] text-slate-500 font-semibold block">Model Prediction</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {(estimatedRfProb * 100).toFixed(1)}%
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                estimatedRfProb >= 0.50
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {estimatedRfProb >= 0.50 ? 'MATCH' : 'NO MATCH'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Table & Category Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ranked Feature Importance
            </h3>
            <p className="text-xs text-slate-500">
              Derived from Random Forest mean decrease in impurity (Gini importance)
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs shrink-0 overflow-x-auto">
            {(['All', 'Name', 'Address', 'Country', 'Statistical'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.name}
              className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs text-slate-400 font-bold w-6 shrink-0">
                    #{FEATURE_METRICS.findIndex((f) => f.name === feat.name) + 1}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 truncate">
                    {feat.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    feat.category === 'Name'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : feat.category === 'Address'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : feat.category === 'Country'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {feat.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(feat.importance / 18.5) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 w-12 text-right tabular-nums">
                    {feat.importance.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1 pl-8">
                <span>{feat.description}</span>
                <span className="font-mono text-[11px] text-slate-400">{feat.formula}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
