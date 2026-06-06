import React, { useState } from 'react';
import { Tag, Trash2, Heart, FolderPlus, Compass, AlertTriangle, ShieldCheck, Plus, Check } from 'lucide-react';
import { LibraryAsset } from '../engine/assets/AssetMetadata';
import { globalAssetDatabase } from '../engine/assets/AssetDatabase';
import { globalAssetOptimizer } from '../engine/assets/AssetOptimizer';

interface AssetInspectorProps {
  asset: LibraryAsset;
  onAssetModified?: () => void;
  onDeleted?: (id: string) => void;
}

export function AssetInspector({ asset, onAssetModified, onDeleted }: AssetInspectorProps) {
  const [newTag, setNewTag] = useState('');
  const [activeFolderInput, setActiveFolderInput] = useState(asset.metadata.folderPath);
  const [isTagsEdits, setIsTagsEdits] = useState(false);

  // Parse file format size standard
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Process manual Tag Addition
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    globalAssetDatabase.addTagToAsset(asset.id, newTag);
    setNewTag('');
    onAssetModified?.();
  };

  const handleRemoveTag = (tag: string) => {
    globalAssetDatabase.removeTagFromAsset(asset.id, tag);
    onAssetModified?.();
  };

  const handleToggleFavorite = () => {
    globalAssetDatabase.toggleFavorite(asset.id);
    onAssetModified?.();
  };

  const handleMoveFolder = (newFolder: string) => {
    globalAssetDatabase.moveAssetFolder(asset.id, newFolder);
    setActiveFolderInput(newFolder);
    onAssetModified?.();
  };

  const handleDelete = () => {
    globalAssetDatabase.removeAsset(asset.id);
    onDeleted?.(asset.id);
  };

  // Run dynamic heuristics optimizer evaluations
  const opt = globalAssetOptimizer.evaluate(
    asset.name,
    asset.type,
    asset.metadata.dimensions,
    asset.metadata.fileSizeEstimateBytes
  );

  return (
    <div id="asset_inspector_root" className="bg-[#121214] border border-neutral-800 rounded-lg p-4 space-y-5 select-none text-xs">
      
      {/* Title Asset Information */}
      <div className="flex items-start justify-between pb-3 border-b border-neutral-850">
        <div className="space-y-0.5 truncate max-w-[70%]">
          <span className="text-[8px] font-mono tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase border border-indigo-500/20">
            {asset.type}
          </span>
          <h4 className="text-sm font-bold text-neutral-200 mt-1.5 truncate" title={asset.name}>{asset.name}</h4>
        </div>

        {/* Favorite & Delete Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded transition border ${
              asset.metadata.isFavorite 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/30' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Toggle Favorite"
          >
            <Heart size={13} className={asset.metadata.isFavorite ? 'fill-current' : ''} />
          </button>
          
          <button 
            onClick={handleDelete}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition"
            title="Delete Permanently"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Visual Asset Thumbnail Preview Card */}
      <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-850 flex items-center justify-center h-28 overflow-hidden relative group">
        <img 
          src={asset.thumbnailUrl} 
          alt={asset.name} 
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain rounded-md select-none pointer-events-none" 
        />
        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur px-2 py-0.5 rounded border border-neutral-800">
          <span className="font-mono text-[9px] text-neutral-400">{formatBytes(asset.metadata.fileSizeEstimateBytes)}</span>
        </div>
      </div>

      {/* Basic System Stats */}
      <div className="grid grid-cols-2 gap-2 bg-[#17171b]/50 p-3 rounded-md border border-neutral-850">
        <div>
          <span className="text-[9px] font-mono text-neutral-500 uppercase">Usage Counter</span>
          <p className="text-[11px] font-mono font-medium text-neutral-300 mt-0.5">{asset.metadata.usageCount} Timelines</p>
        </div>
        <div>
          <span className="text-[9px] font-mono text-neutral-500 uppercase">Added On</span>
          <p className="text-[11px] font-mono font-medium text-neutral-300 mt-0.5">
            {new Date(asset.metadata.uploadedAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
          </p>
        </div>
      </div>

      {/* Folder Placement */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-mono text-neutral-500 uppercase block">Media Workspace Directory</span>
        <div className="flex gap-1.5">
          <input 
            type="text" 
            value={activeFolderInput}
            onChange={(e) => setActiveFolderInput(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-[10px] font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="button"
            onClick={() => handleMoveFolder(activeFolderInput)}
            className="px-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded flex items-center gap-1 text-[10px] active:scale-95 transition"
          >
            <FolderPlus size={11} /> Move
          </button>
        </div>
      </div>

      {/* Real-time Custom Tagging Panel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-neutral-500 uppercase">Interactive Meta Tags</span>
          <button 
            onClick={() => setIsTagsEdits(!isTagsEdits)}
            className="text-[9px] font-mono text-indigo-400 hover:underline"
          >
            {isTagsEdits ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {asset.metadata.tags.map(t => (
            <span 
              key={t} 
              className="text-[9px] font-mono bg-neutral-900 border border-neutral-850 text-neutral-300 px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              #{t}
              {isTagsEdits && (
                <button onClick={() => handleRemoveTag(t)} className="text-neutral-500 hover:text-red-400 text-[10px] font-bold">×</button>
              )}
            </span>
          ))}
        </div>

        <form onSubmit={handleAddTag} className="flex gap-1.5 pt-1">
          <input 
            type="text" 
            placeholder="Add specific tags..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-850 rounded px-2.5 py-1 text-[10px] font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="submit"
            className="p-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded"
          >
            <Plus size={12} />
          </button>
        </form>
      </div>

      {/* Asset Optimization Section */}
      <div className="bg-[#17171a] border border-neutral-850 rounded-lg p-3 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Compass size={12} className="text-amber-500 animate-pulse" />
          <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Optimization Matrix</h5>
        </div>

        {opt.warnings.length === 0 ? (
          <div className="flex items-center gap-1.5 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
            <ShieldCheck size={11} className="text-emerald-500 shrink-0" />
            <p className="text-[9px] text-emerald-400/90 font-mono">Pruned and fully compliant. Ready to bake into timeline renders.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {opt.warnings.map((w, idx) => (
              <div key={idx} className="flex items-start gap-1 bg-amber-500/5 p-1.5 rounded border border-amber-500/10 text-amber-400/95 font-mono text-[9px] leading-relaxed">
                <AlertTriangle size={10} className="shrink-0 mt-0.5 mr-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Compression Suggestion Details */}
        {opt.suggestions.length > 0 && (
          <div className="space-y-1 bg-neutral-950 p-2 rounded border border-neutral-850 font-mono text-[9px] text-neutral-400 leading-snug">
            <span className="text-neutral-500 uppercase text-[8px] font-bold">Automation Trajectory</span>
            {opt.suggestions.map((s, idx) => (
              <p key={idx} className="flex items-center gap-1">
                <span className="text-amber-500">•</span> {s}
              </p>
            ))}
            <div className="pt-2 border-t border-neutral-900 flex justify-between items-center mt-1">
              <span>Potential reduction:</span>
              <span className="text-emerald-400 font-bold font-mono">{opt.reductionPercentage}%</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
