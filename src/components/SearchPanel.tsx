import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Box, FolderPlus, Tag, Heart, Calendar, ArrowUpRight, Ban } from 'lucide-react';
import { globalSearchEngine, UnifiedSearchResult } from '../engine/database/SearchEngine';
import { IndexedProject, globalProjectIndex } from '../engine/database/ProjectIndex';
import { IndexedAsset } from '../engine/database/AssetIndex';
import { MotionDNA } from '../engine/database/Database';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { BrandStyle } from '../engine/ai/analyzer/BrandAnalyzer';

export function SearchPanel({ onSelectProject }: { onSelectProject?: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);
  const [results, setResults] = useState<UnifiedSearchResult | null>(null);

  useEffect(() => {
    const res = globalSearchEngine.search({
      query: query || undefined,
      brandStyle: selectedStyle || undefined,
      tag: selectedTag || undefined,
      onlyFavorites: onlyFavs,
      recentlyModifiedOnly: recentOnly,
      type: 'ALL'
    });
    setResults(res);
  }, [query, selectedStyle, selectedTag, onlyFavs, recentOnly]);

  const handleToggleFavProject = (id: string) => {
    globalProjectIndex.toggleFavorite(id);
    // Refresh
    const res = globalSearchEngine.search({
      query: query || undefined,
      brandStyle: selectedStyle || undefined,
      tag: selectedTag || undefined,
      onlyFavorites: onlyFavs,
      recentlyModifiedOnly: recentOnly,
      type: 'ALL'
    });
    setResults(res);
  };

  const loadProject = (projId: string) => {
    globalProjectManager.loadProjectById(projId);
    if (onSelectProject) onSelectProject();
  };

  return (
    <div id="search_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex items-center gap-2">
        <Search className="text-indigo-400" size={16} />
        <h4 className="text-xs font-black uppercase tracking-widest text-neutral-200">Unified DB Search Engine</h4>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, assets, tags, archetypes..."
          className="w-full bg-[#08080a] border border-neutral-800 rounded-lg px-3.5 py-2 pl-9 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <Search className="absolute left-3 top-3 text-neutral-500" size={13} />
      </div>

      {/* Filter Badges */}
      <div className="space-y-2">
        <span className="text-[10px] text-neutral-500 block uppercase font-bold">Fast Filters</span>
        <div className="flex flex-wrap gap-1.5">
          {['Luxury', 'Technology', 'Sports', 'Minimal'].map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold border transition ${
                selectedStyle === style 
                  ? 'bg-indigo-500/10 border-indigo-505 text-indigo-400' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              Style: {style}
            </button>
          ))}
          {['logo', 'neon', 'premium', 'vector', 'clean'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold border transition ${
                selectedTag === tag 
                  ? 'bg-amber-500/10 border-amber-505 text-amber-400' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex gap-4 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-neutral-400">
            <input
              type="checkbox"
              checked={onlyFavs}
              onChange={(e) => setOnlyFavs(e.target.checked)}
              className="rounded border-neutral-800 bg-neutral-950 focus:ring-0 text-indigo-500 w-3 h-3"
            />
            <span>Favorites Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-neutral-400">
            <input
              type="checkbox"
              checked={recentOnly}
              onChange={(e) => setRecentOnly(e.target.checked)}
              className="rounded border-neutral-800 bg-neutral-950 focus:ring-0 text-indigo-500 w-3 h-3"
            />
            <span>Modified Recently</span>
          </label>
        </div>
      </div>

      {/* Query Times */}
      {results && (
        <div className="text-[8px] text-neutral-500 flex justify-between border-t border-neutral-850 pt-2.5">
          <span>INDEX SCAN TIME: {results.queryTimeMs} ms</span>
          <span>RECORDS MATCHED: {results.totalCount}</span>
        </div>
      )}

      {/* Results Container */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {results && results.totalCount === 0 && (
          <div className="text-center py-6 text-neutral-600 text-[10px] space-y-1">
            <Ban size={16} className="mx-auto text-neutral-700" />
            <p>No records located inside this active search query.</p>
          </div>
        )}

        {/* Projects section */}
        {results && results.projects.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">Matched Projects ({results.projects.length})</span>
            {results.projects.map(p => (
              <div key={p.id} className="p-2 bg-black/40 border border-neutral-850 rounded flex items-center justify-between hover:border-neutral-700 transition">
                <div onClick={() => loadProject(p.id)} className="flex-1 min-w-0 cursor-pointer">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-neutral-200 truncate">{p.name}</span>
                    <span className="text-[7px] px-1 bg-indigo-900/40 text-indigo-400 rounded uppercase font-bold">{p.brandStyle}</span>
                  </div>
                  <p className="text-[8px] text-neutral-500 truncate mt-0.5">{p.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleFavProject(p.id)}
                    className={`p-1 hover:text-red-400 transition ${p.isFavorite ? 'text-red-500 animate-pulse' : 'text-neutral-600'}`}
                  >
                    <Heart size={10} fill={p.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={() => loadProject(p.id)}
                    className="p-1 hover:text-white transition text-neutral-500"
                    title="Load Project"
                  >
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assets Section */}
        {results && results.assets.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">Matched Media Assets ({results.assets.length})</span>
            {results.assets.map(a => (
              <div key={a.id} className="p-2 bg-black/40 border border-neutral-855 rounded flex items-center justify-between hover:border-neutral-700 transition text-[9px]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 bg-neutral-900 rounded border border-white/5 flex items-center justify-center shrink-0">
                    <Box size={10} className="text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-neutral-300 truncate font-semibold">{a.name}</p>
                    <p className="text-[7px] text-neutral-500">{a.folder} • {(a.sizeBytes / 1024).toFixed(0)} KB • {a.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {a.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-[7px] text-neutral-500 bg-neutral-900 border border-neutral-850 px-1 rounded">#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MotionDNAs */}
        {results && results.motionDNAs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">MotionDNA Specifications ({results.motionDNAs.length})</span>
            {results.motionDNAs.map(dna => (
              <div key={dna.id} className="p-2 bg-black/40 border border-neutral-855 rounded hover:border-neutral-700 transition text-[9px] space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 px-1 py-0.5 bg-amber-950/20 border border-amber-900/30 text-amber-400 rounded text-[8px] font-bold">
                    <Sparkles size={8} /> {dna.styleArchetype}
                  </div>
                  <span className="text-neutral-200 font-bold">{dna.name}</span>
                </div>
                <div className="flex items-center justify-between text-[8px]">
                  <span className="text-neutral-500">FONT: {dna.font}</span>
                  <div className="flex gap-1">
                    {dna.colors.map(col => (
                      <div key={col} className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: col }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
