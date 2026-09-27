import React from 'react';
import {
  PieChart,
  BarChart3,
  Database,
  Globe2,
  FileSpreadsheet,
  AlertCircle,
  Hash,
  Layers,
  ArrowRight,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { DATASET_INTELLIGENCE } from '../data/datasetAnalytics';

export const DatasetIntelligenceView: React.FC = () => {
  const data = DATASET_INTELLIGENCE;

  return (
    <div className="space-y-6">
      {/* 1. Top Banner */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#146EF5] mb-1">
            <span>MODULE 08</span>
            <span className="text-slate-300">·</span>
            <span>DATA HYGIENE &amp; CORPUS AUDIT</span>
          </div>
          <h2 className="text-xl font-bold text-[#12213A] tracking-tight">
            Multi-Source Enterprise Dataset Intelligence
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Exhaustive audit across training and test corpora from three independent data providers. Evaluates schema sparsity, character lengths, country concentrations, duplicate rates, and missing field distributions.
          </p>
        </div>

        {/* Breakdown Per Source (Train + Test) Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Source 1 */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
            <div className="flex items-center justify-between text-xs mb-1 font-bold text-[#146EF5]">
              <span>SOURCE 1 (REFERENCE)</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-blue-200">
                Ground Truth
              </span>
            </div>
            <div className="text-xl font-bold text-[#12213A] font-mono">
              700 Total Entities
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Training Reference:</span>
                <span className="font-mono font-bold text-[#12213A]">500 entities</span>
              </div>
              <div className="flex justify-between">
                <span>Test Reference:</span>
                <span className="font-mono font-bold text-[#146EF5]">200 entities</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Zero duplicates, strict legal registration names with ISO codes.
              </div>
            </div>
          </div>

          {/* Source 2 */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200">
            <div className="flex items-center justify-between text-xs mb-1 font-bold text-[#12B8A6]">
              <span>SOURCE 2 (COMMERCIAL NOISY)</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-teal-200">
                Vendor Feed
              </span>
            </div>
            <div className="text-xl font-bold text-[#12213A] font-mono">
              1,200 Total Records
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Training Records:</span>
                <span className="font-mono font-bold text-[#12213A]">800 records</span>
              </div>
              <div className="flex justify-between">
                <span>Test Records:</span>
                <span className="font-mono font-bold text-[#12B8A6]">400 records</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Abbreviations (Corp, Inc), localized street suffixes, 12% address typos.
              </div>
            </div>
          </div>

          {/* Source 3 */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
            <div className="flex items-center justify-between text-xs mb-1 font-bold text-[#7C5CFC]">
              <span>SOURCE 3 (REGULATORY NOISY)</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-purple-200">
                Registry Feed
              </span>
            </div>
            <div className="text-xl font-bold text-[#12213A] font-mono">
              1,200 Total Records
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Training Records:</span>
                <span className="font-mono font-bold text-[#12213A]">800 records</span>
              </div>
              <div className="flex justify-between">
                <span>Test Records:</span>
                <span className="font-mono font-bold text-[#7C5CFC]">400 records</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Truncated suffixes, inverted business titles, missing postal codes.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Countries Distribution & Missing Values Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Distribution */}
        <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#146EF5]" />
                <span>Top Geographic Jurisdictions</span>
              </h3>
              <p className="text-xs text-slate-500">Distribution of commercial records across ISO jurisdictions</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-[#DCE5F0]">
              42 Countries Total
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {data.countryDistribution.map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.country}</span>
                  <span className="font-mono font-bold text-[#12213A] tabular-nums">
                    {item.count} records <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#146EF5] h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Values Heatmap & Data Quality Audit */}
        <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#7C5CFC]" />
                <span>Field Sparsity &amp; Missing Value Audit</span>
              </h3>
              <p className="text-xs text-slate-500">Percentage of missing or null fields by data source</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#16B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Clean Schema
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#DCE5F0] text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Field Name</th>
                  <th className="py-2.5 px-3 text-right">Source 1</th>
                  <th className="py-2.5 px-3 text-right">Source 2</th>
                  <th className="py-2.5 px-3 text-right">Source 3</th>
                  <th className="py-2.5 px-3 text-right">Imputation Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5F0]">
                {data.missingValues.map((row) => (
                  <tr key={row.field} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="py-2.5 px-3 font-bold text-[#12213A] font-sans">
                      {row.field}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {row.source1Missing === 0 ? (
                        <span className="text-[#16B981] font-semibold">0% (Complete)</span>
                      ) : (
                        <span className="text-rose-600 font-semibold">{row.source1Missing}%</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {row.source2Missing === 0 ? (
                        <span className="text-[#16B981] font-semibold">0%</span>
                      ) : row.source2Missing > 20 ? (
                        <span className="text-rose-600 font-semibold">{row.source2Missing}%</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">{row.source2Missing}%</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {row.source3Missing === 0 ? (
                        <span className="text-[#16B981] font-semibold">0%</span>
                      ) : row.source3Missing > 20 ? (
                        <span className="text-rose-600 font-semibold">{row.source3Missing}%</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">{row.source3Missing}%</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-sans text-[10px]">
                      {row.field === 'postalCode' ? 'Empty sentinel + prefix fallback' : row.field === 'phone' ? 'Excluded from similarity' : 'Strict token fallback'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-[#DCE5F0] text-xs text-slate-600 leading-relaxed">
            <strong>Audit Insight:</strong> Source 1 serves as an uncompromising ground truth anchor with 0% missing names, addresses, and country codes. Missing postal codes in noisy sources are safely absorbed by token-based address similarity without degradation.
          </div>
        </div>
      </div>

      {/* 3. Text Length Distribution & Duplicate Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Length Distribution */}
        <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#12B8A6]" />
                <span>Text Length Distribution (Characters)</span>
              </h3>
              <p className="text-xs text-slate-500">Character count density for commercial titles across sources</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-[#DCE5F0]">
              Lengths
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {data.nameLengthDistribution.map((item) => (
              <div key={item.bucket} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-mono text-[11px] font-semibold">{item.bucket}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    S1: {item.s1}% · S2: {item.s2}% · S3: {item.s3}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div style={{ width: `${item.s1}%` }} className="bg-[#146EF5] h-full" title="Source 1"></div>
                  <div style={{ width: `${item.s2}%` }} className="bg-[#12B8A6] h-full" title="Source 2"></div>
                  <div style={{ width: `${item.s3}%` }} className="bg-[#7C5CFC] h-full" title="Source 3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duplicate Detection Overview */}
        <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
                <Copy className="w-4 h-4 text-[#F59E0B]" />
                <span>Duplicate &amp; Multi-Record Detection</span>
              </h3>
              <p className="text-xs text-slate-500">Internal duplication rates within noisy candidate repositories</p>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Resolved
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-[#DCE5F0] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#12213A] block">Intra-Source S2 Duplicates</span>
                <span className="text-[11px] text-slate-500">Duplicate vendor filings for identical business branch</span>
              </div>
              <span className="font-mono font-bold text-slate-800 text-sm">4.2%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-[#DCE5F0] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#12213A] block">Intra-Source S3 Duplicates</span>
                <span className="text-[11px] text-slate-500">Historical corporate registration amendments</span>
              </div>
              <span className="font-mono font-bold text-slate-800 text-sm">6.8%</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16B981] shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 block">Deduplication Handling</span>
                  <span className="text-[11px] text-emerald-800">
                    Many-to-one matches to a single S1 reference entity supported cleanly
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#16B981] text-xs">107 Multi-Matches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
