import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { ColorSwatch } from '../engine/brand/BrandProfile';

interface PaletteViewerProps {
  palette: ColorSwatch[];
}

export function PaletteViewer({ palette }: PaletteViewerProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div id="palette_viewer_root" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase">Active Color Harmony</h4>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
          {palette.length} Channels
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {palette.map((swatch) => (
          <div 
            key={`${swatch.role}-${swatch.hex}`}
            className="group relative bg-[#121214] border border-neutral-800 rounded-lg p-2.5 flex flex-col justify-between transition hover:border-neutral-700/80 hover:bg-neutral-900/40 cursor-pointer overflow-hidden"
            onClick={() => handleCopy(swatch.hex)}
          >
            {/* Color preview tile */}
            <div 
              className="w-full h-14 rounded-md mb-2 shadow-inner border border-neutral-850/50 transition duration-300 group-hover:scale-[1.02]"
              style={{ backgroundColor: swatch.hex }}
            />

            <div>
              {/* Role badge */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[8px] font-mono font-black tracking-widest px-1.5 py-0.5 rounded ${
                  swatch.role === 'PRIMARY' 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : swatch.role === 'ACCENT' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : swatch.role === 'SECONDARY'
                    ? 'bg-neutral-600/10 text-neutral-400 border border-neutral-700/20'
                    : swatch.role === 'BACKGROUND'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {swatch.role}
                </span>
                <span className="text-[9px] font-mono text-neutral-500">{(swatch.ratio * 100).toFixed(0)}%</span>
              </div>

              {/* Color details */}
              <p className="text-[10px] font-medium text-neutral-300 truncate tracking-tight">{swatch.name}</p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-400">{swatch.hex}</p>
                
                <button className="text-neutral-500 hover:text-white transition opacity-0 group-hover:opacity-100 p-0.5 rounded">
                  {copiedHex === swatch.hex ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
