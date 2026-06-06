import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, AlertCircle, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';
import { ProjectWizard } from './ProjectWizard';
import { WorkflowPanel } from './WorkflowPanel';
import { GenerationPanel } from './GenerationPanel';
import { RecommendationPanel } from './RecommendationPanel';
import { ValidationPanel } from './ValidationPanel';
import { TemplateGallery } from './TemplateGallery';
import { PreviewStudio } from './PreviewStudio';
import { EditHistoryPanel } from './EditHistoryPanel';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalEditHistory } from '../engine/history/EditHistory';

export function AIStudioView() {
  const [session, setSession] = useState<StudioSessionState>(globalStudioSession.getState());
  const [activeProject, setActiveProject] = useState(globalProjectManager.getActiveProject());
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const unsubSession = globalStudioSession.registerListener((s) => {
      setSession(s);
    });

    const unsubProject = globalProjectManager.registerListener(() => {
      setActiveProject(globalProjectManager.getActiveProject());
    });

    return () => {
      unsubSession();
      unsubProject();
    };
  }, []);

  const handleApplyTemplateFinished = () => {
    setShowWizard(false);
  };

  const handleWizardFinished = () => {
    setShowWizard(false);
  };

  const handleGlobalProjectRefresh = () => {
    setActiveProject(globalProjectManager.getActiveProject());
  };

  return (
    <div id="ai_studio_workspace" className="p-6 space-y-6 max-w-7xl mx-auto font-mono text-neutral-300 min-h-screen">
      
      {/* Upper branding section block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121215] border border-neutral-800 p-5 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-500 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
              Milestone 19 Studio
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9.5px] text-neutral-400 font-extrabold uppercase">Live Synthesis Vector Core</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase">AI MOTION STUDIO</h2>
          <p className="text-[11px] text-neutral-400">Generate, audit, and preview high-fidelity procedural motion paths based on brand assets.</p>
        </div>

        <div className="flex items-center gap-2">
          {!showWizard && (
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-extrabold text-[11px] uppercase border border-amber-500 transition shadow-md shadow-amber-950/20 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={11} fill="currentColor" /> Launch Brand Wizard
            </button>
          )}

          {showWizard && (
            <button
              onClick={() => setShowWizard(false)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded font-bold text-[11px] uppercase transition cursor-pointer"
            >
              Exit Ingestion Wizard
            </button>
          )}
        </div>
      </div>

      {/* Main Workflow panel showing overall status */}
      <WorkflowPanel session={session} onStepChange={handleGlobalProjectRefresh} />

      {showWizard ? (
        <div className="animate-fade-in">
          <ProjectWizard onComplete={handleWizardFinished} />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Default notice of setup if not yet bound */}
          {!session.brandStyle ? (
            <div className="p-8 bg-[#121215] border border-dashed border-neutral-800 rounded-xl text-center space-y-4">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-850 rounded-full flex items-center justify-center mx-auto text-amber-500">
                <Wand2 size={20} className="animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-200 uppercase">AWAITING BRAND CONFIGURATION</h3>
                <p className="text-[11px] text-neutral-500 max-w-md mx-auto">
                  To synthesize procedural keyframe vectors, launch the Project Wizard or click any industry preset template below.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowWizard(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-[#121215] font-black text-[10px] rounded uppercase cursor-pointer transition flex items-center gap-1"
                >
                  Configure Wizard <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Live render preview (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <PreviewStudio session={session} onRegen={handleGlobalProjectRefresh} />
                <EditHistoryPanel onHistoryAction={handleGlobalProjectRefresh} />
              </div>

              {/* Right Column: Logic modules parameters toggles (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <GenerationPanel session={session} />
                <ValidationPanel session={session} onProjectUpdate={handleGlobalProjectRefresh} />
                <RecommendationPanel session={session} />
              </div>

            </div>
          )}

          {/* Template presets collection (always accessible to easily test presets!) */}
          <TemplateGallery session={session} onApply={handleApplyTemplateFinished} />

        </div>
      )}

    </div>
  );
}
export default AIStudioView;
