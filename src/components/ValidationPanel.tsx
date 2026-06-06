import React, { useMemo } from 'react';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { globalAIStudio } from '../engine/studio/AIStudio';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';

export function ValidationPanel({ session, onProjectUpdate }: { session: StudioSessionState, onProjectUpdate?: () => void }) {
  const currentProject = globalProjectManager.getActiveProject();

  const report = useMemo(() => {
    if (!currentProject) {
      return {
        healthScore: 100,
        performanceScore: 100,
        qualityScore: 100,
        issues: [],
        exportReady: true
      };
    }
    return globalAIStudio.validate(currentProject);
  }, [currentProject, session.currentStepIndex, session.isProjectValidated]);

  const handleApplyResolution = (issueId: string) => {
    if (!currentProject) return;
    
    // Perform self-healing overrides matching standard checks
    const updated = { ...currentProject };

    if (issueId === 'val_cam_fov') {
      updated.sceneState.cameraSettings.fov = 40;
    } else if (issueId === 'val_cam_near') {
      updated.sceneState.cameraSettings.near = 0.1;
    } else if (issueId === 'val_fx_bloom_conflict') {
      updated.sceneState.activeFX = updated.sceneState.activeFX.filter(f => f !== 'LENS_BLOOM');
    } else if (issueId === 'val_fx_count') {
      updated.sceneState.activeFX = updated.sceneState.activeFX.slice(0, 3);
    } else if (issueId === 'val_mat_none') {
      updated.sceneState.activeMaterials = ['GOLD'];
    }

    globalProjectManager.loadProject(updated);
    globalProjectManager.saveActive();
    if (onProjectUpdate) onProjectUpdate();
  };

  return (
    <div id="validation_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-amber-400" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ececee]">Project Validation & Integrity</h4>
        </div>
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
          report.exportReady 
            ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/40' 
            : 'bg-red-950/25 text-red-400 border-red-900/40 animate-pulse'
        }`}>
          {report.exportReady ? 'EXPORT READINESS OK' : 'CRITICAL ISSUES BLOCKED'}
        </span>
      </div>

      {/* Aggregate Score Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-black/45 border border-neutral-850 rounded-lg text-left">
          <span className="text-[8.5px] text-neutral-500 uppercase font-black tracking-normal">Integrity Health</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white">{report.healthScore}%</span>
            <span className="text-[10px] text-neutral-500">score</span>
          </div>
          <div className="w-full bg-neutral-900 h-1 rounded overflow-hidden mt-2">
            <div className="bg-amber-500 h-full" style={{ width: `${report.healthScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-black/45 border border-neutral-850 rounded-lg text-left">
          <span className="text-[8.5px] text-neutral-500 uppercase font-black tracking-normal">CPU Draw Index</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white">{report.performanceScore}%</span>
            <span className="text-[10px] text-neutral-500">60FPS cap</span>
          </div>
          <div className="w-full bg-neutral-900 h-1 rounded overflow-hidden mt-2">
            <div className="bg-cyan-500 h-full" style={{ width: `${report.performanceScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-black/45 border border-neutral-850 rounded-lg text-left">
          <span className="text-[8.5px] text-neutral-500 uppercase font-black tracking-normal">Aesthetic Grade</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white">{report.qualityScore}%</span>
            <span className="text-[10px] text-neutral-500">producer quality</span>
          </div>
          <div className="w-full bg-neutral-900 h-1 rounded overflow-hidden mt-2">
            <div className="bg-[#ff00bb] h-full" style={{ width: `${report.qualityScore}%` }} />
          </div>
        </div>
      </div>

      {/* Issues list detail */}
      <div className="space-y-2">
        <span className="text-[8px] text-neutral-500 uppercase font-bold tracking-normal">CONCURRENCY & INTEGRITY ISSUES ({report.issues.length})</span>
        
        {report.issues.length === 0 ? (
          <div className="p-4 bg-emerald-900/5 border border-emerald-900/15 rounded-lg text-center font-mono">
            <CheckCircle2 size={18} className="text-emerald-400 mx-auto mb-1 animate-pulse" />
            <p className="text-[10.5px] text-emerald-400 font-bold uppercase">Perfect Integrity Cleared</p>
            <p className="text-[9.5px] text-neutral-500 mt-1 max-w-sm mx-auto">No timeline overlaps, parameter clips, or render anomalies found. Ready for compile pipeline dispatch.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
            {report.issues.map((issue) => (
              <div 
                key={issue.id} 
                className={`p-3 border rounded-lg text-left flex justify-between items-start gap-4 ${
                  issue.severity === 'CRITICAL' 
                    ? 'bg-red-950/10 border-red-900/30' 
                    : issue.severity === 'WARNING' 
                      ? 'bg-amber-950/10 border-amber-900/30' 
                      : 'bg-neutral-900/30 border-neutral-850'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle size={11} className={issue.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-500'} />
                    <span className="text-[8.5px] font-black uppercase text-neutral-400">{issue.category} · {issue.severity}</span>
                  </div>
                  <p className="text-[10.5px] font-bold text-neutral-100">{issue.message}</p>
                  <p className="text-[9px] text-neutral-400"><HelpCircle size={10} className="inline mr-0.5 text-neutral-500" /> {issue.resolution}</p>
                </div>

                {issue.id !== 'val_asset_none' && issue.id !== 'val_time_notracks' && (
                  <button
                    onClick={() => handleApplyResolution(issue.id)}
                    className="p-1 px-2 border border-neutral-800 bg-black hover:border-amber-500 text-[8.5px] text-amber-400 rounded transition whitespace-nowrap cursor-pointer flex items-center gap-1"
                  >
                    <span>Auto Fix</span> <ArrowRight size={8} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default ValidationPanel;
