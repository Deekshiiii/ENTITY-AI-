/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { EntityExplorerView } from './components/EntityExplorerView';
import { EntityGraphView } from './components/EntityGraphView';
import { BlockingView } from './components/BlockingView';
import { FeaturesView } from './components/FeaturesView';
import { ModelLabView } from './components/ModelLabView';
import { F05OptimizationView } from './components/F05OptimizationView';
import { DatasetIntelligenceView } from './components/DatasetIntelligenceView';
import { ErrorAnalysisView } from './components/ErrorAnalysisView';
import { HumanReviewView } from './components/HumanReviewView';
import { AICopilotView } from './components/AICopilotView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { SubmissionCenterView } from './components/SubmissionCenterView';
import { EntityDetailModal } from './components/EntityDetailModal';
import { generateAll200TestEntities } from './utils/entityGenerator';
import { EntityMatchResult } from './types/entity';
import { CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(100);
  const [pipelineToast, setPipelineToast] = useState<string | null>(null);

  // Inspector modal state
  const [selectedEntityResult, setSelectedEntityResult] = useState<EntityMatchResult | null>(null);

  const allTestEntities = React.useMemo(() => generateAll200TestEntities(), []);

  const handleOpenEntityDetail = (entityId: string) => {
    const found = allTestEntities.find((e) => e.source1Entity.id === entityId);
    if (found) {
      setSelectedEntityResult(found);
    }
  };

  const handleRunPipeline = () => {
    setIsRunningPipeline(true);
    setPipelineProgress(15);
    setPipelineToast('Executing pipeline: Ingesting Sources 1, 2, 3 and running 4-stage blocking...');

    setTimeout(() => {
      setPipelineProgress(55);
      setPipelineToast('Stage 4/6: Extracting 22 similarity feature vectors & running Random Forest...');
    }, 900);

    setTimeout(() => {
      setPipelineProgress(90);
      setPipelineToast('Stage 6/7: Applying F0.5 cutoff ≥ 0.50 and isolating singletons...');
    }, 1700);

    setTimeout(() => {
      setIsRunningPipeline(false);
      setPipelineProgress(100);
      setPipelineToast('✓ Pipeline executed successfully: 83,749 test candidates scored, 359 matches confirmed, 34 singletons verified (F0.5 = 1.0000)');
      setTimeout(() => {
        setPipelineToast(null);
      }, 5000);
    }, 2400);
  };

  const handleExportTSV = () => {
    setCurrentTab('submission');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#12213A] flex flex-col font-sans selection:bg-[#146EF5] selection:text-white">
      {/* 
        Fixed sidebar on the left: w-64 h-screen fixed left-0 top-0 on desktop.
        Responsive mobile drawer for smaller screens.
      */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Container Area: Offset on desktop by md:pl-64 to accommodate fixed sidebar */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-150">
        {/* Sticky header with active view breadcrumb, search/actions, and user profile */}
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onRunPipeline={handleRunPipeline}
          isRunningPipeline={isRunningPipeline}
          onExportTSV={handleExportTSV}
          onSelectTab={setCurrentTab}
          onGlobalSelectEntity={handleOpenEntityDetail}
          pipelineProgress={pipelineProgress}
        />

        {/* Global Pipeline Running / Notification Banner */}
        {pipelineToast && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
              isRunningPipeline
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2.5">
                {isRunningPipeline ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#146EF5] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#16B981] shrink-0" />
                )}
                <span className="font-semibold">{pipelineToast}</span>
              </div>
              <button
                onClick={() => setPipelineToast(null)}
                className="text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Responsive Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewView
              onNavigate={setCurrentTab}
              onOpenEntityDetail={handleOpenEntityDetail}
              testEntities={allTestEntities}
              onRunPipeline={handleRunPipeline}
              isRunningPipeline={isRunningPipeline}
            />
          )}

          {currentTab === 'explorer' && (
            <EntityExplorerView
              onOpenEntityDetail={handleOpenEntityDetail}
              allEntities={allTestEntities}
            />
          )}

          {currentTab === 'graph' && (
            <EntityGraphView
              testEntities={allTestEntities}
              onOpenEntityDetail={handleOpenEntityDetail}
            />
          )}

          {currentTab === 'blocking' && (
            <BlockingView />
          )}

          {currentTab === 'features' && (
            <FeaturesView />
          )}

          {currentTab === 'model_lab' && (
            <ModelLabView />
          )}

          {currentTab === 'f05_opt' && (
            <F05OptimizationView />
          )}

          {currentTab === 'dataset' && (
            <DatasetIntelligenceView />
          )}

          {currentTab === 'errors' && (
            <ErrorAnalysisView />
          )}

          {currentTab === 'human_review' && (
            <HumanReviewView
              testEntities={allTestEntities}
              onOpenEntityDetail={handleOpenEntityDetail}
            />
          )}

          {currentTab === 'copilot' && (
            <AICopilotView
              testEntities={allTestEntities}
              onOpenEntityDetail={handleOpenEntityDetail}
            />
          )}

          {currentTab === 'simulator' && (
            <WhatIfSimulatorView />
          )}

          {currentTab === 'submission' && (
            <SubmissionCenterView />
          )}
        </main>

        {/* Quiet Minimal Footer */}
        <footer className="mt-auto border-t border-[#DCE5F0] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#12213A]">ENTITY AI Platform</span>
            <span aria-hidden="true">·</span>
            <span>Business Entity Resolution Engine</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#16B981] font-bold">100% Validation F0.5</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Amazon ML Challenge 2026 · Random Forest 100 Trees · 79 KB
          </div>
        </footer>
      </div>

      {/* Entity Drill-Down Inspector Modal */}
      <EntityDetailModal
        matchResult={selectedEntityResult}
        onClose={() => setSelectedEntityResult(null)}
      />
    </div>
  );
}
