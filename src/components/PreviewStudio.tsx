import React, { useState } from 'react';
import { Play, RotateCcw, AlertCircle, Share2, Info, CheckSquare, Sparkles, Sliders, Monitor } from 'lucide-react';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalGenerationEngine } from '../engine/studio/GenerationEngine';
import { globalEditHistory } from '../engine/history/EditHistory';

export function PreviewStudio({ session, onRegen }: { session: StudioSessionState, onRegen?: () => void }) {
  const currentProject = globalProjectManager.getActiveProject();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRegenerateMotionOnly = () => {
    if (!currentProject || !session.brandStyle) return;
    
    const refreshed = globalGenerationEngine.generateTimeline(currentProject, session.brandStyle, session.durationSec);
    globalProjectManager.loadProject(refreshed);
    globalProjectManager.saveActive();
    globalEditHistory.addChange('Refined procedural motion keyframe coordinates', refreshed, 'SMART_STUDIO');
    
    if (onRegen) onRegen();
  };

  return (
    <div id="preview_studio_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <Monitor className="text-amber-400" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ececee]">Synthesis Live Preview Deck</h4>
        </div>
        <span className="text-[7.5px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-amber-500 rounded font-black uppercase tracking-wide">
          REAL-TIME GRAPHICS GRID
        </span>
      </div>

      {/* Primary Video/Rendering Preview Canvas Aspect Area */}
      <div className="relative aspect-video bg-[#0a0a0c] border border-neutral-850 rounded-lg overflow-hidden flex flex-col justify-between p-4 group">
        
        {/* Aspect ratio frame overlays */}
        <div className="absolute inset-0 border border-neutral-900/60 pointer-events-none flex items-center justify-center">
          {session.aspectRatio === '9:16' && (
            <div className="w-[30%] h-full border-l border-r border-[#ff00bb]/20 bg-black/40" />
          )}
          {session.aspectRatio === '1:1' && (
            <div className="aspect-square h-full border-l border-r border-[#ff00bb]/20 bg-black/40" />
          )}
        </div>

        {/* Top Info overlay */}
        <div className="z-10 flex justify-between items-start">
          <div className="bg-black/80 border border-neutral-800 px-2 py-1 rounded text-left">
            <span className="text-[7.5px] text-neutral-400 block uppercase">VECTOR LOGO METRICS</span>
            <span className="text-[10px] font-black text-amber-500">{session.logo?.fileName || 'Rolex_Oyster_Crown.svg'}</span>
          </div>

          <div className="bg-black/80 border border-neutral-850 px-2 py-1 rounded text-right">
            <span className="text-[7.5px] text-neutral-400 block uppercase">ASPECT BOUNDS</span>
            <span className="text-[10px] font-black text-white">{session.aspectRatio}</span>
          </div>
        </div>

        {/* Dynamic Art Canvas representation */}
        <div className="flex flex-col items-center justify-center space-y-3 py-6 z-10 select-none">
          {isPlaying ? (
            <div className="relative flex flex-col items-center justify-center">
              <span className="w-14 h-14 rounded-full border border-amber-500/40 border-t-amber-500 animate-spin block mt-1" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Sparkles size={16} className="text-amber-500 animate-ping" />
              </div>
              <span className="text-[9.5px] text-amber-400 font-extrabold uppercase tracking-widest mt-3 animate-pulse">RENDERING SHADERS GRID...</span>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-neutral-950/80 border border-neutral-800 hover:border-amber-500 rounded-full flex items-center justify-center cursor-pointer transition mx-auto" onClick={() => setIsPlaying(true)}>
                <Play fill="currentColor" className="text-amber-400 ml-0.5" size={16} />
              </div>
              <span className="text-[9px] text-neutral-500 block uppercase font-bold pt-1">Click to render dynamic sweep keyframes</span>
            </div>
          )}
        </div>

        {/* Bottom overlays */}
        <div className="z-10 flex justify-between items-center text-[9px]">
          <span className="bg-black/75 px-1.5 py-0.5 border border-neutral-800 rounded text-neutral-400 flex items-center gap-1">
            <Info size={9} /> Quality: <span className="text-white font-extrabold">{session.quality}</span>
          </span>

          <span className="bg-black/75 px-1.5 py-0.5 border border-neutral-800 rounded text-neutral-400">
            FPS: <span className="text-emerald-400 font-bold">59.8</span> · GPU buffer: <span className="text-neutral-200">12MB</span>
          </span>
        </div>

      </div>

      {/* Render Summary Stats */}
      <div className="p-3.5 bg-black/45 border border-rule border-neutral-850 rounded-lg space-y-2.5 text-left text-[11px]">
        <span className="text-[7.5px] text-neutral-500 uppercase font-black tracking-normal">DNA RENDERING SUMMARY</span>
        
        <div className="grid grid-cols-2 gap-3 pb-1 border-b border-neutral-900">
          <div>
            <span className="text-neutral-500 text-[9px] block">Synthesized Motion DNA</span>
            <span className="text-amber-400 font-bold leading-tight">{session.generatedMotionDNA || 'DNA_DEFAULT_SINE_V1'}</span>
          </div>
          <div>
            <span className="text-neutral-500 text-[9px] block">Physical Output Duration</span>
            <span className="text-white font-bold leading-tight">{session.durationSec} Seconds</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-neutral-500 text-[9px] block">Scene Climate Details</span>
            <span className="text-indigo-400 font-extrabold truncate block">{session.sceneName || 'Atmosphere unbuilt'}</span>
          </div>
          <div>
            <span className="text-neutral-500 text-[9px] block">Interactive Camera Settings</span>
            <span className="text-[#00ffd9] font-extrabold block">Dolly Rise Sweep Applied</span>
          </div>
        </div>

        <div className="pt-2 flex justify-between gap-2 border-t border-neutral-900">
          <button
            onClick={handleRegenerateMotionOnly}
            className="flex-1 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500 font-black text-[9.5px] rounded text-amber-400 transition cursor-pointer text-center"
          >
            <RotateCcw size={10} className="inline mr-1" /> REGEN TIMELINE VALUES
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 border border-neutral-800 hover:border-amber-400 bg-neutral-950 font-black text-[9.5px] rounded text-white transition cursor-pointer"
          >
            {isPlaying ? 'PAUSE STREAM' : 'PLAY LOOP'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default PreviewStudio;
