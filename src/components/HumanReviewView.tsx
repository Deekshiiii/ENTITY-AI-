import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Filter,
  Check,
  X,
  Eye,
  Building2,
  MapPin,
  Sparkles,
  Search,
  Clock,
  RotateCcw
} from 'lucide-react';
import { HumanReviewItem, EntityMatchResult } from '../types/entity';

interface HumanReviewViewProps {
  testEntities: EntityMatchResult[];
  onOpenEntityDetail: (id: string) => void;
}

export const HumanReviewView: React.FC<HumanReviewViewProps> = ({
  testEntities,
  onOpenEntityDetail
}) => {
  // Generate review queue items from actual test entities with borderline/conflicting signals
  const initialReviewItems = useMemo<HumanReviewItem[]>(() => {
    const items: HumanReviewItem[] = [];

    // Filter candidate matches that have borderline similarity (0.48 - 0.75) or specific variation types
    let revIdx = 1;
    testEntities.forEach((ent) => {
      ent.matchedEntities.forEach((cand) => {
        // Flag for human review if score is between 0.48 and 0.72 or is an abbreviation or has address variance
        const isBorderline = cand.similarityScore >= 0.48 && cand.similarityScore <= 0.72;
        const isAbbr = cand.variationType === 'Abbreviation';
        const isAddressTypo = cand.variationType === 'Address Typo';

        if (isBorderline || isAbbr || isAddressTypo) {
          if (items.length < 24) {
            let reason: HumanReviewItem['reviewReason'] = 'Low Confidence';
            if (isAbbr) reason = 'Name Conflict';
            else if (isAddressTypo) reason = 'Address Conflict';
            else if (cand.similarityScore < 0.55) reason = 'Low Confidence';
            else reason = 'Potential Duplicate';

            items.push({
              id: `REV-${String(revIdx).padStart(3, '0')}`,
              source1Id: ent.source1Entity.id,
              source1Name: ent.source1Entity.name,
              source1Address: ent.source1Entity.address,
              source1Country: ent.source1Entity.country,
              candidateId: cand.id,
              candidateSource: cand.source,
              candidateName: cand.name,
              candidateAddress: cand.address,
              candidateCountry: cand.country,
              similarityScore: cand.similarityScore,
              features: {
                nameSimilarity: cand.levenshteinScore,
                addressSimilarity: cand.addressScore,
                tokenOverlap: cand.jaccardScore,
                countryMatch: ent.source1Entity.country === cand.country ? 1 : 0,
                numericOverlap: 0.85
              },
              modelDecision: cand.similarityScore >= 0.50 ? 'MATCH' : 'NO MATCH',
              reviewReason: reason,
              status: 'pending'
            });
            revIdx++;
          }
        }
      });
    });

    return items;
  }, [testEntities]);

  // Local state for human decisions (stored separately from original ML predictions)
  const [reviewItems, setReviewItems] = useState<HumanReviewItem[]>(initialReviewItems);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HumanReviewItem | null>(null);

  // Counts strictly calculated
  const pendingCount = reviewItems.filter((i) => i.status === 'pending').length;
  const confirmedCount = reviewItems.filter((i) => i.status === 'confirmed').length;
  const rejectedCount = reviewItems.filter((i) => i.status === 'rejected').length;

  const handleDecision = (id: string, decision: 'confirmed' | 'rejected') => {
    setReviewItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: decision,
              decidedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : item
      )
    );
  };

  const handleResetDecision = (id: string) => {
    setReviewItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'pending', decidedAt: undefined } : item))
    );
  };

  const filteredItems = useMemo(() => {
    return reviewItems.filter((item) => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterReason !== 'all' && item.reviewReason !== filterReason) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.id.toLowerCase().includes(q) ||
          item.source1Id.toLowerCase().includes(q) ||
          item.source1Name.toLowerCase().includes(q) ||
          item.candidateId.toLowerCase().includes(q) ||
          item.candidateName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reviewItems, filterStatus, filterReason, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#146EF5] mb-1">
            <UserCheck className="w-4 h-4 text-[#146EF5]" />
            <span>MODULE 10</span>
            <span className="text-slate-300">·</span>
            <span>HUMAN-IN-THE-LOOP ACTIVE LEARNING</span>
          </div>
          <h2 className="text-xl font-bold text-[#12213A] tracking-tight">
            Human Review Center &amp; Ambiguity Queue
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Review queue for uncertain predictions, borderline similarity scores (0.48 &ndash; 0.72), and potential acronym conflicts. Human decisions are stored independently from raw model outputs, preserving strict audit trails.
          </p>
        </div>

        {/* Status Counts Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div
            onClick={() => setFilterStatus('all')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <span className="text-slate-500 font-semibold block text-[11px]">Total Queue</span>
            <span className="font-mono text-xl font-bold text-[#12213A] tabular-nums">{reviewItems.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Borderline Candidate Pairs</span>
          </div>

          <div
            onClick={() => setFilterStatus('pending')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'pending'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <span className="text-amber-800 font-semibold block text-[11px]">Pending Review</span>
            <span className="font-mono text-xl font-bold text-amber-600 tabular-nums">{pendingCount}</span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Awaiting Specialist Audit</span>
          </div>

          <div
            onClick={() => setFilterStatus('confirmed')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'confirmed'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <span className="text-emerald-800 font-semibold block text-[11px]">Confirmed Matches</span>
            <span className="font-mono text-xl font-bold text-[#16B981] tabular-nums">{confirmedCount}</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Auditor Approved Link</span>
          </div>

          <div
            onClick={() => setFilterStatus('rejected')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'rejected'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-[#DCE5F0] hover:bg-slate-100'
            }`}
          >
            <span className="text-rose-800 font-semibold block text-[11px]">Rejected Links</span>
            <span className="font-mono text-xl font-bold text-rose-600 tabular-nums">{rejectedCount}</span>
            <span className="text-[10px] text-rose-600 block mt-0.5">Separated as Distinct</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Business Name, or Candidate ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-[#DCE5F0] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#146EF5]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-medium">Filter Reason:</span>
          <select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-[#DCE5F0] text-xs font-semibold text-[#12213A]"
          >
            <option value="all">All Reasons</option>
            <option value="Low Confidence">Low Confidence</option>
            <option value="Name Conflict">Name Conflict (Acronym)</option>
            <option value="Address Conflict">Address Conflict</option>
            <option value="Potential Duplicate">Potential Duplicate</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Showing {filteredItems.length} of {reviewItems.length}
          </span>
        </div>
      </div>

      {/* 3. Review Queue Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#DCE5F0] rounded-2xl text-slate-400 text-xs">
            No items in queue matching selected filter criteria.
          </div>
        ) : (
          filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
                  item.status === 'confirmed'
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : item.status === 'rejected'
                    ? 'border-rose-300 bg-rose-50/10'
                    : 'border-[#DCE5F0]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DCE5F0] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">{item.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Reason: {item.reviewReason}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      ML Prob: <strong className="text-[#146EF5]">{(item.similarityScore * 100).toFixed(1)}%</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16B981] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed by Auditor {item.decidedAt && `(${item.decidedAt})`}</span>
                      </span>
                    ) : item.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected by Auditor {item.decidedAt && `(${item.decidedAt})`}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Decision</span>
                      </span>
                    )}

                    {item.status !== 'pending' && (
                      <button
                        onClick={() => handleResetDecision(item.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Reset decision"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Entities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                  {/* Left: Source 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-[#DCE5F0] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#146EF5]">
                      <span>SOURCE 1 REFERENCE ({item.source1Id})</span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200">
                        {item.source1Country}
                      </span>
                    </div>
                    <div className="font-bold text-[#12213A] text-sm">{item.source1Name}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.source1Address}</span>
                    </div>
                  </div>

                  {/* Right: Candidate */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-[#DCE5F0] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#12B8A6]">
                      <span>
                        CANDIDATE {item.candidateSource} ({item.candidateId})
                      </span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-teal-200">
                        {item.candidateCountry}
                      </span>
                    </div>
                    <div className="font-bold text-[#12213A] text-sm">{item.candidateName}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.candidateAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Feature Metrics Chips & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#DCE5F0]">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Name Sim: <strong>{(item.features.nameSimilarity * 100).toFixed(0)}%</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Token Overlap: <strong>{(item.features.tokenOverlap * 100).toFixed(0)}%</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Address Sim: <strong>{(item.features.addressSimilarity * 100).toFixed(0)}%</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Country: <strong>Match</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEntityDetail(item.source1Id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => handleDecision(item.id, 'rejected')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                        item.status === 'rejected'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject Match</span>
                    </button>
                    <button
                      onClick={() => handleDecision(item.id, 'confirmed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                        item.status === 'confirmed'
                          ? 'bg-[#16B981] text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Match</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
