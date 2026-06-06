import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

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
    { name: 'Export Pipeline', status: 'Planned', version: 'Pending' }
  ];

  if (view !== 'HOME') {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-neutral-400">
         <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
           {/* Placeholder icon space */}
         </div>
         <h2 className="text-xl font-medium text-white tracking-tight">{view}</h2>
         <p className="mt-2 font-mono text-xs text-neutral-500">MODULE_IN_DEVELOPMENT</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#0d0d0d]">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold text-white tracking-tight">MotionOS Dashboard</h1>
        <p className="text-neutral-500 mt-2">Next-generation procedural motion graphics engine.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statuses.map(item => {
          const isComplete = item.status === 'Completed';
          return (
            <div key={item.name} className="bg-[#141414] border border-neutral-800/60 rounded-xl p-5 hover:border-neutral-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-white">{item.name}</h3>
                {isComplete ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} className="text-neutral-600" />
                )}
              </div>
              <div className="flex justify-between items-end">
                <span className={`text-xs font-mono px-2 py-1 rounded bg-black/40 border border-white/5 ${isComplete ? 'text-emerald-400/80' : 'text-neutral-500'}`}>
                  {item.status.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-neutral-600">
                  {item.version}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex flex-col gap-2 relative z-10 w-full md:w-2/3">
          <h3 className="text-xl font-semibold text-white">Editor Ready</h3>
          <p className="text-sm text-indigo-200/60 leading-relaxed">
            The Timeline, Layer, Node, and Render components have been mapped to the UI. Switch to the Editor to begin visually navigating your Motion DNA scenes.
          </p>
        </div>
        <div className="mt-6 md:mt-0 relative z-10 flex gap-4">
           {setCurrentView && (
             <button 
               onClick={() => setCurrentView('AI_DIRECTOR')}
               className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition font-medium text-sm border border-neutral-700"
             >
               Open AI Director
             </button>
           )}
           <button 
             onClick={() => setCurrentView && setCurrentView('EDITOR')}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition font-medium text-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]"
           >
             Launch Editor <ArrowRight size={16} />
           </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 top-0 w-64 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
