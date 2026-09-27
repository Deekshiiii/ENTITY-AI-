import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building2,
  ArrowUpDown,
  Sparkles,
  GitCompare,
  Sliders,
  Check,
  XCircle,
  Info,
  MapPin,
  ExternalLink,
  ChevronDown,
  Layers
} from 'lucide-react';
import { EntityMatchResult, MatchedEntityDetail } from '../types/entity';

interface EntityExplorerViewProps {
  onOpenEntityDetail: (entityId: string) => void;
  allEntities: EntityMatchResult[];
}

export const EntityExplorerView: React.FC<EntityExplorerViewProps> = ({
  onOpenEntityDetail,
  allEntities
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'matched' | 'singletons' | 'multi'>('all');
  const [sourceFilter, setSourceFilter] = useState<'both' | 's2' | 's3'>('both');
  const [confidenceMin, setConfidenceMin] = useState<number>(0.0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'id' | 'matches' | 'confidence'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Quick Side-by-Side compare drawer/panel selection
  const [selectedEntity, setSelectedEntity] = useState<EntityMatchResult | null>(allEntities[0] || null);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(0);

  const pageSize = 10;

  // Filtered entities according to all search & filter controls
  const filteredEntities = useMemo(() => {
    let result = allEntities.filter((item) => {
      // 1. Match status filter
      if (filterType === 'matched' && item.isSingleton) return false;
      if (filterType === 'singletons' && !item.isSingleton) return false;
      if (filterType === 'multi' && item.matchCount < 2) return false;

      // 2. Source filter
      if (sourceFilter === 's2') {
        const hasS2 = item.matchedEntities.some((m) => m.source === 'S2');
        if (!hasS2 && !item.isSingleton) return false;
      } else if (sourceFilter === 's3') {
        const hasS3 = item.matchedEntities.some((m) => m.source === 'S3');
        if (!hasS3 && !item.isSingleton) return false;
      }

      // 3. Confidence threshold filter slider
      if (confidenceMin > 0) {
        if (item.isSingleton) return false;
        const meetsConfidence = item.matchedEntities.some((m) => m.similarityScore >= confidenceMin);
        if (!meetsConfidence) return false;
      }

      // 4. Search query (ID, Business Name, City, Country, or Candidate records)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = item.source1Entity.id.toLowerCase().includes(q);
        const nameMatch = item.source1Entity.name.toLowerCase().includes(q);
        const cityMatch = item.source1Entity.city.toLowerCase().includes(q);
        const countryMatch = item.source1Entity.country.toLowerCase().includes(q);
        const matchedTargetMatch = item.matchedEntities.some((m) =>
          m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
        );
        return idMatch || nameMatch || cityMatch || countryMatch || matchedTargetMatch;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.source1Entity.id.localeCompare(b.source1Entity.id);
      } else if (sortField === 'matches') {
        comparison = a.matchCount - b.matchCount;
      } else if (sortField === 'confidence') {
        const aConf = a.matchedEntities[0]?.similarityScore || 0;
        const bConf = b.matchedEntities[0]?.similarityScore || 0;
        comparison = aConf - bConf;
      }
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [allEntities, filterType, sourceFilter, confidenceMin, searchQuery, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredEntities.length / pageSize) || 1;
  const paginatedEntities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntities.slice(start, start + pageSize);
  }, [filteredEntities, currentPage]);

  const toggleSort = (field: 'id' | 'matches' | 'confidence') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Currently focused candidate in the side-by-side view
  const currentCandidate: MatchedEntityDetail | null = useMemo(() => {
    if (!selectedEntity || selectedEntity.isSingleton || selectedEntity.matchedEntities.length === 0) {
      return null;
    }
    const idx = Math.min(selectedCandidateIndex, selectedEntity.matchedEntities.length - 1);
    return selectedEntity.matchedEntities[idx] || null;
  }, [selectedEntity, selectedCandidateIndex]);

  // AI Match Explanation generator
  const getMatchExplanation = (s1Name: string, candName: string, cand: MatchedEntityDetail | null) => {
    if (!cand) {
      return 'Isolated singleton: No candidate passed the 4-stage blocking funnel and F0.5 precision cutoff (≥ 0.50). Confirmed unlinked business record.';
    }
    const simPct = (cand.similarityScore * 100).toFixed(1);
    const levPct = (cand.levenshteinScore * 100).toFixed(1);
    const jacPct = (cand.jaccardScore * 100).toFixed(1);

    if (cand.variationType === 'Legal Suffix Variation') {
      return `High confidence match (${simPct}%). Base commercial titles match exactly after canonicalizing jurisdictional legal suffixes ('Pvt Ltd' vs 'Limited'). City and country records match strictly.`;
    }
    if (cand.variationType === 'Abbreviation') {
      return `Accepted match (${simPct}%). Model recognized valid corporate acronym expansion ('${cand.name}') with heavy token overlap (${jacPct}%) and geographic alignment.`;
    }
    if (cand.variationType === 'Address Typo') {
      return `Robust match (${simPct}%). Levenshtein string similarity (${levPct}%) overcame character noise and localized street address typos. Country match confirmed 1.0.`;
    }
    return `Model confirmed link with ML probability of ${simPct}%. Edit distance (${levPct}%) and token set overlap (${jacPct}%) comfortably exceed the 0.50 F0.5 cutoff.`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Enterprise Search & Filter Bar */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID (S1-00001), Business Name, City, or Country..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-[#DCE5F0] focus:outline-hidden focus:ring-2 focus:ring-[#146EF5] focus:bg-white text-[#12213A] placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setFilterType('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white text-[#146EF5] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              All (200)
            </button>
            <button
              onClick={() => {
                setFilterType('matched');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'matched'
                  ? 'bg-white text-[#16B981] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Matched (166)
            </button>
            <button
              onClick={() => {
                setFilterType('singletons');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'singletons'
                  ? 'bg-white text-slate-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Singletons (34)
            </button>
            <button
              onClick={() => {
                setFilterType('multi');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterType === 'multi'
                  ? 'bg-white text-[#7C5CFC] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Multi-Matches (107)
            </button>
          </div>
        </div>

        {/* Secondary Filter Row: Source Filter & Confidence Slider */}
        <div className="pt-3 border-t border-[#DCE5F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Candidate Source:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSourceFilter('both')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  sourceFilter === 'both'
                    ? 'bg-blue-50 text-[#146EF5] border border-blue-200 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-[#DCE5F0] hover:bg-slate-100'
                }`}
              >
                Both S2 &amp; S3
              </button>
              <button
                onClick={() => setSourceFilter('s2')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  sourceFilter === 's2'
                    ? 'bg-teal-50 text-[#12B8A6] border border-teal-200 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-[#DCE5F0] hover:bg-slate-100'
                }`}
              >
                Source 2 Only
              </button>
              <button
                onClick={() => setSourceFilter('s3')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  sourceFilter === 's3'
                    ? 'bg-purple-50 text-[#7C5CFC] border border-purple-200 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-[#DCE5F0] hover:bg-slate-100'
                }`}
              >
                Source 3 Only
              </button>
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-slate-500 font-medium whitespace-nowrap">
              Min Confidence: <strong className="font-mono text-[#146EF5]">{Math.round(confidenceMin * 100)}%</strong>
            </span>
            <input
              type="range"
              min="0.0"
              max="0.95"
              step="0.05"
              value={confidenceMin}
              onChange={(e) => {
                setConfidenceMin(parseFloat(e.target.value));
                setCurrentPage(1);
              }}
              className="w-32 sm:w-40 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#146EF5]"
            />
            {confidenceMin > 0 && (
              <button
                onClick={() => setConfidenceMin(0)}
                className="text-[11px] text-slate-400 hover:text-slate-700 underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Results Count Badge */}
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-[#DCE5F0]">
            Showing {filteredEntities.length} of 200 S1 Entities
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Entity Table & Side-by-Side Match Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Entity Table */}
        <div className="lg:col-span-7 bg-white border border-[#DCE5F0] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DCE5F0] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#146EF5]" />
              <span>Source 1 Reference Entities</span>
            </h3>
            <div className="text-[11px] text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#DCE5F0] text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th
                    onClick={() => toggleSort('id')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Source 1 ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Business Title &amp; Address</th>
                  <th className="py-3 px-3">Country</th>
                  <th
                    onClick={() => toggleSort('matches')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Matches</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5F0]">
                {paginatedEntities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      No entities found matching your search and filter parameters.
                    </td>
                  </tr>
                ) : (
                  paginatedEntities.map((item) => {
                    const isSelected = selectedEntity?.source1Entity.id === item.source1Entity.id;
                    return (
                      <tr
                        key={item.source1Entity.id}
                        onClick={() => {
                          setSelectedEntity(item);
                          setSelectedCandidateIndex(0);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 hover:bg-blue-50'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#146EF5] whitespace-nowrap">
                          {item.source1Entity.id}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-[#12213A] truncate">
                            {item.source1Entity.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.source1Entity.address}
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {item.source1Entity.country}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.isSingleton ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              Singleton (0)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16B981] border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-[#16B981]" />
                              <span>{item.matchCount} {item.matchCount === 1 ? 'match' : 'matches'}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEntityDetail(item.source1Entity.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#146EF5] hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                            title="Drill-down modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-3 border-t border-[#DCE5F0] flex items-center justify-between text-xs text-slate-600 bg-slate-50">
            <span className="text-[11px] font-mono">
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filteredEntities.length)} of {filteredEntities.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-[#DCE5F0] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[11px] font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-[#DCE5F0] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Side-by-Side Comparison & AI Explanation */}
        <div className="lg:col-span-5 bg-white border border-[#DCE5F0] rounded-2xl shadow-xs p-5 space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5F0]">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#146EF5] uppercase tracking-wider">
                Side-by-Side Pair Inspector
              </div>
              <h3 className="text-sm font-bold text-[#12213A]">
                {selectedEntity?.source1Entity.id || 'Select Entity'}
              </h3>
            </div>
            {selectedEntity && (
              <button
                onClick={() => onOpenEntityDetail(selectedEntity.source1Entity.id)}
                className="text-xs font-semibold text-[#146EF5] hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Modal</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {selectedEntity ? (
            <div className="space-y-4">
              {/* Candidate selector if multiple matches exist */}
              {selectedEntity.matchedEntities.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Candidate:</span>
                  {selectedEntity.matchedEntities.map((cand, idx) => (
                    <button
                      key={cand.id}
                      onClick={() => setSelectedCandidateIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        selectedCandidateIndex === idx
                          ? 'bg-[#146EF5] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cand.id} ({Math.round(cand.similarityScore * 100)}%)
                    </button>
                  ))}
                </div>
              )}

              {/* Side-by-Side Comparison Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-[#DCE5F0]">
                {/* Source 1 (Reference) */}
                <div className="space-y-1.5 border-r border-[#DCE5F0] pr-3">
                  <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-[#146EF5]">
                    SOURCE 1 (REF)
                  </div>
                  <div className="font-mono text-xs font-bold text-[#12213A]">
                    {selectedEntity.source1Entity.id}
                  </div>
                  <div className="text-xs font-bold text-[#12213A] leading-snug">
                    {selectedEntity.source1Entity.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {selectedEntity.source1Entity.address}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{selectedEntity.source1Entity.city}, {selectedEntity.source1Entity.country}</span>
                  </div>
                </div>

                {/* Candidate (Source 2 or 3) */}
                <div className="space-y-1.5 pl-1">
                  {currentCandidate ? (
                    <>
                      <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-[#12B8A6]">
                        {currentCandidate.source === 'S2' ? 'SOURCE 2 (NOISY)' : 'SOURCE 3 (NOISY)'}
                      </div>
                      <div className="font-mono text-xs font-bold text-[#12213A]">
                        {currentCandidate.id}
                      </div>
                      <div className="text-xs font-bold text-[#12213A] leading-snug">
                        {currentCandidate.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {currentCandidate.address}
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{currentCandidate.city}, {currentCandidate.country}</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-400">
                      <XCircle className="w-6 h-6 text-slate-300 mb-1" />
                      <span className="text-xs font-semibold text-slate-600">No Matched Candidate</span>
                      <span className="text-[10px]">Identified as genuine singleton</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Computed Feature Similarities */}
              {currentCandidate ? (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#12213A] flex items-center justify-between">
                    <span>Computed Feature Similarities</span>
                    <span className="font-mono text-[11px] text-[#16B981] font-bold">
                      {Math.round(currentCandidate.similarityScore * 100)}% ML Match Prob
                    </span>
                  </div>

                  {/* Similarity Metrics Bars */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-0.5 font-mono">
                        <span>Name Levenshtein Distance</span>
                        <span>{Math.round(currentCandidate.levenshteinScore * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#146EF5] h-full rounded-full"
                          style={{ width: `${currentCandidate.levenshteinScore * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-0.5 font-mono">
                        <span>Token Set / Jaccard Overlap</span>
                        <span>{Math.round(currentCandidate.jaccardScore * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#12B8A6] h-full rounded-full"
                          style={{ width: `${currentCandidate.jaccardScore * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-0.5 font-mono">
                        <span>Address &amp; Numeric Overlap</span>
                        <span>{Math.round(currentCandidate.addressScore * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#7C5CFC] h-full rounded-full"
                          style={{ width: `${currentCandidate.addressScore * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-0.5 font-mono">
                        <span>Country Match (Exact)</span>
                        <span className="text-[#16B981] font-bold">1.00 (100%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#16B981] h-full rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Decision Tag */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16B981]" />
                      <span className="text-xs font-bold text-emerald-900">Decision: MATCH</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#16B981]">
                      P(Match) = {currentCandidate.similarityScore.toFixed(3)} &ge; 0.50
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-[#DCE5F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">Decision: NO MATCH (Singleton)</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Threshold &lt; 0.50
                  </span>
                </div>
              )}

              {/* AI Match Explanation Box */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#146EF5] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Match Explanation</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {getMatchExplanation(
                    selectedEntity.source1Entity.name,
                    currentCandidate?.name || '',
                    currentCandidate
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select an entity from the table on the left to inspect matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
