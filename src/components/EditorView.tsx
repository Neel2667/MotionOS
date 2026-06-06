import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, Info, Maximize2, Move, MousePointer2, Camera, Focus, Crosshair, SkipForward, RefreshCw, Save, FolderOpen, Video, List, Box, Palette, Upload, Sparkles, Type, Check, Trash2, Sliders, HardDrive, Cpu, Zap, LayoutGrid } from 'lucide-react';
import { createDemo } from '../engine/examples/demo';
import { Engine } from '../engine/Engine';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { Project } from '../engine/project/Project';
import { globalAssetDatabase } from '../engine/assets/AssetDatabase';
import { globalBrandEngine, BrandProfile } from '../engine/brand/BrandEngine';
import { LibraryAsset } from '../engine/assets/AssetMetadata';
import { globalAssetImporter } from '../engine/import/AssetImporter';
import { WebGPUManager } from '../engine/webgpu/WebGPUManager';
import { RenderCoordinator } from '../engine/render/RenderCoordinator';

export function EditorView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [project, setProject] = useState<Project>(() => globalProjectManager.getActiveProject());
  const [saveStatus, setSaveStatus] = useState('Clean');

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = createDemo(canvasRef.current);
    }
    
    // Listen to project edits
    const unsub = globalProjectManager.registerListener((p) => {
      if (p) setProject({ ...p });
    });

    // Monitor autosave milestones
    const interval = setInterval(() => {
      const secs = globalProjectManager.autosave.getSecondsSinceLastSave();
      if (secs === 0) {
        setSaveStatus('Autosaved just now');
        setTimeout(() => setSaveStatus('All changes saved'), 3000);
      }
    }, 2000);
    
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleManualSave = () => {
    try {
      globalProjectManager.saveActive();
      setSaveStatus('Manually Saved');
      setTimeout(() => setSaveStatus('All changes saved'), 3000);
    } catch (e) {
      setSaveStatus('Save Failed');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d0d]">
      <EditorToolbar 
        projectName={project.metadata.name} 
        saveStatus={saveStatus}
        onSave={handleManualSave}
      />
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

interface EditorToolbarProps {
  projectName: string;
  saveStatus: string;
  onSave: () => void;
}

function EditorToolbar({ projectName, saveStatus, onSave }: EditorToolbarProps) {
  return (
    <div className="h-12 bg-[#141414] border-b border-neutral-800 flex items-center justify-between px-4 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5 border border-neutral-800 p-0.5 roundedbg-neutral-900">
          <button className="p-1 px-2 text-[10px] bg-indigo-500/10 border border-indigo-500/20 rounded font-mono text-indigo-400 font-bold tracking-wider">
            {projectName.toUpperCase()}
          </button>
        </div>
        <span className="text-[10px] font-mono text-neutral-500">{saveStatus}</span>
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

      <div className="flex items-center gap-2">
        <button 
          onClick={onSave}
          title="Manual Session Save"
          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition flex items-center gap-1 text-[11px] font-mono border border-neutral-850 bg-neutral-900"
        >
          <Save size={12} /> Save
        </button>
        <span className="font-mono text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">144 FPS</span>
      </div>
    </div>
  );
}

function SidebarLeft() {
  const [panelMode, setPanelMode] = useState<'ENGINE' | 'BRAND'>('BRAND');
  const [engineTab, setEngineTab] = useState('FX');
  const [brandTab, setBrandTab] = useState('ASSETS');

  const [assetsList, setAssetsList] = useState<LibraryAsset[]>([]);
  const [activeAsset, setActiveAsset] = useState<LibraryAsset | null>(null);
  const [activeProfile, setActiveProfile] = useState<BrandProfile | null>(null);

  // Upload helpers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Initialize and register database listener
  useEffect(() => {
    const unsub = globalAssetDatabase.registerListener((fresh) => {
      setAssetsList(fresh);
      
      // Select first active logo-style asset to compute default profile if none exists
      if (fresh.length > 0) {
        const defaultLogo = fresh.find(a => a.name.includes('Mercedes')) || fresh[0];
        if (!activeAsset) {
          setActiveAsset(defaultLogo);
          const prof = globalBrandEngine.analyzeBrandAsset(defaultLogo.name, defaultLogo.metadata.fileSizeEstimateBytes);
          setActiveProfile(prof);
        }
      }
    });
    return () => unsub();
  }, [activeAsset]);

  const selectAssetAndAnalyze = (asset: LibraryAsset) => {
    setActiveAsset(asset);
    const prof = globalBrandEngine.analyzeBrandAsset(asset.name, asset.metadata.fileSizeEstimateBytes);
    setActiveProfile(prof);
    globalAssetDatabase.incrementUsage(asset.id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadProgress('Analyzing file...');
      const imported = await globalAssetImporter.importFile(file, '/Root');
      selectAssetAndAnalyze(imported);
      setUploadProgress(null);
      setBrandTab('ASSETS');
    } catch (err: any) {
      setUploadProgress(`Fail: ${err.message || 'Limit exceeded'}`);
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  return (
    <div className="w-64 bg-[#111] border-r border-neutral-800 flex flex-col shrink-0 select-none">
      
      {/* Mode selectors */}
      <div className="grid grid-cols-2 border-b border-neutral-800 text-[9px] font-mono font-black uppercase tracking-widest text-center select-none bg-black/40">
        <button
          onClick={() => setPanelMode('ENGINE')}
          className={`py-3 transition-colors flex items-center justify-center gap-1.5 ${panelMode === 'ENGINE' ? 'text-indigo-400 bg-[#16161a] border-b-2 border-indigo-505' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Sliders size={11} /> Engine
        </button>
        <button
          onClick={() => setPanelMode('BRAND')}
          className={`py-3 transition-colors flex items-center justify-center gap-1.5 ${panelMode === 'BRAND' ? 'text-indigo-400 bg-[#16161a] border-b-2 border-indigo-505' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Sparkles size={11} className="text-amber-400" /> Brand Studio
        </button>
      </div>

      {panelMode === 'ENGINE' ? (
        <>
          {/* Classic Engine subtabs */}
          <div className="flex border-b border-neutral-800 text-[10px] font-medium tracking-wider text-neutral-500 uppercase flex-wrap">
            {['FX', 'MATERIALS', 'LIGHTING', 'RENDER'].map(t => (
              <button 
                key={t}
                onClick={() => setEngineTab(t)}
                className={`px-2.5 py-2 shrink-0 flex-1 text-center ${engineTab === t ? 'text-white border-b-2 border-indigo-500 bg-neutral-900/50' : 'hover:text-neutral-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{engineTab} PRESETS</span>
              <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                 <span className="text-[10px] text-indigo-400 ">+</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {engineTab === 'FX' && ['Energy Burst', 'Light Rays', 'Lens Flare', 'Bloom', 'Shockwave'].map((t, i) => (
                 <div key={t} className="p-2.5 bg-black border border-neutral-800 rounded-lg group hover:border-neutral-700 transition">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-medium text-neutral-200">{t}</span>
                      <div className="w-5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center px-[1px]">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 translate-x-[8px]" />
                      </div>
                    </div>
                    <div className="h-10 bg-neutral-900/60 rounded overflow-hidden relative border border-white/5">
                       <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5" />
                    </div>
                 </div>
              ))}

              {engineTab === 'MATERIALS' && ['Gold', 'Chrome', 'Glass', 'Liquid Metal', 'Neon'].map((t) => (
                 <div key={t} className="flex gap-2 p-2 bg-black border border-neutral-800 rounded-lg hover:border-neutral-700 transition cursor-pointer">
                    <div className={`w-8 h-8 rounded border border-white/10 shrink-0 ${
                       t === 'Gold' ? 'bg-[#ffd700]' : 
                       t === 'Chrome' ? 'bg-[#dddddd] shadow-[inset_0_0_5px_#fff]' : 
                       t === 'Neon' ? 'bg-[#00ffff] shadow-[0_0_5px_#0ff]' : 
                       'bg-neutral-800'
                    }`} />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-[10px] font-medium text-neutral-300 truncate">{t}</span>
                      <span className="text-[8px] text-neutral-500">PBR Shader</span>
                    </div>
                 </div>
              ))}

              {engineTab === 'LIGHTING' && ['Luxury Preset', 'Tech Studio', 'Sports Arena'].map(t => (
                 <div key={t} className="p-2.5 bg-black border border-neutral-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-medium text-neutral-200">{t}</span>
                      <button className="text-[8px] px-1.5 py-0.5 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-400">Apply</button>
                    </div>
                 </div>
              ))}

              {engineTab === 'RENDER' && ['Bloom Pass', 'DOF Filter', 'Tone Mapping'].map(t => (
                <div key={t} className="p-2 bg-black border border-neutral-800 rounded flex items-center justify-between">
                    <span className="text-[10px] text-neutral-300">{t}</span>
                    <span className="text-[8px] text-emerald-500 font-mono">ON</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Brand Studio subtabs */}
          <div className="flex border-b border-neutral-800 overflow-x-auto text-[8px] font-mono leading-none tracking-wider text-neutral-500 uppercase select-none no-scrollbar shrink-0">
            {['ASSETS', 'MEDIA', 'UPLOADS', 'BRAND', 'COLORS', 'FONTS', 'PALETTES'].map(t => (
              <button
                key={t}
                onClick={() => setBrandTab(t)}
                className={`px-2.5 py-2.5 shrink-0 text-center font-bold ${brandTab === t ? 'text-amber-400 border-b-2 border-amber-500 bg-neutral-900/60' : 'hover:text-neutral-300'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 p-3 overflow-y-auto w-full space-y-4">
            
            {/* Tab view: ASSETS or MEDIA */}
            {(brandTab === 'ASSETS' || brandTab === 'MEDIA') && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Available Media Library</span>
                
                <div className="grid grid-cols-2 gap-2">
                  {assetsList.map((asset) => {
                    const isSelected = activeAsset?.id === asset.id;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => selectAssetAndAnalyze(asset)}
                        className={`p-1.5 rounded border text-left cursor-pointer transition ${
                          isSelected 
                            ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20' 
                            : 'border-neutral-800 bg-black/40 hover:border-neutral-700'
                        }`}
                      >
                        <div className="h-12 bg-neutral-950 rounded flex items-center justify-center p-1 mb-1 border border-neutral-850">
                          <img src={asset.thumbnailUrl} alt={asset.name} className="max-h-full max-w-full object-contain rounded" />
                        </div>
                        <p className="text-[9px] text-neutral-300 truncate font-mono tracking-tight">{asset.name}</p>
                        <span className="text-[7px] text-neutral-500 uppercase font-mono">{asset.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab view: UPLOADS */}
            {brandTab === 'UPLOADS' && (
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Ingest New Logo</span>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 p-4 rounded-lg text-center cursor-pointer transition"
                >
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <Upload size={18} className="mx-auto text-neutral-500 mb-1.5 animate-bounce" />
                  <p className="text-[10px] text-neutral-300 font-medium">Click to select vector/PNG</p>
                  <p className="text-[8px] text-neutral-500 font-mono mt-1">PNG, SVG, JPG, WEBP</p>
                </div>

                {uploadProgress && (
                  <p className="text-[9px] font-mono text-indigo-400 text-center animate-pulse">{uploadProgress}</p>
                )}
              </div>
            )}

            {/* Tab view: BRAND */}
            {brandTab === 'BRAND' && activeProfile && (
              <div className="space-y-3 font-mono">
                <span className="text-[9px] text-neutral-500 uppercase block">Dynamic Calibration</span>
                
                <div className="bg-black/40 border border-neutral-800 rounded p-2.5 space-y-1.5">
                  <span className="text-[8px] text-neutral-500">Archetype Style:</span>
                  <p className="text-[11px] font-bold text-white uppercase tracking-tight">{activeProfile.style}</p>
                  <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeProfile.confidenceScore * 100}%` }} />
                  </div>
                </div>

                <div className="bg-black/40 border border-neutral-800 rounded p-2.5 space-y-2">
                  <div className="flex justify-between text-[9px] text-neutral-400">
                    <span>Symmetry:</span>
                    <span className="text-white">{(activeProfile.shape.symmetry * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-neutral-400">
                    <span>Balance:</span>
                    <span className="text-white">{(activeProfile.shape.balance * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="bg-black/40 border border-neutral-800 rounded p-2.5 space-y-1.5 text-[9px] text-neutral-400 leading-relaxed">
                  <span className="text-neutral-500 uppercase block text-[8px]">Motion Recommendations:</span>
                  <p><span className="text-amber-500">•</span> Camera: {activeProfile.motionSuggestions.cameraStyle.split(' ')[0]}</p>
                  <p><span className="text-amber-500">•</span> Material: {activeProfile.motionSuggestions.suggestedMaterials[0]}</p>
                </div>
              </div>
            )}

            {/* Tab view: COLORS or PALETTES */}
            {(brandTab === 'COLORS' || brandTab === 'PALETTES') && activeProfile && (
              <div className="space-y-2 font-mono">
                <span className="text-[9px] text-neutral-500 uppercase block">Color Swatches</span>
                
                <div className="space-y-1.5">
                  {activeProfile.colors.palette.map((swatch, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigator.clipboard.writeText(swatch.hex)}
                      className="flex items-center justify-between p-1.5 bg-black/40 rounded border border-neutral-800 hover:border-neutral-700 cursor-pointer transition text-[9px]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-white/5" style={{ backgroundColor: swatch.hex }} />
                        <span className="text-neutral-300 font-medium truncate max-w-[100px]">{swatch.name}</span>
                      </div>
                      <span className="text-neutral-500 font-mono text-[9px]">{swatch.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab view: FONTS */}
            {brandTab === 'FONTS' && activeProfile && (
              <div className="space-y-3 font-mono text-[9px] text-neutral-400 leading-relaxed">
                <span className="text-[9px] text-neutral-500 uppercase block">Typography Specification</span>
                
                <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
                  <span className="text-neutral-500 uppercase block text-[7px]">Identified Face:</span>
                  <p className="text-xs font-bold text-neutral-100 truncate mt-0.5" style={{ fontFamily: activeProfile.typography.fontFamily }}>
                    {activeProfile.typography.fontFamily}
                  </p>
                </div>

                <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800">
                  <span className="text-neutral-500 uppercase block text-[7px]">Pairing Heuristics:</span>
                  <p className="text-neutral-300 mt-1">{activeProfile.typography.suggestedPairings[0]}</p>
                </div>
              </div>
            )}

          </div>
        </>
      )}
      
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
  const [hud, setHud] = useState<any>(null);

  useEffect(() => {
    const updateStats = () => {
      const gpu = WebGPUManager.getInstance().getStatus();
      const coord = RenderCoordinator.getInstance().getStatus();
      setHud({ gpu, coord });
    };
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 relative bg-black flex items-center justify-center p-8">
      {/* Aspect Ratio Container */}
      <div className="relative w-full h-full max-w-4xl max-h-[80%] aspect-video bg-[#0a0a0a] border border-neutral-800 shadow-2xl rounded overflow-hidden">
         <canvas ref={canvasRef} className="w-full h-full object-contain" />
         
         {/* Live Performance Overlay Hud HUD */}
         {hud && (
           <div className="absolute bottom-3 left-3 bg-[#08080ac0] backdrop-blur border border-neutral-800/80 p-3 rounded-lg text-neutral-300 font-mono text-[9px] w-64 space-y-1.5 shadow-xl select-none">
             <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1.5">
               <span className="font-bold text-indigo-400 flex items-center gap-1">
                 <Cpu size={10} className="animate-pulse" /> WebGPU HUD Overlay
               </span>
               <span className="text-emerald-400 font-black">60.0 FPS</span>
             </div>
             <div className="grid grid-cols-2 gap-x-2 gap-y-1">
               <div>
                 <span className="text-neutral-500 block uppercase text-[7px]">VM Driver</span>
                 <span className="text-neutral-200 uppercase">{hud.gpu.adapter?.backend || 'vulkan'}</span>
               </div>
               <div>
                 <span className="text-neutral-500 block uppercase text-[7px]">VRAM Allocated</span>
                 <span className="text-violet-400">{hud.gpu.memoryUsedMb} MB</span>
               </div>
               <div>
                 <span className="text-neutral-500 block uppercase text-[7px]">Pipeline Cache</span>
                 <span className="text-neutral-200">{hud.gpu.pipelineCacheCount} caches</span>
               </div>
               <div>
                 <span className="text-neutral-500 block uppercase text-[7px]">Cache Hit rate</span>
                 <span className="text-emerald-400 font-bold">{hud.gpu.pipelineCacheEfficiency}%</span>
               </div>
             </div>
             <div className="border-t border-neutral-800/60 pt-1.5 flex justify-between items-center">
               <span className="text-neutral-500 text-[8px]">Canvas: {hud.coord.viewportWidth}x{hud.coord.viewportHeight}</span>
               <span className="text-[8px] text-indigo-300">Frames compiled: {hud.coord.totalFramesRendered}</span>
             </div>
           </div>
         )}

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
