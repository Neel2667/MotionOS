import { CheckCircle2, Circle, ArrowRight, Heart, Activity, Milestone, Database } from 'lucide-react';

export function DashboardView({ view, setCurrentView }: { view: string, setCurrentView?: (v: string) => void }) {
  const statuses = [
    { name: 'Runtime Engine', status: 'Completed', version: 'v0.6.0' },
    { name: 'Autonomous Motion Generator', status: 'Completed', version: 'v1.0.0' },
    { name: 'Animation Composer', status: 'Completed', version: 'v1.0.0' },
    { name: 'Motion Graph', status: 'Completed', version: 'v1.0.0' },
    { name: 'Compiler', status: 'Completed', version: 'v1.0.0' },
    { name: 'Sequencer', status: 'Completed', version: 'v1.0.0' },
    { name: 'Constraint Solver', status: 'Completed', version: 'v1.0.0' },
    { name: 'Timeline Engine', status: 'Completed', version: 'v0.7.0' },
    { name: 'AI Director', status: 'Completed', version: 'v0.8.0' },
    { name: 'Motion DNA', status: 'Completed', version: 'v0.8.0' },
    { name: 'Scene Builder', status: 'Completed', version: 'v0.9.0' },
    { name: 'Composition', status: 'Completed', version: 'v0.9.0' },
    { name: 'Camera Intelligence', status: 'Completed', version: 'v0.11.0' },
    { name: 'FX Graph', status: 'Completed', version: 'v0.12.0' },
    { name: 'Material Graph', status: 'Completed', version: 'v0.12.0' },
    { name: 'Lighting Engine', status: 'Completed', version: 'v0.12.0' },
    { name: 'Render Pipeline', status: 'Completed', version: 'v0.12.0' },
    { name: 'Export Pipeline', status: 'Completed', version: 'v1.0.0' },
    { name: 'Asset Pipeline & Database', status: 'Completed', version: 'v1.6.0' },
    { name: 'Brand Intelligence & Decoupler', status: 'Completed', version: 'v1.6.0' },
    { name: 'Workspace SQL Database', status: 'Completed', version: 'v1.7.0' },
    { name: 'Project & Asset Indexers', status: 'Completed', version: 'v1.7.0' },
    { name: 'Snapshot Version Control', status: 'Completed', version: 'v1.7.0' },
    { name: 'Collaborative State Feed', status: 'Completed', version: 'v1.7.0' }
  ];

  const completedCount = statuses.filter(s => s.status === 'Completed').length;
  const completionPercentage = Math.round((completedCount / statuses.length) * 100);

  if (view !== 'HOME') {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-neutral-400">
         <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
           <Activity className="text-indigo-400 animate-pulse" size={24} />
         </div>
         <h2 className="text-xl font-medium text-white tracking-tight">{view}</h2>
         <p className="mt-2 font-mono text-xs text-neutral-500">MODULE_IN_DEVELOPMENT</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#0d0d0d] select-none text-neutral-300">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">MotionOS Dashboard</h1>
          <p className="text-neutral-500 mt-2">Next-generation procedural motion graphics engine with relational indices and snapshots version control.</p>
        </div>

        {/* Global Stats bar */}
        <div className="flex gap-4">
          <div className="bg-[#121214] border border-neutral-800 p-4 rounded-lg min-w-32">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Engine Completion</span>
            <p className="text-xl font-black text-indigo-400 font-mono mt-0.5">{completionPercentage}%</p>
          </div>
          <div className="bg-[#121214] border border-[#1b3a24] bg-emerald-950/10 p-4 rounded-lg min-w-32">
            <span className="text-[10px] font-mono text-emerald-600 uppercase">System Health</span>
            <p className="text-emerald-400 text-xl font-black font-mono mt-0.5">SANITY_OK</p>
          </div>
        </div>
      </header>

      {/* Grid of statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {statuses.map(item => {
          const isComplete = item.status === 'Completed';
          return (
            <div key={item.name} className="bg-[#141414] border border-neutral-800/60 rounded-xl p-4 hover:border-neutral-700 transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-mono text-[11px] font-bold text-neutral-200 tracking-tight leading-snug line-clamp-1">{item.name}</h3>
                {isComplete ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle size={13} className="text-neutral-600 shrink-0" />
                )}
              </div>
              <div className="flex justify-between items-end">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/5 ${isComplete ? 'text-emerald-400/85' : 'text-neutral-500'}`}>
                  {item.status.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono text-neutral-600">
                  {item.version}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Milestone & Project quick-access section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-5 font-mono">
        
        {/* Editor CTA card */}
        <div className="md:col-span-8 bg-indigo-950/15 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-lg font-semibold text-white">Editor Console & DB Primed</h3>
            <p className="text-xs text-indigo-200/70 leading-relaxed max-w-xl">
              Timeline tracks, keyframe interpolators, real-time audio systems, and physics boundary rules are fully integrated. Ingest brand materials inside the Asset library to see live procedural Motion DNA generations and save manual snapshots in the Database console!
            </p>
          </div>
          
          <div className="mt-6 relative z-10 flex gap-3">
             {setCurrentView && (
               <button 
                 onClick={() => setCurrentView('WORKSPACE')}
                 className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded hover:bg-neutral-800 transition font-mono text-xs"
               >
                 <Database size={13} className="text-indigo-400 shrink-0" /> Open Database Console
               </button>
             )}
             <button 
               onClick={() => setCurrentView && setCurrentView('EDITOR')}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition font-mono text-xs font-bold shadow-lg shadow-indigo-950/30"
             >
               Launch Editor Panel <ArrowRight size={13} />
             </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-44 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        </div>

        {/* Upcoming Milestones box */}
        <div className="md:col-span-4 bg-[#121214] border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-500">
              <Milestone size={14} className="animate-bounce" />
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8e9099]">Roadmap targets</h4>
            </div>
            
            <div className="mt-4 space-y-2.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-300 font-mono">Milestone 16: Brand Intelligence</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-300 font-mono">Milestone 17: Relational Nodes DB</p>
              </div>
              <div className="flex items-start gap-2">
                <Circle size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-500 font-mono">Milestone 18: Real-time Multi-user</p>
              </div>
            </div>
          </div>

          <p className="text-[9px] font-mono text-neutral-600 mt-4 leading-relaxed">
            All system processes fully synchronized to host container ports.
          </p>
        </div>

      </div>

    </div>
  );
}
