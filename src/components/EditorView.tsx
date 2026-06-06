import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, Info, Maximize2, Move, MousePointer2, Camera, Focus, Crosshair, SkipForward, RefreshCw } from 'lucide-react';
import { createDemo } from '../engine/examples/demo';
import { Engine } from '../engine/Engine';

export function EditorView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = createDemo(canvasRef.current);
    }
    
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d0d]">
      <EditorToolbar />
      <div className="flex-1 flex overflow-hidden">
        <SidebarLeft />
        <div className="flex-1 flex flex-col">
          <CanvasArea canvasRef={canvasRef} />
          <TimelinePanel />
        </div>
        <SidebarRight />
      </div>
    </div>
  );
}

function EditorToolbar() {
  return (
    <div className="h-12 bg-[#141414] border-b border-neutral-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex gap-2">
        <button className="p-1.5 rounded bg-neutral-800 text-white hover:bg-neutral-700 transition"><MousePointer2 size={16} /></button>
        <button className="p-1.5 rounded text-neutral-400 hover:bg-neutral-800 transition"><Move size={16} /></button>
      </div>
      
      <div className="flex items-center gap-4 bg-black/40 px-3 py-1 rounded-full border border-neutral-800">
        <button className="text-neutral-400 hover:text-white"><SkipBack size={16} fill="currentColor" /></button>
        <button className="text-neutral-400 hover:text-white"><Play size={18} fill="currentColor" /></button>
        <button className="text-neutral-400 hover:text-white"><Pause size={18} fill="currentColor" /></button>
        <button className="text-neutral-400 hover:text-white"><Square size={14} fill="currentColor" /></button>
        <button className="text-neutral-400 hover:text-white"><RefreshCw size={14} /></button>
        <button className="text-neutral-400 hover:text-white"><SkipForward size={16} fill="currentColor" /></button>
        <div className="w-px h-4 bg-neutral-800 mx-2" />
        <span className="font-mono text-xs text-neutral-400">00:00:04:12</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">144 FPS</span>
        <button className="text-neutral-500 hover:text-white"><Info size={16} /></button>
      </div>
    </div>
  );
}

function SidebarLeft() {
  const [tab, setTab] = useState('FX');
  
  return (
    <div className="w-64 bg-[#111] border-r border-neutral-800 flex flex-col shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-neutral-800 text-[10px] font-medium tracking-wider text-neutral-500 uppercase flex-wrap">
        {['FX', 'MATERIALS', 'LIGHTING', 'RENDER', 'PARTICLES'].map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 shrink-0 flex-1 text-center ${tab === t ? 'text-white border-b-2 border-indigo-500 bg-neutral-900/50' : 'hover:text-neutral-300'}`}
          >
            {t}
          </button>
        ))}
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{tab} PRESETS</span>
          <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
             <span className="text-[10px] text-indigo-400 ">+</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {tab === 'FX' && ['Energy Burst', 'Light Rays', 'Lens Flare', 'Bloom', 'Shockwave', 'Glow Pulse', 'Motion Streaks'].map((t, i) => (
             <div key={t} className="p-3 bg-black border border-neutral-800 rounded-lg group hover:border-neutral-700 transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-medium text-neutral-200">{t}</span>
                  <div className="w-6 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center px-[1px]">
                     <div className="w-2 h-2 rounded-full bg-emerald-400 translate-x-[10px]" />
                  </div>
                </div>
                <div className="h-12 bg-neutral-900 rounded mb-2 overflow-hidden relative border border-white/5">
                   {/* Thumbnail Mock */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10" />
                   {i === 2 && <div className="absolute top-1/2 left-1/2 w-8 h-px bg-white/50 -rotate-45 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#fff]" />}
                   {(i === 0 || i === 5) && <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-cyan-400/20 filter blur-sm -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#0ff]" />}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between"><span className="text-[9px] text-neutral-500">Intensity</span><span className="text-[9px] text-neutral-400">1.5</span></div>
                    <div className="w-full h-1 bg-neutral-800 rounded"><div className="w-2/3 h-full bg-indigo-500 rounded" /></div>
                  </div>
                </div>
             </div>
          ))}

          {tab === 'MATERIALS' && ['Gold', 'Chrome', 'Glass', 'Liquid Metal', 'Neon', 'Holographic'].map((t, i) => (
             <div key={t} className="flex gap-2 p-2 bg-black border border-neutral-800 rounded-lg hover:border-neutral-700 transition cursor-pointer">
                <div className={`w-10 h-10 rounded-md border border-white/10 shrink-0 ${
                   t === 'Gold' ? 'bg-[#ffd700]' : 
                   t === 'Chrome' ? 'bg-[#dddddd] shadow-[inset_0_0_10px_#fff]' : 
                   t === 'Neon' ? 'bg-[#00ffff] shadow-[0_0_10px_#0ff]' : 
                   'bg-neutral-800'
                }`} />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[11px] font-medium text-neutral-200 truncate">{t} Node</span>
                  <span className="text-[9px] text-neutral-500">Procedural PBR</span>
                </div>
             </div>
          ))}

          {tab === 'LIGHTING' && ['Luxury Preset', 'Tech Studio', 'Sports Arena', 'Minimal Setup'].map(t => (
             <div key={t} className="p-3 bg-black border border-neutral-800 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-medium text-neutral-200">{t}</span>
                  <button className="text-[9px] px-2 py-0.5 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-300">Apply</button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center"><span className="text-[9px] text-neutral-500">Key Light</span><div className="w-1/2 h-1 bg-neutral-800 rounded"><div className="w-[80%] h-full bg-amber-500" /></div></div>
                  <div className="flex justify-between items-center"><span className="text-[9px] text-neutral-500">Rim Light</span><div className="w-1/2 h-1 bg-neutral-800 rounded"><div className="w-[40%] h-full bg-blue-500" /></div></div>
                </div>
             </div>
          ))}

          {tab === 'RENDER' && ['Bloom', 'DOF', 'Tone Mapping', 'Chromatic Aberration'].map(t => (
            <div key={t} className="p-2 bg-black border border-neutral-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 border border-indigo-500 rounded-sm flex items-center justify-center bg-indigo-500/20"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-sm" /></div>
                   <span className="text-[11px] text-neutral-300">{t} Pass</span>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono">ON</span>
            </div>
          ))}
        </div>
      </div>
      
      <HierarchyPanel />
    </div>
  );
}

function HierarchyPanel() {
  return (
    <div className="h-1/3 bg-[#111] border-t border-neutral-800 flex flex-col">
       <div className="px-3 py-2 text-[10px] font-medium tracking-wider text-neutral-400 uppercase bg-neutral-900 border-b border-neutral-800">
         Scene Hierarchy
       </div>
       <div className="flex-1 overflow-y-auto p-2 text-xs font-mono text-neutral-400 space-y-1">
          <div className="flex items-center gap-2 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20 cursor-pointer">
             <div className="w-2 h-2 rounded-full border border-indigo-400" /> LayerStack_01
          </div>
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-neutral-800 rounded cursor-pointer pl-6">
             <div className="w-2 h-2 bg-neutral-600 rounded-sm" /> Logo_Mesh
          </div>
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-neutral-800 rounded cursor-pointer pl-6">
             <div className="w-2 h-2 bg-neutral-600 rounded-full" /> Glow_FX
          </div>
       </div>
    </div>
  );
}

function CanvasArea({ canvasRef }: { canvasRef: any }) {
  return (
    <div className="flex-1 relative bg-black flex items-center justify-center p-8">
      {/* Aspect Ratio Container */}
      <div className="relative w-full h-full max-w-4xl max-h-[80%] aspect-video bg-[#0a0a0a] border border-neutral-800 shadow-2xl rounded overflow-hidden">
         <canvas ref={canvasRef} className="w-full h-full object-contain" />
         
         <div className="absolute top-2 right-2 flex gap-2">
            <button className="p-1.5 bg-black/50 text-neutral-300 hover:text-white rounded backdrop-blur border border-white/10" title="Camera Settings"><Camera size={14} /></button>
            <button className="p-1.5 bg-black/50 text-neutral-300 hover:text-white rounded backdrop-blur border border-white/10" title="Focus Distance"><Focus size={14} /></button>
            <button className="p-1.5 bg-black/50 text-neutral-300 hover:text-white rounded backdrop-blur border border-white/10" title="Gizmo Visibility"><Crosshair size={14} /></button>
            <div className="w-px h-6 bg-white/10" />
            <button className="p-1.5 bg-black/50 text-white rounded backdrop-blur border border-white/10"><Maximize2 size={14} /></button>
         </div>
      </div>
    </div>
  );
}

function TimelinePanel() {
  return (
    <div className="h-48 bg-[#111] border-t border-neutral-800 flex flex-col shrink-0">
      <div className="flex border-b border-neutral-800">
         <div className="w-48 px-3 py-1.5 text-[10px] font-medium tracking-wider text-neutral-400 uppercase border-r border-neutral-800 bg-neutral-900 flex items-center">
           Tracks
         </div>
         <div className="flex-1 bg-[#0a0a0a] relative">
            {/* Timeline Ruler */}
            <div className="absolute top-0 w-full h-4 border-b border-neutral-800 pointer-events-none flex text-[8px] font-mono text-neutral-600 items-center overflow-hidden">
               {Array.from({length: 20}).map((_, i) => (
                 <div key={i} className="flex-1 border-l border-neutral-800 pl-1 h-full">{i}s</div>
               ))}
               
               <div className="absolute left-[30%] top-0 bottom-0 w-px bg-red-500/80 z-10" />
            </div>
         </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
         <div className="w-48 bg-[#111] border-r border-neutral-800 py-2 space-y-1 overflow-y-auto">
            {['Luxury Reveal', 'Scale', 'Orbit', 'Camera: Orbit', 'Camera: Focus', 'Camera: Dolly'].map(t => (
               <div key={t} className="px-3 py-1 text-[11px] text-neutral-400 truncate hover:bg-neutral-800 cursor-pointer flex items-center justify-between">
                 <span>{t}</span>
                 {t.startsWith('Camera') && <Camera size={10} className="text-indigo-400" />}
               </div>
            ))}
         </div>
         <div className="flex-1 bg-[#0d0d0d] relative overflow-hidden p-2 space-y-2">
             <div className="w-3/4 h-4 rounded bg-indigo-500/20 border border-indigo-500/40 translate-x-4" />
             <div className="w-1/2 h-4 rounded bg-emerald-500/20 border border-emerald-500/40 translate-x-12" />
             <div className="w-1/3 h-4 rounded bg-pink-500/20 border border-pink-500/40 translate-x-32" />
             <div className="w-2/3 h-4 rounded bg-amber-500/20 border border-amber-500/40 translate-x-8 flex items-center px-2"><span className="text-[8px] text-amber-200 uppercase">Cut 1</span></div>
             <div className="w-1/4 h-4 rounded bg-cyan-500/20 border border-cyan-500/40 translate-x-16" />
             <div className="w-1/2 h-4 rounded bg-amber-500/20 border border-amber-500/40 translate-x-[45%] flex items-center px-2"><span className="text-[8px] text-amber-200 uppercase">Cut 2</span></div>
         </div>
      </div>
    </div>
  );
}

function SidebarRight() {
  const [tab, setTab] = useState('PROPERTIES');
  return (
    <div className="w-64 bg-[#111] border-l border-neutral-800 flex flex-col shrink-0">
      <div className="flex border-b border-neutral-800 text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
        {['PROPERTIES', 'MOTION DNA', 'CAMERA'].map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 ${tab === t ? 'text-white border-b-2 border-indigo-500 bg-neutral-900/50' : 'hover:text-neutral-300'}`}
          >
            {t}
          </button>
        ))}
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
         {tab === 'CAMERA' && (
           <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider flex justify-between">
                  <span>Rig: ShotCam_01</span>
                  <span className="text-emerald-500">ACTIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                   <div className="p-1.5 bg-black border border-neutral-800 rounded">
                     <div className="text-[9px] text-neutral-500 mb-1">FOV</div>
                     <div className="text-xs text-neutral-300 font-mono">45.0°</div>
                   </div>
                   <div className="p-1.5 bg-black border border-neutral-800 rounded">
                     <div className="text-[9px] text-neutral-500 mb-1">Exposure</div>
                     <div className="text-xs text-neutral-300 font-mono">1.2 EV</div>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Depth of Field</div>
                <div className="p-2 bg-black border border-neutral-800 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-neutral-400">Focus Distance</span>
                    <span className="text-xs text-neutral-200 font-mono">2.5m</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded overflow-hidden">
                    <div className="w-[30%] h-full bg-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Active Behavior</div>
                <div className="p-2 bg-neutral-900 border border-indigo-500/30 rounded text-xs text-neutral-300">
                  <span className="text-indigo-400 font-medium">ORBIT</span> - Radius 5m
                </div>
              </div>
           </div>
         )}
         {tab === 'PROPERTIES' && (
           <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Transform</div>
                <div className="grid grid-cols-3 gap-2">
                   <div className="p-1.5 bg-black border border-neutral-800 rounded flex flex-col items-center">
                     <span className="text-[9px] text-neutral-600 font-mono mb-1">X</span>
                     <span className="text-xs font-mono text-neutral-300">0.00</span>
                   </div>
                   <div className="p-1.5 bg-black border border-neutral-800 rounded flex flex-col items-center">
                     <span className="text-[9px] text-neutral-600 font-mono mb-1">Y</span>
                     <span className="text-xs font-mono text-neutral-300">1.20</span>
                   </div>
                   <div className="p-1.5 bg-black border border-neutral-800 rounded flex flex-col items-center">
                     <span className="text-[9px] text-neutral-600 font-mono mb-1">Z</span>
                     <span className="text-xs font-mono text-neutral-300">0.00</span>
                   </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Material</div>
                <div className="p-2 bg-black border border-neutral-800 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-[#ffd700] ring-1 ring-white/20" />
                    <span className="text-xs font-mono text-neutral-300">Gold_Clean</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded overflow-hidden">
                    <div className="w-[80%] h-full bg-neutral-500" />
                  </div>
                  <div className="text-[9px] text-neutral-500 mt-1">Metalness: 0.8</div>
                </div>
              </div>
           </div>
         )}
         
         {tab === 'MOTION DNA' && (
           <div className="p-2 bg-black border border-neutral-800 rounded font-mono text-[10px] text-emerald-400 overflow-x-auto">
              <pre>{JSON.stringify({
                 style: "LUXURY",
                 blocks: ["FADE", "SCALE", "ORBIT"],
                 rules: {
                   acceleration: "slow",
                   easing: "smooth"
                 }
              }, null, 2)}</pre>
           </div>
         )}
      </div>
    </div>
  );
}
