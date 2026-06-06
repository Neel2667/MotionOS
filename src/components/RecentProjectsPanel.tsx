import { RecentProjectRecord } from '../engine/project/RecentProjects';
import { Clock, FolderOpen, Tag, Trash2, Sparkles, ExternalLink } from 'lucide-react';

export interface RecentProjectsPanelProps {
  recentList: RecentProjectRecord[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecentProjectsPanel({ recentList, onSelect, onDelete }: RecentProjectsPanelProps) {
  
  const formatTimeAgo = (ts: number) => {
    const diffMs = Date.now() - ts;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      {recentList.length === 0 ? (
        <div className="p-8 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20">
          <FolderOpen size={24} className="mx-auto text-neutral-600 mb-2" />
          <p className="text-xs">No active projects found. Create a new one above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentList.map(p => (
            <div 
              key={p.id}
              className="bg-[#121214] border border-neutral-850 hover:border-indigo-500/50 rounded-xl p-4.5 flex flex-col justify-between hover:shadow-xl transition relative group overflow-hidden"
            >
              {/* Highlight Ribbon for Luxury */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                p.brandStyle === 'LUXURY' ? 'bg-amber-500' :
                p.brandStyle === 'TECH' ? 'bg-cyan-500' : 'bg-pink-500'
              }`} />

              <div>
                <div className="flex justify-between items-start gap-2 mb-2 pl-2">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-500">
                    ID: {p.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${
                      p.brandStyle === 'LUXURY' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      p.brandStyle === 'TECH' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                      'bg-pink-500/10 border-pink-500/20 text-pink-300'
                    }`}>
                      {p.brandStyle}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white pl-2 group-hover:text-indigo-400 transition">
                  {p.name}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 pl-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-505 pl-2">
                <span className="flex items-center gap-1.5 text-neutral-500 font-mono text-[10px]">
                  <Clock size={12} /> {formatTimeAgo(p.lastModifiedAt)}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 text-neutral-500 transition"
                    title="Delete Project Record"
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    onClick={() => onSelect(p.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-neutral-800 text-white rounded font-medium hover:bg-indigo-600 transition"
                  >
                    <span>Load</span> <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
