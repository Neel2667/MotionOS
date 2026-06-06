import { TextMetric } from '../engine/brand/BrandProfile';
import { Type, Sparkles } from 'lucide-react';

interface FontViewerProps {
  typography: TextMetric;
}

export function FontViewer({ typography }: FontViewerProps) {
  return (
    <div id="font_viewer_root" className="bg-neutral-900/40 p-4 rounded-lg border border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <Type size={14} className="text-pink-400" />
          <h4 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase">Typography Core Profile</h4>
        </div>
        <span className="text-[9px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
          Vibe: {typography.vibe}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Typographic Preview Specimen */}
        <div className="md:col-span-8 bg-[#141417]/80 rounded-lg p-3 border border-neutral-850 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Type Specimen</span>
            <p className="text-3xl font-bold text-white tracking-tight mt-1 truncate" style={{ fontFamily: typography.fontFamily }}>
              {typography.fontFamily}
            </p>
          </div>
          <p className="text-[11px] text-neutral-400 mt-3 font-mono leading-relaxed border-t border-neutral-850 pt-2 italic">
            "The quick brown fox jumps over the lazy dog" - 0123456789
          </p>
        </div>

        {/* Font parameters */}
        <div className="md:col-span-4 space-y-3">
          <div className="bg-[#141417] p-2.5 rounded border border-neutral-850">
            <span className="text-[9px] font-mono text-neutral-500">Weight Range</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-bold text-neutral-200">{typography.weight}</span>
              <span className="text-[8px] font-mono text-indigo-400 bg-indigo-950 px-1.5 rounded uppercase font-semibold">
                Core
              </span>
            </div>
          </div>

          <div className="bg-[#141417] p-2.5 rounded border border-neutral-850">
            <span className="text-[9px] font-mono text-neutral-500">Contrast Assessment</span>
            <p className="text-[11px] font-bold mt-0.5 text-neutral-200">{typography.contrast}</p>
          </div>

          <div className="bg-[#141417] p-2.5 rounded border border-neutral-850">
            <div className="flex items-center gap-1 justify-between mb-1">
              <span className="text-[9px] font-mono text-neutral-500">Suggested Pairing</span>
              <Sparkles size={10} className="text-amber-400" />
            </div>
            <div className="flex flex-wrap gap-1">
              {typography.suggestedPairings.map((pair) => (
                <span 
                  key={pair}
                  className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded"
                >
                  {pair}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
