import React, { useState } from 'react';
import { Layers, RefreshCw, Cpu, Activity, ShieldCheck, CheckSquare, Sparkles } from 'lucide-react';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';
import { globalGenerationEngine } from '../engine/studio/GenerationEngine';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalEditHistory } from '../engine/history/EditHistory';

export function GenerationPanel({ session }: { session: StudioSessionState }) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleManualTriggerRegen = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const currentProj = globalProjectManager.getActiveProject();
      if (currentProj && session.brandStyle) {
        // Regenerate current scene state parameters
        const updated = globalGenerationEngine.generateScene(currentProj, session.brandStyle, session.aspectRatio);
        const camUpdated = globalGenerationEngine.generateCamera(updated, session.brandStyle);
        const fxUpdated = globalGenerationEngine.generateFX(camUpdated, session.brandStyle);
        const tfUpdated = globalGenerationEngine.generateTimeline(fxUpdated, session.brandStyle, session.durationSec);

        globalProjectManager.loadProject(tfUpdated);
        globalProjectManager.saveActive();
        globalEditHistory.addChange('Regenerated algorithmic pipeline elements', tfUpdated, 'SMART_STUDIO');
      }
      setIsRegenerating(false);
    }, 1100);
  };

  return (
    <div id="generation_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="text-amber-400" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ececee]">AI Synthesis Engine Core</h4>
        </div>
        <button
          onClick={handleManualTriggerRegen}
          disabled={isRegenerating || !session.brandStyle}
          className={`p-1 flex items-center gap-1 rounded text-[9px] uppercase font-bold tracking-wider cursor-pointer border ${
            isRegenerating 
              ? 'bg-neutral-900 border-neutral-800 text-neutral-600 animate-spin' 
              : session.brandStyle
                ? 'bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 border-amber-900/40'
                : 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed'
          }`}
        >
          <RefreshCw size={10} />
          <span>{isRegenerating ? 'Compiling' : 'Re-synthesize'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Motion DNA', status: session.generatedMotionDNA ? 'OK' : 'PENDING', info: session.generatedMotionDNA || 'Unsynthesized', color: 'text-amber-500' },
          { label: 'Scene Canvas', status: session.sceneName ? 'OK' : 'PENDING', info: session.sceneName || 'Silent stage', color: 'text-indigo-400' },
          { label: 'Camera Path', status: session.cameraSettingApplied ? 'OK' : 'PENDING', info: session.cameraSettingApplied ? 'Dolly Sweep active' : 'Unmounted lens', color: 'text-emerald-400' },
          { label: 'FX Shader', status: session.fxApplied ? 'OK' : 'PENDING', info: session.fxApplied ? 'Shaders applied' : 'Raw vector grid', color: 'text-cyan-400' },
          { label: 'Timeline Keyframes', status: session.timelineSynthesized ? 'OK' : 'PENDING', info: session.timelineSynthesized ? 'Channels configured' : 'Static vector nodes', color: 'text-pink-400' }
        ].map((mod, index) => (
          <div key={index} className="p-3 bg-black/40 border border-neutral-850 rounded-lg space-y-1.5 text-left flex flex-col justify-between">
            <span className="text-[8.5px] uppercase text-neutral-500 font-bold block">{mod.label}</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${mod.status === 'OK' ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-700'}`} />
              <span className={`text-[10px] uppercase font-extrabold ${mod.status === 'OK' ? 'text-emerald-400' : 'text-neutral-500'}`}>{mod.status}</span>
            </div>
            <p className="text-[9.5px] text-neutral-300 font-mono mt-1 leading-tight truncate">{mod.info}</p>
          </div>
        ))}
      </div>

      {session.brandStyle && (
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-center justify-between text-[10px] text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="animate-pulse" />
            <span>Target profile aligned with active **{session.brandStyle}** templates framework.</span>
          </div>
          <span className="text-[9px] uppercase font-black text-neutral-500">Pipeline Synchronized</span>
        </div>
      )}
    </div>
  );
}
export default GenerationPanel;
