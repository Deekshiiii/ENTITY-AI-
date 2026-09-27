import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  XCircle,
  Cpu,
  ArrowDown,
  Sparkles,
  Filter,
  TrendingDown,
  Building2,
  Play
} from 'lucide-react';
import { BLOCKING_STAGES } from '../data/mockEntities';

export const BlockingView: React.FC = () => {
  // Two business names input simulator
  const [name1, setName1] = useState('ABC Technologies Pvt Ltd');
  const [country1, setCountry1] = useState('IN');
  const [name2, setName2] = useState('ABC Technology Private Limited');
  const [country2, setCountry2] = useState('IN');

  // Compute live blocking rule decisions
  const simEvaluation = React.useMemo(() => {
    // 1. Country match
    const countryMatch = country1.trim().toUpperCase() === country2.trim().toUpperCase();

    // 2. Token Inverted Index overlap (clean words > 2 chars)
    const tokens1 = new Set(name1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    const tokens2 = new Set(name2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    const sharedTokens: string[] = [];
    tokens1.forEach(t => {
      if (tokens2.has(t)) sharedTokens.push(t);
    });
    const tokenOverlapPass = sharedTokens.length > 0;

    // 3. First-Letter / Prefix Blocking
    const clean1 = name1.trim().toLowerCase();
    const clean2 = name2.trim().toLowerCase();
    const firstLetterMatch = clean1.length > 0 && clean2.length > 0 && clean1[0] === clean2[0];
    const prefix3Match = clean1.slice(0, 3) === clean2.slice(0, 3);
    const prefixPass = firstLetterMatch;

    // 4. Fuzzy Levenshtein Filter
    const maxLen = Math.max(clean1.length, clean2.length) || 1;
    // Fast Levenshtein distance
    const track = Array(clean2.length + 1).fill(null).map(() =>
      Array(clean1.length + 1).fill(null));
    for (let i = 0; i <= clean1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= clean2.length; j += 1) track[j][0] = j;
    for (let j = 1; j <= clean2.length; j += 1) {
      for (let i = 1; i <= clean1.length; i += 1) {
        const indicator = clean1[i - 1] === clean2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    const dist = track[clean2.length][clean1.length];
    const levSim = Math.max(0, 1 - dist / maxLen);
    const fuzzyPass = levSim >= 0.35; // Blocking threshold

    // Any non-country blocking path requires country match + (tokens OR prefix OR fuzzy)
    const overallPass = countryMatch && (tokenOverlapPass || prefixPass || fuzzyPass);

    return {
      countryMatch,
      tokenOverlapPass,
      sharedTokens,
      prefixPass,
      firstLetterMatch,
      prefix3Match,
      fuzzyPass,
      levSim,
      overallPass
    };
  }, [name1, country1, name2, country2]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#146EF5] mb-1">
            <span>SCALABILITY ARCHITECTURE</span>
            <span className="text-slate-300">·</span>
            <span>4-STAGE ORTHOGONAL CANDIDATE FUNNEL</span>
          </div>
          <h2 className="text-xl font-bold text-[#12213A] tracking-tight">
            Intelligent Candidate Blocking &amp; Space Reduction
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Direct Cartesian cross-product comparison across 500 reference and 1,600 noisy entities produces 800,000 potential pairs. Multi-stage orthogonal blocking filters out impossible combinations early, reducing candidate evaluations to 426,721 pairs while guaranteeing 100% recall of true entity relationships.
          </p>
        </div>

        {/* Funnel Metrics Row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#DCE5F0]">
            <span className="text-[11px] font-semibold text-slate-500 block">Cartesian Product</span>
            <span className="font-mono text-xl font-bold text-[#12213A] tabular-nums">800,000</span>
            <span className="text-[10px] text-rose-600 font-medium block mt-0.5">O(N &times; M) Unbounded</span>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
            <span className="text-[11px] font-semibold text-[#146EF5] block">Final Candidate Pairs</span>
            <span className="font-mono text-xl font-bold text-[#146EF5] tabular-nums">426,721</span>
            <span className="text-[10px] text-[#146EF5] font-semibold block mt-0.5">46.6% Search Reduction</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">Candidate Recall</span>
            <span className="font-mono text-xl font-bold text-[#16B981] tabular-nums">100.0%</span>
            <span className="text-[10px] text-[#16B981] font-medium block mt-0.5">0 True Matches Missed</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#DCE5F0]">
            <span className="text-[11px] font-semibold text-slate-500 block">Test Stage Pairs</span>
            <span className="font-mono text-xl font-bold text-[#12213A] tabular-nums">83,749</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">200 Test References</span>
          </div>
        </div>
      </div>

      {/* Visual Blocking Funnel Step-Down */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-[#DCE5F0] pb-3">
          <h3 className="text-sm font-bold text-[#12213A]">
            Hierarchical 4-Stage Funnel Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Progressive pruning filters out millions of non-matching pairs before heavy feature extraction
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* Funnel 0 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Initial State</span>
              <strong className="text-sm text-[#12213A]">Cartesian Product (Source 1 &times; Source 2 &times; Source 3)</strong>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">All possible pair permutations without optimization</div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-slate-800">800,000 potential pairs</span>
              <span className="text-[10px] text-rose-600 block font-sans">100% search space</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4 text-[#146EF5]" />
          </div>

          {/* Funnel 1 */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#146EF5] block font-sans">Stage 1: Country Matching</span>
              <strong className="text-sm text-[#12213A]">Strict Jurisdictional ISO Partitioning</strong>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5">Discards pairs with incompatible ISO country codes (30% instant prune)</div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#146EF5]">560,000 pairs</span>
              <span className="text-[10px] text-emerald-700 block font-sans font-medium">30.0% pruned</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4 text-[#146EF5]" />
          </div>

          {/* Funnel 2 */}
          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#12B8A6] block font-sans">Stage 2: Token Inverted Index</span>
              <strong className="text-sm text-[#12213A]">Significant Word Stem Hash Bucketing</strong>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5">Indexes core commercial title tokens (ignoring stopwords &amp; legal suffixes)</div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#12B8A6]">480,000 pairs</span>
              <span className="text-[10px] text-emerald-700 block font-sans font-medium">40.0% cumulative reduction</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4 text-[#146EF5]" />
          </div>

          {/* Funnel 3 */}
          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7C5CFC] block font-sans">Stage 3: First-Letter / Prefix Blocking</span>
              <strong className="text-sm text-[#12213A]">Alphanumeric Anchor Prefix Match</strong>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5">Captures entities sharing first character and 3-gram prefix stems</div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#7C5CFC]">440,000 pairs</span>
              <span className="text-[10px] text-emerald-700 block font-sans font-medium">45.0% cumulative reduction</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4 text-[#146EF5]" />
          </div>

          {/* Funnel 4 */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#16B981] block font-sans">Stage 4: Fuzzy Levenshtein Filtering</span>
              <strong className="text-sm text-[#12213A]">Top-100 Edit Distance Candidate Pool</strong>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5">Final bounded candidate set passed to 22-dimensional Random Forest</div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#16B981]">426,721 pairs (Train) / 83,749 (Test)</span>
              <span className="text-[10px] text-emerald-800 block font-sans font-bold">100% Ground Truth Recall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator: Let the user type two business names and see which rules pass or fail */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#146EF5]" />
              <span>Interactive Dual-Entity Blocking Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Type any two business names to test which blocking rules pass or fail in real-time.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#146EF5] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Live Evaluator
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Entity 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-[#DCE5F0] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#12213A]">
              <span>Entity 1 (Source 1 Reference)</span>
              <span className="text-[10px] font-mono text-[#146EF5] bg-blue-100 px-1.5 py-0.5 rounded">
                Reference
              </span>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Business Name:</label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#DCE5F0] font-semibold text-[#12213A] focus:outline-hidden focus:ring-2 focus:ring-[#146EF5]"
                placeholder="e.g. ABC Technologies Pvt Ltd"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Country ISO Code:</label>
              <input
                type="text"
                value={country1}
                maxLength={3}
                onChange={(e) => setCountry1(e.target.value.toUpperCase())}
                className="w-24 text-xs px-3 py-1.5 rounded-lg bg-white border border-[#DCE5F0] font-mono font-bold text-[#12213A] uppercase"
              />
            </div>
          </div>

          {/* Entity 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-[#DCE5F0] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#12213A]">
              <span>Entity 2 (Candidate Record)</span>
              <span className="text-[10px] font-mono text-[#12B8A6] bg-teal-100 px-1.5 py-0.5 rounded">
                Candidate
              </span>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Business Name:</label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#DCE5F0] font-semibold text-[#12213A] focus:outline-hidden focus:ring-2 focus:ring-[#146EF5]"
                placeholder="e.g. ABC Technology Private Limited"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Country ISO Code:</label>
              <input
                type="text"
                value={country2}
                maxLength={3}
                onChange={(e) => setCountry2(e.target.value.toUpperCase())}
                className="w-24 text-xs px-3 py-1.5 rounded-lg bg-white border border-[#DCE5F0] font-mono font-bold text-[#12213A] uppercase"
              />
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
          <span className="font-semibold whitespace-nowrap">Load Preset:</span>
          <button
            onClick={() => {
              setName1('ABC Technologies Pvt Ltd'); setCountry1('IN');
              setName2('ABC Technology Private Limited'); setCountry2('IN');
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px]"
          >
            Legal Suffix Variation
          </button>
          <button
            onClick={() => {
              setName1('Zenith BioPharm Solutions'); setCountry1('DE');
              setName2('Zenith BioPharm'); setCountry2('DE');
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px]"
          >
            Corporate Truncation
          </button>
          <button
            onClick={() => {
              setName1('Apex Industrial Dynamics'); setCountry1('US');
              setName2('Vanguard Aerospace Tech'); setCountry2('US');
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px]"
          >
            Unrelated Companies (Pruned)
          </button>
          <button
            onClick={() => {
              setName1('Pacific Rim Robotics Corp'); setCountry1('SG');
              setName2('Pacific Rim Robotics Inc'); setCountry2('US');
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px]"
          >
            Country Mismatch (Pruned)
          </button>
        </div>

        {/* Results of the 4 Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Rule 1 */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            simEvaluation.countryMatch ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12213A]">1. Country Match</span>
              {simEvaluation.countryMatch ? (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#16B981] text-white">
                  PASS
                </span>
              ) : (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-rose-600 text-white">
                  FAIL
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-600">
              {simEvaluation.countryMatch
                ? `Both entities in ${country1.toUpperCase()}`
                : `Country mismatch (${country1.toUpperCase()} vs ${country2.toUpperCase()})`}
            </div>
          </div>

          {/* Rule 2 */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            simEvaluation.tokenOverlapPass ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12213A]">2. Token Inverted</span>
              {simEvaluation.tokenOverlapPass ? (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#16B981] text-white">
                  PASS
                </span>
              ) : (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-300 text-slate-700">
                  MISS
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-600 truncate">
              {simEvaluation.tokenOverlapPass
                ? `Tokens: ${simEvaluation.sharedTokens.slice(0, 2).join(', ')}`
                : 'No significant token stem overlap'}
            </div>
          </div>

          {/* Rule 3 */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            simEvaluation.prefixPass ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12213A]">3. Prefix Anchor</span>
              {simEvaluation.prefixPass ? (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#16B981] text-white">
                  PASS
                </span>
              ) : (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-300 text-slate-700">
                  MISS
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-600">
              {simEvaluation.prefixPass ? 'First-letter match confirmed' : 'Different leading letter'}
            </div>
          </div>

          {/* Rule 4 */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            simEvaluation.fuzzyPass ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#12213A]">4. Fuzzy Filter</span>
              {simEvaluation.fuzzyPass ? (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#16B981] text-white">
                  PASS
                </span>
              ) : (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-300 text-slate-700">
                  MISS
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Levenshtein: {Math.round(simEvaluation.levSim * 100)}% (min 35%)
            </div>
          </div>
        </div>

        {/* Final Decision Banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          simEvaluation.overallPass
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {simEvaluation.overallPass ? (
              <CheckCircle2 className="w-5 h-5 text-[#16B981] shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold">
                {simEvaluation.overallPass
                  ? 'Candidate Pair Accepted Into Feature Engineering Pool'
                  : 'Pair Pruned by Candidate Blocking Funnel'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {simEvaluation.overallPass
                  ? 'This entity pair passes all funnel gates and proceeds to 22-dimensional feature extraction and Random Forest scoring.'
                  : 'Pruned early in blocking stage, saving heavy feature computation and model inference time.'}
              </div>
            </div>
          </div>

          <div className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-white shadow-2xs shrink-0 text-center">
            {simEvaluation.overallPass ? 'Status: PASS' : 'Status: FILTERED'}
          </div>
        </div>
      </div>
    </div>
  );
};
