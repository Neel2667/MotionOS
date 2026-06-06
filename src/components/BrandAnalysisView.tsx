import { Sparkles, Compass, Eye, Shield, Cpu, RefreshCw, Zap, Sliders, Play } from 'lucide-react';
import { BrandProfile } from '../engine/brand/BrandProfile';

interface BrandAnalysisViewProps {
  profile: BrandProfile;
  onApplyToDirector: (profile: BrandProfile) => void;
  isApplying?: boolean;
}

export function BrandAnalysisView({ profile, onApplyToDirector, isApplying = false }: BrandAnalysisViewProps) {
  // Mini auxiliary indicators for material styles
  const getMaterialClasses = (mat: string): string => {
    if (mat.includes('GOLD')) return 'border-amber-500/25 bg-amber-500/10 text-amber-400';
    if (mat.includes('GLASS')) return 'border-sky-500/25 bg-sky-500/10 text-sky-400';
    if (mat.includes('SILICON')) return 'border-indigo-500/25 bg-indigo-500/10 text-indigo-400';
    if (mat.includes('CHROME')) return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400';
    return 'border-neutral-800 bg-neutral-900 text-neutral-300';
  };

  return (
    <div id="brand_analysis_view_root" className="bg-[#111114] border border-neutral-800/80 rounded-xl p-5 space-y-5">
      
      {/* Header Profile Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Cpu size={14} className="animate-pulse" />
            </span>
            <h3 className="text-sm font-mono font-bold text-neutral-200 tracking-wide uppercase">Brand Intelligence Log</h3>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-1">Profile: <span className="text-neutral-300">{profile.name}</span> • ID: <span className="text-neutral-400">{profile.id}</span></p>
        </div>

        {/* Action Button: Inject profile to AI Director */}
        <button
          onClick={() => onApplyToDirector(profile)}
          disabled={isApplying}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition text-white rounded-lg shadow-lg shadow-indigo-950/40 border border-indigo-500/30 flex items-center justify-center gap-2 text-xs font-mono font-bold select-none disabled:opacity-50"
        >
          {isApplying ? (
            <>
              <RefreshCw size={13} className="animate-spin" /> Compiling DNA...
            </>
          ) : (
            <>
              <Zap size={13} className="fill-current text-amber-300" /> Synthesize DNA & Build Timeline
            </>
          )}
        </button>
      </div>

      {/* Grid: Style classification & confidence indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Archetype Card */}
        <div className="bg-[#16161a] border border-neutral-850 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase block">Aesthetic Alignment</span>
            <p className="text-lg font-mono font-black text-white mt-1 uppercase tracking-tight">{profile.style}</p>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-2 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-full inline-block w-max">
            Confidence: {(profile.confidenceScore * 100).toFixed(0)}%
          </span>
        </div>

        {/* Symmetry Gauge */}
        <div className="bg-[#16161a] border border-neutral-850 p-4 rounded-lg space-y-1">
          <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">Geometric Symmetry</span>
          <p className="text-lg font-mono font-bold text-neutral-200">{(profile.shape.symmetry * 100).toFixed(0)}%</p>
          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${profile.shape.symmetry * 100}%` }} />
          </div>
        </div>

        {/* Balance Gauge */}
        <div className="bg-[#16161a] border border-neutral-850 p-4 rounded-lg space-y-1">
          <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">Visual Weight Balance</span>
          <p className="text-lg font-mono font-bold text-neutral-200">{(profile.shape.balance * 100).toFixed(0)}%</p>
          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${profile.shape.balance * 100}%` }} />
          </div>
        </div>

        {/* Complexity Gauge */}
        <div className="bg-[#16161a] border border-neutral-850 p-4 rounded-lg space-y-1">
          <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">Outline Complexity</span>
          <p className="text-lg font-mono font-bold text-neutral-200">{(profile.shape.complexity * 100).toFixed(0)}%</p>
          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${profile.shape.complexity * 100}%` }} />
          </div>
        </div>

      </div>

      {/* Suggestion Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Core Motion Recommendations */}
        <div className="bg-[#141416] border border-neutral-850/85 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Compass size={13} />
            <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400">Rig Suggestions</h4>
          </div>
          
          <div className="space-y-2">
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850">
              <span className="text-[8px] font-mono text-neutral-500 uppercase">Movement Pattern</span>
              <p className="text-[11px] font-mono font-medium text-neutral-300 mt-0.5">{profile.motionSuggestions.motionStyle}</p>
            </div>

            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850">
              <span className="text-[8px] font-mono text-neutral-500 uppercase">Camera Pathing</span>
              <p className="text-[11px] font-mono font-medium text-neutral-300 mt-0.5">{profile.motionSuggestions.cameraStyle}</p>
            </div>
          </div>
        </div>

        {/* Scene Materials & Shaders */}
        <div className="bg-[#141416] border border-neutral-850/85 p-4 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Sparkles size={13} />
              <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400">Render Targets</h4>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[8px] font-mono text-neutral-500 uppercase block mb-1">Proposed FX Overlays</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.motionSuggestions.suggestedFX.map(fx => (
                    <span key={fx} className="text-[9px] font-mono bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-850">
                      {fx}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[8px] font-mono text-neutral-500 uppercase block mb-1">Target Physical Shaders</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.motionSuggestions.suggestedMaterials.map(mat => (
                    <span key={mat} className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${getMaterialClasses(mat)}`}>
                      {mat.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
