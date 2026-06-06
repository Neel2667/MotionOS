import React, { useState, useEffect } from 'react';
import { Search, Folder, Heart, ArrowUpDown, Filter, Sparkles, FolderOpen, Play, Check } from 'lucide-react';
import { SortField, SortOrder } from '../engine/assets/AssetDatabase';
import { LibraryAsset } from '../engine/assets/AssetMetadata';
import { globalAssetDatabase } from '../engine/assets/AssetDatabase';
import { globalAssetRegistry } from '../engine/assets/AssetRegistry';

interface AssetBrowserProps {
  onAssetSelected: (asset: LibraryAsset) => void;
  selectedAssetId?: string;
  onAnalyzeBrand: (asset: LibraryAsset) => void;
  analysisAssetId?: string;
}

export function AssetBrowser({ onAssetSelected, selectedAssetId, onAnalyzeBrand, analysisAssetId }: AssetBrowserProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'IMAGES', 'VECTORS', 'VIDEOS', 'FONTS'
  const [folderFilter, setFolderFilter] = useState('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  
  const [sortField, setSortField] = useState<SortField>('DATE');
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');

  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [folders, setFolders] = useState<string[]>([]);

  // Listen to alterations inside the database state
  useEffect(() => {
    const unsubscribe = globalAssetDatabase.registerListener(() => {
      syncAssets();
    });
    return () => unsubscribe();
  }, [search, typeFilter, folderFilter, onlyFavorites, sortField, sortOrder]);

  const syncAssets = () => {
    const list = globalAssetDatabase.query({
      search,
      typeFilter,
      folderFilter,
      onlyFavorites,
      sortField,
      sortOrder
    });
    setAssets(list);
    setFolders(globalAssetDatabase.getUniqueFolders());
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    globalAssetDatabase.toggleFavorite(id);
    syncAssets();
  };

  const getFormatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div id="asset_browser_root" className="flex flex-col h-full bg-[#0e0e11] rounded-lg border border-neutral-800 overflow-hidden text-xs">
      
      {/* Filters Toolbar */}
      <div className="p-3 border-b border-neutral-850 bg-[#121215] space-y-3 shrink-0">
        
        {/* Search & Sort line */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={12} className="absolute left-2.5 top-2.5 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search library, tags, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#09090b] border border-neutral-800 rounded px-8 py-1.5 font-mono text-[11px] text-neutral-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
              <ArrowUpDown size={10} /> Sort:
            </span>
            <select 
              value={sortField} 
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-[#09090b] border border-neutral-800 text-[10px] font-mono text-neutral-400 p-1.5 px-2 rounded focus:outline-none"
            >
              <option value="DATE">Uploaded On</option>
              <option value="NAME">Filename</option>
              <option value="SIZE">Footprint Size</option>
              <option value="TYPE">Extension Type</option>
              <option value="USAGE">Usage Metrics</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="p-1.5 bg-[#09090b] text-[10px] text-neutral-400 font-bold font-mono border border-neutral-800 rounded hover:text-white"
              title="Toggle Sort Directions"
            >
              {sortOrder}
            </button>
          </div>
        </div>

        {/* Categories, folders, and favorites checklist */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          
          {/* Group 1: General Category Badges */}
          <div className="flex bg-[#09090b] p-0.5 rounded border border-neutral-800/80 font-mono text-[9px] font-semibold text-neutral-500 select-none">
            {['ALL', 'IMAGES', 'VECTORS', 'VIDEOS', 'FONTS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTypeFilter(cat)}
                className={`px-2 py-1 rounded transition-all ${
                  typeFilter === cat 
                    ? 'bg-neutral-800 text-neutral-200' 
                    : 'hover:text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Folder Select */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-neutral-500 flex items-center gap-0.5">
                <Folder size={10} /> Folder:
              </span>
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                className="bg-[#09090b] border border-neutral-800 text-[10px] font-mono text-neutral-400 p-1 rounded focus:outline-none"
              >
                <option value="ALL">All Directories</option>
                {folders.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Favorite check box */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`p-1 px-2 border rounded font-mono text-[10px] flex items-center gap-1 transition-all ${
                onlyFavorites 
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                  : 'bg-[#09090b] border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Heart size={10} className={onlyFavorites ? 'fill-current' : ''} /> Favs
            </button>
          </div>

        </div>

      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto p-4 content-start">
        {assets.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 border-2 border-dashed border-neutral-850 rounded-xl bg-[#111114]/40">
            <FolderOpen size={24} className="text-neutral-600 animate-pulse" />
            <p className="text-neutral-400 text-xs font-mono">No matching media files in current workspace query</p>
            <p className="text-neutral-600 text-[10px] font-mono">Try clearing searching descriptors or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {assets.map((asset) => {
              const isSelected = selectedAssetId === asset.id;
              const isAnalyzed = analysisAssetId === asset.id;
              const isVector = asset.type === 'SVG' || asset.type === 'PDF';
              const isRaster = asset.type === 'PNG' || asset.type === 'JPEG' || asset.type === 'WEBP';
              
              return (
                <div
                  key={asset.id}
                  onClick={() => onAssetSelected(asset)}
                  className={`group relative bg-[#131316] border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition select-none ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20' 
                      : 'border-neutral-800/80 hover:border-neutral-700 hover:bg-[#18181c]'
                  }`}
                >
                  
                  {/* Top Action Ribbon */}
                  <div className="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {/* Favorite directly */}
                    <button
                      onClick={(e) => handleToggleFavorite(asset.id, e)}
                      className="p-1 rounded bg-[#0d0d10]/90 border border-neutral-800 text-neutral-400 hover:text-rose-500"
                    >
                      <Heart size={10} className={asset.metadata.isFavorite ? 'fill-current text-rose-500' : ''} />
                    </button>
                    
                    {/* Analyze directly if it's dynamic media */}
                    {(isVector || isRaster) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeBrand(asset);
                        }}
                        className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500"
                        title="Analyze Brand Signature"
                      >
                        <Sparkles size={10} />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full h-24 bg-neutral-950/70 rounded flex items-center justify-center p-1.5 border border-neutral-850/50 mb-2 relative group-hover:bg-neutral-950/90 transition-colors">
                    <img 
                      src={asset.thumbnailUrl} 
                      alt={asset.name} 
                      className="max-h-full max-w-full object-contain pointer-events-none rounded select-none"
                    />

                    {/* Active Brand Analysis Badge Indicator */}
                    {isAnalyzed && (
                      <div className="absolute top-1 left-1 bg-indigo-500 text-white rounded p-0.5 border border-indigo-400 flex items-center gap-0.5 text-[8px] font-mono tracking-widest leading-none font-bold">
                        <Check size={8} /> BRAND ACTIVE
                      </div>
                    )}
                  </div>

                  {/* Info Row */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[8px] font-mono tracking-wider font-semibold text-neutral-500">
                        {asset.type}
                      </span>
                      <span className="text-[8px] font-mono text-neutral-500">
                        {getFormatBytes(asset.metadata.fileSizeEstimateBytes)}
                      </span>
                    </div>

                    <p className="text-[10px] font-medium text-neutral-300 truncate tracking-tight group-hover:text-white" title={asset.name}>
                      {asset.name}
                    </p>

                    <div className="flex items-center gap-1 truncate opacity-80">
                      {asset.metadata.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[8px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-850 px-1 rounded-full truncate">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
