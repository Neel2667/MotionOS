import { useState, useEffect } from 'react';
import { Sparkles, Library, FileText, Palette, FileUp, Cpu, Info, CheckCircle2 } from 'lucide-react';
import { UploadPanel } from './UploadPanel';
import { AssetBrowser } from './AssetBrowser';
import { AssetInspector } from './AssetInspector';
import { BrandAnalysisView } from './BrandAnalysisView';
import { PaletteViewer } from './PaletteViewer';
import { FontViewer } from './FontViewer';

import { LibraryAsset } from '../engine/assets/AssetMetadata';
import { globalAssetDatabase } from '../engine/assets/AssetDatabase';
import { globalBrandEngine, BrandProfile, BrandStyleArchetype } from '../engine/brand/BrandEngine';
import { globalProjectManager } from '../engine/project/ProjectManager';

export function MediaLibrary() {
  const [selectedAsset, setSelectedAsset] = useState<LibraryAsset | null>(null);
  const [activeProfile, setActiveProfile] = useState<BrandProfile | null>(null);
  const [compilerStatus, setCompilerStatus] = useState<string>('Static Mode');
  const [isApplying, setIsApplying] = useState(false);
  const [showStatusStamp, setShowStatusStamp] = useState(false);

  // Trigger default brand analysis on start so the Live Demo starts immediately!
  // It finds the Mercedes vector asset and triggers an analysis.
  useEffect(() => {
    const assets = globalAssetDatabase.getAllAssets();
    const mercedes = assets.find(a => a.name.includes('Mercedes')) || assets[0];
    if (mercedes) {
      setSelectedAsset(mercedes);
      handleAnalyzeBrand(mercedes);
    }
  }, []);

  const handleAnalyzeBrand = (asset: LibraryAsset) => {
    // Generate beautiful brand profile based on asset design style Heuristics
    const prof = globalBrandEngine.analyzeBrandAsset(asset.name, asset.metadata.fileSizeEstimateBytes);
    setActiveProfile(prof);
    setCompilerStatus(`Calibrated and aligned for ${prof.style.toUpperCase()}`);
    globalAssetDatabase.incrementUsage(asset.id);
  };

  const handleApplyToDirector = (profile: BrandProfile) => {
    setIsApplying(true);
    setCompilerStatus('Synthesizing motion DNA rules...');
    
    // Asynchronously model alignment pipeline simulation
    setTimeout(() => {
      // Feed parameters back into active project metadata
      const activeProject = globalProjectManager.getActiveProject();
      if (activeProject) {
        activeProject.metadata.name = profile.name;
        
        // Let's build a customized timeline payload based on the brand's style
        const dnaString = JSON.stringify({
          styleArchetype: profile.style,
          colors: profile.colors.palette.map(c => c.hex),
          motionModifiers: profile.motionSuggestions,
          font: profile.typography.fontFamily
        });
        
        // Store in the active project file
        activeProject.timelineTracks = [
          {
            id: 'track_logo',
            name: `${profile.name} Logo Keyframes`,
            type: 'TRANSFORM',
            muted: false,
            locked: false,
            keyframes: [
              { id: 'kf_logo_1', time: 0, value: { scale: 0.1, rotation: 0 }, easing: 'easeOut' },
              { id: 'kf_logo_2', time: 3, value: { scale: 1.0, rotation: 360 }, easing: 'easeInOut' }
            ]
          },
          {
            id: 'track_camera',
            name: `${profile.motionSuggestions.cameraStyle.split(' ')[0]} Rig Track`,
            type: 'CAMERA_SPEED',
            muted: false,
            locked: false,
            keyframes: [
              { id: 'kf_cam_1', time: 0, value: { zoom: 12 }, easing: 'linear' },
              { id: 'kf_cam_2', time: 5, value: { zoom: 45 }, easing: 'linear' }
            ]
          }
        ];

        // Ensure serialization and listener notifications reload Editor/Timeline
        globalProjectManager.saveActive();
      }

      setIsApplying(false);
      setCompilerStatus(`DNA compilation successful: applied "${profile.name}" specs to Director.`);
      setShowStatusStamp(true);
      setTimeout(() => setShowStatusStamp(false), 4500);
    }, 1500);
  };

  const handleAssetDeleted = (deletedId: string) => {
    if (selectedAsset?.id === deletedId) {
      setSelectedAsset(null);
    }
  };

  return (
    <div id="media_library_root" className="flex-1 flex flex-col h-full bg-[#0a0a0c] overflow-y-auto p-4 md:p-6 space-y-6">
      
      {/* Dynamic Status Notification banner for pipeline triggers */}
      {showStatusStamp && activeProfile && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-4 border-emerald-500 p-4 rounded-r-lg flex items-center justify-between text-xs font-mono text-emerald-400 animate-slide-in shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <div>
              <p className="font-bold">Brand Intelligence Synthesizer Completed successfully!</p>
              <p className="text-[10px] text-neutral-400">Motion OS has generated motion curves, mapped dynamic textures ({activeProfile.motionSuggestions.suggestedMaterials[0]}), loaded font assets ({activeProfile.typography.fontFamily}), and written keyframes.</p>
            </div>
          </div>
          <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
            ACTIVE PIPELINE LIVE
          </span>
        </div>
      )}

      {/* Main Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-850 pb-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Library size={18} className="text-indigo-400 animate-pulse" />
            <h2 className="text-base font-extrabold text-white tracking-tight uppercase">Media Asset Center</h2>
          </div>
          <p className="text-xs text-neutral-500 font-mono">
            Drag vectors or images directly to generate brand profile intelligence and auto-compile target timeline keyframes.
          </p>
        </div>

        {/* Real-time state identifier badge */}
        <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="font-mono text-[10px]">
            <span className="text-neutral-500 block">DNA Pipeline Heuristic State</span>
            <span className="text-neutral-200 font-bold">{compilerStatus}</span>
          </div>
        </div>
      </div>

      {/* Section 1: BRAND INTELLIGENCE log center */}
      {activeProfile ? (
        <div className="space-y-4 shrink-0">
          <BrandAnalysisView 
            profile={activeProfile} 
            onApplyToDirector={handleApplyToDirector}
            isApplying={isApplying}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PaletteViewer palette={activeProfile.colors.palette} />
            <FontViewer typography={activeProfile.typography} />
          </div>
        </div>
      ) : (
        <div className="bg-[#111114] border border-neutral-850 p-6 rounded-lg text-center font-mono text-xs text-neutral-500 space-y-2 shrink-0">
          <Cpu className="mx-auto text-neutral-700 animate-spin" size={24} />
          <p>Please select an SVG/Image asset inside the browser below to trigger full Brand Analysis & Palette profiles.</p>
        </div>
      )}

      {/* Section 2: Split Browser + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Browser & Dropper */}
        <div className="lg:col-span-8 flex flex-col space-y-4 h-[550px]">
          <div className="flex-1 min-h-0">
            <AssetBrowser 
              onAssetSelected={(a) => {
                setSelectedAsset(a);
                handleAnalyzeBrand(a);
              }}
              selectedAssetId={selectedAsset?.id}
              onAnalyzeBrand={handleAnalyzeBrand}
              analysisAssetId={selectedAsset?.id}
            />
          </div>
          <div className="shrink-0">
            <UploadPanel 
              onUploadSuccess={(imported) => {
                setSelectedAsset(imported);
                handleAnalyzeBrand(imported);
              }}
              activeFolder={selectedAsset?.metadata.folderPath || '/Root'}
            />
          </div>
        </div>

        {/* Right Side: Inspector Details */}
        <div className="lg:col-span-4 min-w-0">
          {selectedAsset ? (
            <AssetInspector 
              asset={selectedAsset}
              onAssetModified={() => setSelectedAsset({ ...selectedAsset })}
              onDeleted={handleAssetDeleted}
            />
          ) : (
            <div className="bg-[#121214] border border-neutral-800 rounded-lg p-6 text-center text-xs font-mono text-neutral-500">
              No asset selected. Click any asset above to inspect parameters, tag keys, and file optimizations.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
