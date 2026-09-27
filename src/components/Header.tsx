import React, { useState } from 'react';
import {
  Menu,
  Play,
  Download,
  Bell,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Settings,
  Search,
  Building2,
  Sliders,
  AlertTriangle,
  X
} from 'lucide-react';
import { TabId } from './Sidebar';

interface HeaderProps {
  currentTab: TabId;
  onOpenMobileMenu: () => void;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
  onExportTSV: () => void;
  onSelectTab: (tab: TabId) => void;
  onGlobalSelectEntity?: (entityId: string) => void;
  pipelineProgress?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onRunPipeline,
  isRunningPipeline,
  onExportTSV,
  onSelectTab,
  onGlobalSelectEntity,
  pipelineProgress = 100
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');

  const getBreadcrumb = (tab: TabId) => {
    switch (tab) {
      case 'overview':
        return '01 Overview';
      case 'explorer':
        return '02 Entity Match Explorer';
      case 'graph':
        return '03 Entity Graph';
      case 'blocking':
        return '04 Candidate Blocking';
      case 'features':
        return '05 Feature Engineering';
      case 'model_lab':
        return '06 Model Lab';
      case 'f05_opt':
        return '07 F0.5 Optimization';
      case 'dataset':
        return '08 Dataset Intelligence';
      case 'errors':
        return '09 Error Analysis';
      case 'human_review':
        return '10 Human Review';
      case 'copilot':
        return '11 AI Resolution Copilot';
      case 'simulator':
        return '12 What-If Simulator';
      case 'submission':
        return '13 Submission Center';
      default:
        return '01 Overview';
    }
  };

  // Mock index for Global Search categories
  const searchResults = React.useMemo(() => {
    if (!globalQuery.trim()) return null;
    const q = globalQuery.toLowerCase().trim();

    const entities = [
      { id: 'S1-00001', name: 'Apex Industrial Dynamics', type: 'Entity (Singleton)' },
      { id: 'S1-00002', name: 'ABC Technologies Pvt Ltd', type: 'Entity (Matched 3)' },
      { id: 'S1-00003', name: 'Zenith BioPharm Solutions', type: 'Entity (Matched 2)' },
      { id: 'S2-00084', name: 'Zenith BioPharm Germany', type: 'Candidate Record' },
      { id: 'S3-00019', name: 'ABC Tech Private Limited', type: 'Candidate Record' }
    ].filter(e => e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q));

    const modules = [
      { id: 'overview' as TabId, name: 'Executive Overview', desc: '01 Overview' },
      { id: 'explorer' as TabId, name: 'Entity Match Explorer', desc: '02 Match Explorer' },
      { id: 'graph' as TabId, name: 'Entity Graph & Cluster Network', desc: '03 Graph' },
      { id: 'blocking' as TabId, name: '4-Stage Candidate Blocking', desc: '04 Blocking' },
      { id: 'features' as TabId, name: '22 Similarity Features', desc: '05 Features' },
      { id: 'model_lab' as TabId, name: 'Random Forest Model Lab', desc: '06 Model' },
      { id: 'f05_opt' as TabId, name: 'F0.5 Threshold Optimization', desc: '07 F0.5' },
      { id: 'human_review' as TabId, name: 'Human Review Center', desc: '10 Review' },
      { id: 'copilot' as TabId, name: 'AI Resolution Copilot', desc: '11 Copilot' },
      { id: 'simulator' as TabId, name: 'What-If Hyperparameter Simulator', desc: '12 Simulator' },
      { id: 'submission' as TabId, name: 'Submission Center & TSV Exporter', desc: '13 Submission' }
    ].filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));

    return { entities, modules };
  }, [globalQuery]);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DCE5F0] shadow-2xs transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Zone: Mobile Hamburger & Logo / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden focus:outline-hidden"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#12213A] tracking-tight text-base sm:text-lg">
                ENTITY AI
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-600">
                Business Entity Resolution Engine
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="relative hidden md:flex items-center flex-1 max-w-sm mx-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalQuery}
            onChange={(e) => {
              setGlobalQuery(e.target.value);
              setGlobalSearchOpen(true);
            }}
            onFocus={() => setGlobalSearchOpen(true)}
            placeholder="Global search (Entity ID, Module, Cluster)..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-50 border border-[#DCE5F0] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#146EF5] focus:bg-white text-[#12213A] transition-all"
          />
          {globalQuery && (
            <button
              onClick={() => {
                setGlobalQuery('');
                setGlobalSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Categorized Global Search Results Dropdown */}
          {globalSearchOpen && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DCE5F0] rounded-2xl shadow-xl py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
                Categorized Results
              </div>

              {/* Modules Category */}
              {searchResults.modules.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] font-bold text-[#146EF5] px-2 py-0.5">Platform Modules</div>
                  {searchResults.modules.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        onSelectTab(mod.id);
                        setGlobalSearchOpen(false);
                        setGlobalQuery('');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group"
                    >
                      <span className="font-semibold text-[#12213A] group-hover:text-[#146EF5]">{mod.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{mod.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Entities Category */}
              {searchResults.entities.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-[#12B8A6] px-2 py-0.5">Commercial Entities</div>
                  {searchResults.entities.map(ent => (
                    <button
                      key={ent.id}
                      onClick={() => {
                        if (ent.id.startsWith('S1') && onGlobalSelectEntity) {
                          onGlobalSelectEntity(ent.id);
                        } else {
                          onSelectTab('explorer');
                        }
                        setGlobalSearchOpen(false);
                        setGlobalQuery('');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-mono font-bold text-[#146EF5] text-[11px]">{ent.id}</div>
                        <div className="text-[11px] text-[#12213A] truncate">{ent.name}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{ent.type}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.modules.length === 0 && searchResults.entities.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-400">
                  No matching records or modules found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Zone: Pipeline Status, Primary Buttons, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Active View Chip */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-[#DCE5F0] text-xs text-slate-600 font-medium">
            <span className="text-[#146EF5] font-bold">View:</span>
            <span className="font-semibold text-[#12213A]">{getBreadcrumb(currentTab)}</span>
          </div>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-[#16B981] animate-pulse"></span>
            <span className="font-semibold">{isRunningPipeline ? `Running (${pipelineProgress}%)` : 'Ready'}</span>
          </div>

          {/* Run Pipeline Action */}
          <button
            onClick={onRunPipeline}
            disabled={isRunningPipeline}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              isRunningPipeline
                ? 'bg-blue-100 text-[#146EF5] border border-blue-200 cursor-wait'
                : 'bg-[#146EF5] hover:bg-blue-700 text-white active:scale-95'
            }`}
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>

          {/* Export TSV */}
          <button
            onClick={onExportTSV}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#12213A] bg-white hover:bg-slate-50 border border-[#DCE5F0] hover:border-slate-300 transition-colors shadow-2xs"
            title="Download matching_results.tsv"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export TSV</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:inline-flex"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notification Alert Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
              aria-label="Alert Center"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#16B981] ring-2 ring-white"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#DCE5F0] rounded-2xl shadow-xl py-3 px-4 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-[#12213A]">
                  <span>System Alert Center</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                    4 Active Signals
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16B981] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-900">Pipeline Completed</div>
                      <div className="text-[11px] text-emerald-700">Scored 83,749 candidate pairs across 200 reference entities.</div>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#146EF5] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-blue-900">Validation Passed</div>
                      <div className="text-[11px] text-blue-700">100% F0.5 reached with 0 false mergers.</div>
                    </div>
                  </div>
                  <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900">Human Review Ready</div>
                      <div className="text-[11px] text-amber-700">24 borderline candidate pairs flagged for review.</div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Clean TSV Deliverable</div>
                      <div className="text-[11px] text-slate-600">359 matches &amp; 34 singletons verified in output.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-[#DCE5F0] hidden sm:block"></div>

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="User Profile"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#DCE5F0] bg-blue-100 shrink-0">
                <img
                  src="/src/assets/images/avatar_engineer_1790519053273.jpg"
                  alt="Profile Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div
                  className="w-full h-full hidden items-center justify-center bg-[#146EF5] text-white font-bold text-xs"
                  aria-hidden="true"
                >
                  EA
                </div>
              </div>

              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-[#12213A] leading-tight">Lead ML Engineer</div>
                <div className="text-[10px] text-slate-500 font-medium">Entity Intelligence Core</div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Card */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#DCE5F0] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-blue-500/20">
                    <img
                      src="/src/assets/images/avatar_engineer_1790519053273.jpg"
                      alt="Profile Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#12213A] truncate">Lead ML Engineer</div>
                    <div className="text-xs text-slate-500 truncate">Core Analytics Team</div>
                  </div>
                </div>

                <div className="py-2.5 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">System:</span>
                    <span className="font-semibold text-[#12213A]">ENTITY AI Enterprise</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Environment:</span>
                    <span className="font-medium text-slate-700">Production Inference</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validation Metric:</span>
                    <span className="font-mono text-[#16B981] font-bold bg-emerald-50 px-1.5 rounded border border-emerald-200">
                      F0.5 = 1.0000
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Model: RF-100 (79 KB)</span>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onExportTSV();
                    }}
                    className="text-xs text-[#146EF5] hover:text-blue-700 flex items-center gap-1 font-semibold"
                  >
                    Submission TSV <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Settings Popover */}
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#DCE5F0] rounded-2xl shadow-xl p-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-[#12213A]">
                  <span>Engine Configuration</span>
                  <span className="text-[10px] text-[#146EF5] font-mono">Real-Time</span>
                </div>
                <div className="py-2.5 space-y-2 text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Precision Cutoff (F0.5):</span>
                    <span className="font-mono font-bold text-[#12213A] bg-slate-100 px-1.5 py-0.5 rounded">
                      0.50
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Blocking Funnel:</span>
                    <span className="text-[#16B981] font-medium">4 Stages Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CPU Inference Mode:</span>
                    <span className="font-mono text-slate-700">&lt;50ms latency</span>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-center"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
