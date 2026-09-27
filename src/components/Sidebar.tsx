import React, { useState } from 'react';
import {
  LayoutDashboard,
  GitCompare,
  Share2,
  Layers,
  Sparkles,
  Cpu,
  Sliders,
  PieChart,
  AlertTriangle,
  UserCheck,
  Bot,
  SlidersHorizontal,
  FileCheck2,
  Database,
  X
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'explorer'
  | 'graph'
  | 'blocking'
  | 'features'
  | 'model_lab'
  | 'f05_opt'
  | 'dataset'
  | 'errors'
  | 'human_review'
  | 'copilot'
  | 'simulator'
  | 'submission';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: TabId;
  index: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}[] = [
  { id: 'overview', index: '01', label: 'Overview', icon: LayoutDashboard, description: 'Executive KPIs & ML pipeline' },
  { id: 'explorer', index: '02', label: 'Entity Match Explorer', icon: GitCompare, description: 'Side-by-side match inspector', badge: '200 S1' },
  { id: 'graph', index: '03', label: 'Entity Graph', icon: Share2, description: 'Interactive entity link network', badge: 'Network' },
  { id: 'blocking', index: '04', label: 'Candidate Blocking', icon: Layers, description: '4-stage funnel reduction' },
  { id: 'features', index: '05', label: 'Feature Engineering', icon: Sparkles, description: '22 similarity features & ranks' },
  { id: 'model_lab', index: '06', label: 'Model Lab', icon: Cpu, description: 'Random forest & trees analyzer' },
  { id: 'f05_opt', index: '07', label: 'F0.5 Optimization', icon: Sliders, description: 'Precision weighting & threshold' },
  { id: 'dataset', index: '08', label: 'Dataset Intelligence', icon: PieChart, description: 'Distributions & data quality' },
  { id: 'errors', index: '09', label: 'Error Analysis', icon: AlertTriangle, description: 'Edge cases & borderline audit' },
  { id: 'human_review', index: '10', label: 'Human Review', icon: UserCheck, description: 'Ambiguity & borderline queue', badge: 'Review' },
  { id: 'copilot', index: '11', label: 'AI Resolution Copilot', icon: Bot, description: 'Grounded reasoning assistant', badge: 'AI' },
  { id: 'simulator', index: '12', label: 'What-If Simulator', icon: SlidersHorizontal, description: 'Hyperparameter tuning sandbox' },
  { id: 'submission', index: '13', label: 'Submission Center', icon: FileCheck2, description: 'TSV export & rule compliance', badge: '12/12' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-[#FFFFFF] text-[#12213A] border-r border-[#DCE5F0] shadow-xs">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#DCE5F0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#146EF5] flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-wider">
            EA
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-[#12213A] flex items-center gap-1.5">
              ENTITY AI
            </div>
            <div className="text-[11px] text-slate-500 font-medium tracking-tight">
              Entity Intelligence Platform
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Challenge Status Brief */}
      <div className="px-5 py-3 border-b border-[#DCE5F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Amazon ML '26</span>
          <span className="font-mono text-[#16B981] font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
            F0.5 = 1.0000
          </span>
        </div>
        <div className="w-full bg-[#DCE5F0] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#16B981] h-full rounded-full w-full"></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
          <span>Candidates: 426.7K</span>
          <span className="text-[#12B8A6] font-semibold">100% Precision</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Platform Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                isActive
                  ? 'bg-blue-50 text-[#146EF5] font-semibold shadow-2xs border border-blue-200/60'
                  : 'text-slate-600 hover:text-[#12213A] hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-[#146EF5] font-bold' : 'text-slate-400'}`}>
                {item.index}
              </span>
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#146EF5]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate leading-snug">{item.label}</div>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-blue-100 text-[#146EF5]' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Source Repositories
        </div>

        <div className="px-3 py-2 bg-slate-50 rounded-xl border border-[#DCE5F0] space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Database className="w-3 h-3 text-[#146EF5]" /> Source 1 (Ref)
            </span>
            <span className="font-mono text-slate-700 font-semibold">200 Test</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Database className="w-3 h-3 text-[#12B8A6]" /> Source 2 (Noisy)
            </span>
            <span className="font-mono text-slate-700 font-semibold">400 Test</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Database className="w-3 h-3 text-[#7C5CFC]" /> Source 3 (Noisy)
            </span>
            <span className="font-mono text-slate-700 font-semibold">400 Test</span>
          </div>
        </div>
      </div>

      {/* Bottom Pipeline Status */}
      <div className="p-4 border-t border-[#DCE5F0] bg-white">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Pipeline Status
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16B981] inline-block animate-pulse shadow-xs"></span>
            <span className="text-xs font-bold text-[#12213A]">● Ready</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            RF-100 · 79 KB
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 z-40 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-50 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
