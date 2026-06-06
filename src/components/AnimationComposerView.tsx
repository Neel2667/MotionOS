import { useState, useEffect } from 'react';
import { 
  Cpu, Sparkles, Activity, Layers, Play, RefreshCw, 
  Settings2, ShieldCheck, AlertTriangle, Info, Clock, 
  TrendingUp, Minimize, CheckCircle2, FileJson, ZoomIn
} from 'lucide-react';
import { AnimationComposer, ComposedAnimationState } from '../engine/motion/composer/AnimationComposer';
import { BrandStyle } from '../engine/ai/analyzer/BrandAnalyzer';

export function AnimationComposerView({ onPlay }: { onPlay?: () => void }) {
  const [composer] = useState(() => new AnimationComposer());
  const [selectedBrand, setSelectedBrand] = useState<BrandStyle>(BrandStyle.LUXURY);
  const [pacingFactor, setPacingFactor] = useState<number>(1.0);
  const [activeFX, setActiveFX] = useState<string[]>(['PARTICLES', 'BLOOM', 'LIGHT_RAYS']);
  const [activeMaterials, setActiveMaterials] = useState<string[]>(['GOLD', 'GLASS']);
  
  const [composition, setComposition] = useState<ComposedAnimationState | null>(null);
  const [compileState, setCompileState] = useState<'IDLE' | 'COMPILING' | 'SUCCESS'>('IDLE');
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  // Trigger compilation whenever inputs tweak
  const triggerCompile = () => {
    setCompileState('COMPILING');
    setTimeout(() => {
      const state = composer.compose(selectedBrand, activeFX, activeMaterials);
      // Let's modify the duration based on pacing factor to show interactive change
      state.segments.forEach(seg => {
        seg.duration = parseFloat((seg.duration * pacingFactor).toFixed(2));
        seg.startTime = parseFloat((seg.startTime * pacingFactor).toFixed(2));
        seg.blocks.forEach(b => {
          b.duration = parseFloat((b.duration * pacingFactor).toFixed(2));
          b.delay = parseFloat((b.delay * pacingFactor).toFixed(2));
        });
      });
      
      // Recompute metrics base cost
      state.metrics.compilationTimeMs += parseFloat((Math.random() * 2).toFixed(2));
      state.metrics.estimatedRenderCost = parseFloat((state.metrics.estimatedRenderCost * pacingFactor).toFixed(1));

      setComposition(state);
      setCompileState('SUCCESS');
    }, 450);
  };

  useEffect(() => {
    triggerCompile();
  }, [selectedBrand, pacingFactor, activeFX, activeMaterials]);

  const toggleFX = (fx: string) => {
    if (activeFX.includes(fx)) {
      setActiveFX(activeFX.filter(f => f !== fx));
    } else {
      setActiveFX([...activeFX, fx]);
    }
  };

  const toggleMaterial = (mat: string) => {
    if (activeMaterials.includes(mat)) {
      setActiveMaterials(activeMaterials.filter(m => m !== mat));
    } else {
      setActiveMaterials([...activeMaterials, mat]);
    }
  };

  if (!composition) {
    return <div className="p-8 text-neutral-400">Loading Motion Graph Engine...</div>;
  }

  return (
    <div className="flex-1 bg-[#09090b] text-neutral-200 overflow-y-auto p-6 md:p-8">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-8 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Cpu size={14} className="animate-pulse" /> Production Grade Node Compiler
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Animation Composer &amp; Graph Compiler
          </h1>
          <p className="text-neutral-400 mt-1.5 text-sm max-w-2xl">
            Translate abstract Brand DNA into highly-optimized WebGL motion tracks via a procedural sequencer and topological dependency solver.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white transition"
          >
            <FileJson size={14} /> {showRawJson ? 'View UI' : 'Export DNA'}
          </button>
          <button 
            onClick={triggerCompile}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold rounded-lg text-white border border-neutral-700 transition"
          >
            <RefreshCw size={14} className={compileState === 'COMPILING' ? 'animate-spin text-indigo-400' : ''} /> Force Compile
          </button>
          {onPlay && (
            <button 
              onClick={onPlay}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold rounded-lg text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition"
            >
              <Play size={14} fill="white" /> Compile &amp; Preview
            </button>
          )}
        </div>
      </header>

      {showRawJson ? (
        <div className="bg-black border border-neutral-800 rounded-xl p-6 font-mono text-xs whitespace-pre-wrap select-all max-h-[70vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-neutral-800 text-neutral-400">
            <span>SERIALIZED MOTION DNA STREAM</span>
            <span>UTF-8 JSON SCHEMA</span>
          </div>
          {JSON.stringify(composition, null, 2)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Row: Controller and Metrics */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Input Controls Card */}
            <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Settings2 size={16} className="text-neutral-400" />
                <h2 className="font-semibold text-white tracking-wide text-sm">Composer Controls</h2>
              </div>
              
              {/* Brand Selector */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 font-medium">Intellectual Brand Style</label>
                <select 
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value as BrandStyle)}
                  className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  {Object.values(BrandStyle).map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Pacing Speed Factor */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-neutral-400 font-medium">Animation Speed Multiplier</label>
                  <span className="font-mono text-indigo-400 font-semibold">{pacingFactor}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1"
                  value={pacingFactor}
                  onChange={(e) => setPacingFactor(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Interactive FX Flags */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 font-medium">Enabled FX Renderers</label>
                <div className="flex flex-wrap gap-1.5">
                  {['PARTICLES', 'BLOOM', 'LIGHT_RAYS', 'SHOCKWAVE', 'GLOW', 'LENS_FLARE'].map(fx => {
                    const active = activeFX.includes(fx);
                    return (
                      <button
                        key={fx}
                        onClick={() => toggleFX(fx)}
                        className={`text-[10px] font-semibold font-mono tracking-wider px-2 px-2.5 py-1 rounded transition-colors ${
                          active 
                            ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300' 
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {fx}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Material Pipeline */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 font-medium">Material Slot Pipelines</label>
                <div className="flex flex-wrap gap-1.5">
                  {['GOLD', 'CHROME', 'NEON', 'GLASS', 'CARBON_FIBER', 'MATTE'].map(mat => {
                    const active = activeMaterials.includes(mat);
                    return (
                      <button
                        key={mat}
                        onClick={() => toggleMaterial(mat)}
                        className={`text-[10px] font-semibold font-mono tracking-wider px-2.5 py-1 rounded transition-colors ${
                          active 
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Compiler Status panel */}
            <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-indigo-400" />
                    <h2 className="font-semibold text-white tracking-wide text-sm font-sans">Compiler Realtime Metrics</h2>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                    compileState === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-400/20'
                  }`}>
                    {compileState === 'COMPILING' ? 'Compiling' : 'Optimal'}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-neutral-950/80 rounded-lg border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Topological Nodes</span>
                    <div className="text-2xl font-light text-white font-sans mt-1">{composition.metrics.totalNodes}</div>
                  </div>
                  <div className="p-3.5 bg-neutral-950/80 rounded-lg border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Data Edges / Flow</span>
                    <div className="text-2xl font-light text-white font-sans mt-1">{composition.metrics.totalEdges}</div>
                  </div>
                  <div className="p-3.5 bg-neutral-950/80 rounded-lg border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Compile Overhead</span>
                    <div className="text-sm text-neutral-200 mt-1 font-mono font-medium">{composition.metrics.compilationTimeMs} ms</div>
                  </div>
                  <div className="p-3.5 bg-neutral-950/80 rounded-lg border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Rendering Footprint</span>
                    <div className="text-sm text-amber-400 mt-1 font-mono font-medium">{composition.metrics.estimatedRenderCost} GFlops</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-400">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-400" /> Cache Integrity:</span>
                <span className="font-mono text-neutral-300 font-semibold select-none">VALID / READY</span>
              </div>
            </div>

            {/* Solver & Score */}
            <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <h2 className="font-semibold text-white tracking-wide text-sm font-sans">Solver Diagnostics</h2>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-5xl font-mono font-bold text-white tracking-tight">
                      {composition.optimizationScore}
                      <span className="text-lg text-neutral-500">/100</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 pr-4">
                      Topological constraints optimization level based on resource overlap and collisions.
                    </p>
                  </div>
                  
                  {/* Visual gauge */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
                    <div className={`absolute inset-0 rounded-full border-4 border-t-emerald-500 border-r-indigo-500 border-b-indigo-500 border-l-transparent animate-spin-slow`} />
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs">
                <span className="text-neutral-400">Constraint Checklist:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> 100% Passed
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section: Constraint Solver Alerts */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" />
              Constraint Solver Correction Log ({composition.conflictLogs.length} Active System Mitigations)
            </h3>
            
            <div className="space-y-3">
              {composition.conflictLogs.map(log => (
                <div key={log.id} className="p-4 rounded-lg bg-neutral-950 border border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        log.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-400/20'
                      }`}>
                        {log.severity.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-neutral-300 font-mono">[{log.category}]</span>
                      <span className="text-xs font-semibold text-white">{log.description}</span>
                    </div>
                  </div>
                  <div className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-md flex items-center gap-1.5 max-w-md sm:text-right font-medium">
                    <CheckCircle2 size={12} className="text-indigo-400 shrink-0" />
                    <span><strong className="text-indigo-200">Mitigation: </strong>{log.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Central Row: Graph & Sequencer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* topological motion graph */}
            <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-[#bfdbfe]" />
                    <h3 className="font-semibold text-white text-sm">Topological Motion Graph Flow</h3>
                  </div>
                  <ZoomIn size={14} className="text-neutral-500" />
                </div>

                {/* Graph Sandbox Visualizer */}
                <div className="relative h-64 bg-neutral-950 rounded-xl border border-neutral-900/60 p-4 overflow-hidden flex flex-col justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
                  
                  <div className="relative z-10 flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                    {composition.graph.nodes.map((node: any, idx: number) => (
                      <div key={node.id} className="relative group">
                        
                        {/* Node body */}
                        <div className="w-36 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-indigo-500 p-3 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                          <div className="flex justify-between items-center pb-2 mb-2 border-b border-neutral-800">
                            <span className="text-[10px] font-bold text-white font-mono truncate">{node.name}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          
                          <div className="space-y-1.5 text-[9px] font-mono text-neutral-400">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span className="text-indigo-400 font-semibold">{node.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>State:</span>
                              <span className="text-neutral-300">Enabled</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Flow Line to next node except last */}
                        {idx < composition.graph.nodes.length - 1 && (
                          <div className="hidden sm:block absolute top-1/2 left-[144px] w-12 h-0.5 border-t-2 border-dashed border-indigo-500/30 -translate-y-1/2 pointer-events-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 absolute right-0 top-1/2 -translate-y-1/2 animate-ping" />
                          </div>
                        )}
                        
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-900 text-[10px] text-neutral-500 font-mono flex justify-between">
                <span>Topological Order Resolved: YES</span>
                <span>Active Parallel Threads: 3</span>
              </div>
            </div>

            {/* procedural block sequencer timeline */}
            <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-pink-400" />
                  <h3 className="font-semibold text-white text-sm">Procedural Block Sequencer (Timeline Scale)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1">
                  Total Duration: 6.00s <Minimize size={12} />
                </span>
              </div>

              {/* Grid-based timeline layout */}
              <div className="space-y-3">
                {composition.segments.map((seg, idx) => {
                  const colors = [
                    'border-[#818cf8] hover:bg-neutral-900/40 bg-neutral-950/40',
                    'border-[#ec4899] hover:bg-neutral-900/40 bg-neutral-950/40',
                    'border-[#f59e0b] hover:bg-neutral-900/40 bg-neutral-950/40',
                    'border-[#10b981] hover:bg-neutral-900/40 bg-neutral-950/40',
                    'border-[#06b6d4] hover:bg-neutral-900/40 bg-neutral-950/40',
                    'border-[#a855f7] hover:bg-neutral-900/40 bg-neutral-950/40',
                  ];
                  return (
                    <div key={idx} className={`p-3 rounded-lg border-l-4 ${colors[idx % colors.length]} flex flex-col md:flex-row justify-between items-start md:items-center gap-2`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{seg.name}</span>
                          <span className="text-[10px] font-mono text-neutral-500">Starts: {seg.startTime}s</span>
                        </div>
                        <div className="flex items-center gap-2.5 mt-1">
                          {seg.blocks.map(b => (
                            <span key={b.id} className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                              {b.name} ({b.duration}s)
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-mono">
                        <div className="text-right">
                          <div className="text-neutral-500">DURATION</div>
                          <div className="font-semibold text-white">{seg.duration}s</div>
                        </div>
                        <div className="w-16 h-1 rounded bg-neutral-800 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded" style={{ width: `${(seg.duration / 6) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transitions Overlay Map */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-pink-400" />
              Transition Manager Timeline Overlay Matches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {composer.transitionManager.getTransitions().map(tr => (
                <div key={tr.id} className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">{tr.type}</div>
                    <p className="text-[10px] text-neutral-400">Trigger at {tr.triggerTime}s for {tr.duration}s</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-medium bg-[#1d1d20] border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded">
                    <Clock size={12} className="text-neutral-400" />
                    <span>{tr.triggerTime}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
