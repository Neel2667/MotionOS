import { useState, useEffect, ChangeEvent } from 'react';
import { 
  FolderGit2, Sparkles, Plus, FileUp, Download, Eye, 
  HelpCircle, AlertCircle, Check, Code, Play
} from 'lucide-react';
import { BrandStyle } from '../engine/ai/analyzer/BrandAnalyzer';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { RecentProjectsPanel } from './RecentProjectsPanel';
import { Project } from '../engine/project/Project';

export function ProjectBrowser({ onProjectSelected }: { onProjectSelected?: (id: string) => void }) {
  const [activeProject, setActiveProject] = useState<Project>(() => globalProjectManager.getActiveProject());
  const [recents, setRecents] = useState(() => globalProjectManager.recents.getRecents());

  const [newName, setNewName] = useState('');
  const [newStyle, setNewStyle] = useState<BrandStyle>(BrandStyle.LUXURY);
  const [dnaInput, setDnaInput] = useState('');
  const [dnaImportResult, setDnaImportResult] = useState<{ success?: boolean; msg?: string } | null>(null);

  useEffect(() => {
    // Sync listen
    const unsub = globalProjectManager.registerListener((p) => {
      if (p) {
        setActiveProject({ ...p });
        const text = globalProjectManager.exportMotionDNA();
        setDnaInput(text);
      }
      setRecents(globalProjectManager.recents.getRecents());
    });
    return unsub;
  }, []);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const proj = globalProjectManager.createNew(newName, newStyle);
    setNewName('');
    if (onProjectSelected) onProjectSelected(proj.metadata.id);
  };

  const handleSelectProject = (id: string) => {
    globalProjectManager.loadProjectById(id);
    if (onProjectSelected) onProjectSelected(id);
  };

  const handleDeleteProject = (id: string) => {
    globalProjectManager.recents.removeRecording(id);
    setRecents(globalProjectManager.recents.getRecents());
  };

  const handleExportJSON = () => {
    const json = globalProjectManager.exportProjectJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.metadata.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_project_config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = globalProjectManager.importProjectJSON(text);
      if (res.success) {
        setDnaImportResult({ success: true, msg: 'JSON Config loaded successfully.' });
      } else {
        setDnaImportResult({ success: false, msg: res.error || 'Invalid file structure.' });
      }
    };
    reader.readAsText(file);
  };

  const handleImportDNA = () => {
    const success = globalProjectManager.importMotionDNA(dnaInput);
    if (success) {
      setDnaImportResult({ success: true, msg: 'Motion DNA parameters mapped successfully!' });
      setTimeout(() => setDnaImportResult(null), 3000);
    } else {
      setDnaImportResult({ success: false, msg: 'Motion DNA string has syntax or checksum mismatches.' });
      setTimeout(() => setDnaImportResult(null), 4000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#09090b] text-neutral-200">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-8 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-2">
            <FolderGit2 size={14} className="animate-pulse" /> MotionOS Project &amp; DNA File Manager
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Project Database System</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Locally save/load design sessions, import structured Motion DNA vectors, and inject pre-compiled metadata packages instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-lg font-mono text-neutral-400 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AUTOSAVE ENGINE ACTIVE</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="space-y-8">
        
        {/* Top: Create & Import */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Create New Project */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-850">
              <Plus size={16} className="text-indigo-400 bg-indigo-500/10 p-0.5 rounded" />
              <h2 className="font-semibold text-white tracking-wide text-sm">Spawn Creative Motion Project</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 font-medium font-mono">Clip Stream Label</label>
                <input
                  type="text"
                  placeholder="e.g. Audi Tech Launch Trailer"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-400 font-medium font-mono">Core Brand Style</label>
                <select
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value as BrandStyle)}
                  className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                >
                  {Object.values(BrandStyle).map(v => (
                    <option key={v} value={v}>{v} Design Language</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white tracking-wide selection:bg-transparent shadow-lg shadow-indigo-600/10 transition"
              >
                Assemble &amp; Open
              </button>
            </div>
          </div>

          {/* DNA Serialization Core */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-[#a855f7] bg-[#a855f7]/10 p-0.5 rounded" />
                <h2 className="font-semibold text-white tracking-wide text-sm">Direct Motion DNA stream</h2>
              </div>
              <button 
                onClick={handleExportJSON}
                className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white px-2.5 py-1 rounded flex items-center gap-1 font-mono transition"
              >
                <Download size={11} /> Project Settings Config (.JSON)
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-neutral-500 font-mono block">DNA SCHEMA RE-IMPORT / PARSING UTILITY</span>
              <textarea
                value={dnaInput}
                onChange={(e) => setDnaInput(e.target.value)}
                rows={4}
                className="w-full bg-black border border-neutral-850 rounded-lg p-2.5 font-mono text-[10px] text-emerald-400 focus:outline-none focus:border-emerald-500/50"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleImportDNA}
                  className="flex-1 py-1.5 px-3 bg-[#1c1c1f] hover:bg-neutral-800 border border-neutral-800 hover:text-white text-[11px] font-mono rounded-lg transition"
                >
                  Verify &amp; Inject Active DNA
                </button>
                <label className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] text-neutral-400 hover:text-white hover:border-neutral-700 font-mono cursor-pointer flex items-center justify-center gap-1">
                  <FileUp size={12} /> Import Config
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

              {dnaImportResult && (
                <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  dnaImportResult.success 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                  {dnaImportResult.success ? <Check size={14} /> : <AlertCircle size={14} />}
                  <span>{dnaImportResult.msg}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Middle: Active Project Indicator */}
        <div className="p-4 rounded-xl bg-indigo-950/15 border border-indigo-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold font-mono tracking-widest text-indigo-400 uppercase">ACTIVE PRIMARY ENVIRONMENT</span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{activeProject.metadata.name}</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">{activeProject.sceneState.brandStyle}</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">{activeProject.metadata.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right shrink-0">
              <div className="text-[9px] text-neutral-500 font-mono">STABILIZED SINCE</div>
              <div className="text-xs text-neutral-300 font-mono font-medium">{new Date(activeProject.metadata.lastModifiedAt).toLocaleTimeString()}</div>
            </div>
            <button
              onClick={() => globalProjectManager.saveActive()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-indigo-600/10 transition"
            >
              Export &amp; Pin Snapshot
            </button>
          </div>
        </div>

        {/* Bottom: Recent list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
            <h3 className="font-semibold text-white text-sm">Target Workspace Directories &amp; Recents</h3>
            <span className="text-xs text-neutral-500 font-mono">{recents.length} projects stored</span>
          </div>
          
          <RecentProjectsPanel
            recentList={recents}
            onSelect={handleSelectProject}
            onDelete={handleDeleteProject}
          />
        </div>

      </div>
    </div>
  );
}
export { globalProjectManager };
