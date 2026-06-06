import { useState, useEffect } from 'react';
import { BrainCircuit, Search, Sparkles, Layers, Zap, Video, Move, ArrowRight, Wand2, Orbit, Play } from 'lucide-react';

export function AIDirectorView({ onPlay }: { onPlay?: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100));
    }, 50);
    return () => clearInterval(t);
  }, []);

  const data = {
     logo: { symmetry: 0.85, balance: 0.9, dominantColors: ['#000', '#D4AF37'], geometry: 'Curved', type: 'Symbol' },
     brand: 'Luxury',
     motionStyle: 'Premium Reveal',
     confidence: 0.96,
     plans: {
       camera: 'Cinematic Orbit, Dolly In',
       fx: 'Bloom, Particles, Glow',
       lighting: 'Luxury Studio, HDRI, Warm Key',
       material: 'Holographic Glass, Gold',
       timeline: '3 Beats, 6.0 Sec Duration'
     }
  };

  return (
    <div className="flex-1 p-8 bg-[#0d0d0d] overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
           <BrainCircuit className="text-indigo-400" size={32} />
           AI Director
        </h1>
        <p className="text-neutral-500 mt-2">Autonomous cinematic animation planning engine.</p>
      </header>

      <div className="max-w-5xl mx-auto space-y-6">
         {/* Top Section */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Generation Progress */}
            <div className="col-span-1 md:col-span-2 bg-[#141414] border border-neutral-800 rounded-xl p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-white flex items-center gap-2"><Wand2 size={16} className="text-indigo-400" /> Brain Activity</h3>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">STATE: SYNTHESIZING</span>
               </div>
               <div className="mb-2 flex justify-between text-xs text-neutral-400">
                  <span>Generating Motion DNA...</span>
                  <span className="font-mono">{progress}%</span>
               </div>
               <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
               </div>
               {progress === 100 && (
                  <div className="mt-4 flex gap-4">
                     <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-3 text-emerald-400 text-sm flex-1">
                        <Sparkles size={16} /> Cinematic Scene generated successfully.
                     </div>
                     <button onClick={onPlay} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] transition flex items-center gap-2">
                        <Play size={16} fill="currentColor" /> Play Scene
                     </button>
                  </div>
               )}
            </div>

            {/* Confidence Score */}
            <div className="col-span-1 bg-[#141414] border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center">
               <span className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Confidence</span>
               <div className="text-5xl font-light text-white tracking-tighter">
                 {Math.round(data.confidence * 100)}<span className="text-xl text-neutral-500">%</span>
               </div>
            </div>
         </div>

         {/* Middle Section: Analysis */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6">
               <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Search size={16} className="text-neutral-400" /> Logo Analysis</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black rounded border border-neutral-800/80">
                     <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Symmetry</div>
                     <div className="text-sm text-neutral-200 font-mono">{data.logo.symmetry.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-black rounded border border-neutral-800/80">
                     <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Geometry</div>
                     <div className="text-sm text-neutral-200 font-mono">{data.logo.geometry}</div>
                  </div>
                  <div className="p-3 bg-black rounded border border-neutral-800/80">
                     <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Type</div>
                     <div className="text-sm text-neutral-200 font-mono">{data.logo.type}</div>
                  </div>
                  <div className="p-3 bg-black rounded border border-neutral-800/80">
                     <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Dominant Colors</div>
                     <div className="flex gap-1 mt-1">
                        {data.logo.dominantColors.map(c => (
                           <div key={c} className="w-4 h-4 rounded-full border border-neutral-700" style={{ backgroundColor: c }} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6">
               <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Zap size={16} className="text-neutral-400" /> Intelligence</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-black rounded border border-neutral-800/80">
                     <span className="text-sm text-neutral-400">Detected Brand</span>
                     <span className="text-sm font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{data.brand}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black rounded border border-neutral-800/80">
                     <span className="text-sm text-neutral-400">Chosen Motion Style</span>
                     <span className="text-sm font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">{data.motionStyle}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Section: Planners */}
         <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2"><Layers size={16} className="text-neutral-400" /> Output Plans</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               <div className="flex flex-col gap-2 p-4 bg-black rounded-lg border border-neutral-800/80 hover:border-indigo-500/50 transition-colors">
                  <Video size={16} className="text-indigo-400 mb-2" />
                  <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Camera</span>
                  <span className="text-xs text-neutral-300">{data.plans.camera}</span>
               </div>
               <div className="flex flex-col gap-2 p-4 bg-black rounded-lg border border-neutral-800/80 hover:border-pink-500/50 transition-colors">
                  <Sparkles size={16} className="text-pink-400 mb-2" />
                  <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">FX</span>
                  <span className="text-xs text-neutral-300">{data.plans.fx}</span>
               </div>
               <div className="flex flex-col gap-2 p-4 bg-black rounded-lg border border-neutral-800/80 hover:border-amber-500/50 transition-colors">
                  <Zap size={16} className="text-amber-400 mb-2" />
                  <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Lighting</span>
                  <span className="text-xs text-neutral-300">{data.plans.lighting}</span>
               </div>
               <div className="flex flex-col gap-2 p-4 bg-black rounded-lg border border-neutral-800/80 hover:border-emerald-500/50 transition-colors">
                  <Orbit size={16} className="text-emerald-400 mb-2" />
                  <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Material</span>
                  <span className="text-xs text-neutral-300">{data.plans.material}</span>
               </div>
               <div className="flex flex-col gap-2 p-4 bg-black rounded-lg border border-neutral-800/80 hover:border-cyan-500/50 transition-colors">
                  <Move size={16} className="text-cyan-400 mb-2" />
                  <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Timeline</span>
                  <span className="text-xs text-neutral-300">{data.plans.timeline}</span>
               </div>
            </div>
         </div>
         
         <div className="bg-black border border-neutral-800 rounded-xl p-4">
             <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-3">Motion DNA Preview</div>
             <pre className="text-[10px] font-mono text-neutral-400 overflow-x-auto">
               {JSON.stringify(data, null, 2)}
             </pre>
         </div>

      </div>
    </div>
  );
}
