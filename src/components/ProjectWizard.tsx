import React, { useState } from 'react';
import { Upload, ChevronRight, ChevronLeft, Sparkles, Sliders, Play, Camera, Film, Trophy, Lightbulb, Grid, Gauge, HelpCircle, HardDrive, Check } from 'lucide-react';
import { BrandStyle } from '../engine/ai/analyzer/BrandAnalyzer';
import { globalGenerationEngine } from '../engine/studio/GenerationEngine';
import { globalStudioSession } from '../engine/studio/StudioSession';

export function ProjectWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [logoName, setLogoName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Brand options
  const [selectedStyle, setSelectedStyle] = useState<BrandStyle>(BrandStyle.LUXURY);
  const [durationSec, setDurationSec] = useState<number>(6);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '21:9'>('16:9');
  const [quality, setQuality] = useState<'Draft' | 'Normal' | 'Producer 4K' | 'Master 8K'>('Normal');

  // Simulated uploads
  const handleUploadFakeLogo = (name: string, customStyle?: BrandStyle) => {
    setIsUploading(true);
    setTimeout(() => {
      setLogoName(name);
      if (customStyle) {
        setSelectedStyle(customStyle);
      }
      setIsUploading(false);
      setStep(2); // Auto proceed to analysis display
    }, 1205);
  };

  const handleGenerateAndSynthesize = () => {
    // Triggers generation in engine!
    globalGenerationEngine.runEndToEndSynthesis(
      logoName || 'Logo_Vector_Stream.svg',
      selectedStyle,
      durationSec,
      aspectRatio,
      quality
    );
    onComplete();
  };

  return (
    <div id="project_wizard_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-6 space-y-6 font-mono text-neutral-300">
      
      {/* Top step indicators */}
      <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500 animate-pulse" size={16} />
          <h3 className="text-sm font-black uppercase text-white tracking-widest">Brand Ingestion Wizard</h3>
        </div>
        <span className="text-[10px] text-neutral-500 font-extrabold uppercase">Step {step} of 7</span>
      </div>

      {/* Progress Line */}
      <div className="grid grid-cols-7 gap-1 h-1 bg-neutral-900 rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7].map(s => (
          <div 
            key={s} 
            className={`h-full transition-all duration-300 ${s <= step ? 'bg-amber-500' : 'bg-transparent'}`} 
          />
        ))}
      </div>

      {/* Step Contents */}
      <div className="min-h-[260px] py-2 flex flex-col justify-between">
        
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-4 text-center">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 1: Upload Brand Vector Asset (.svg)</h4>
            <p className="text-[11px] text-neutral-500 max-w-lg mx-auto">
              Drop premium client logos into the vector parser. Our deconstruction metrics calculate stroke weights and symmetry formulas natively.
            </p>

            {isUploading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <Upload className="text-amber-500 animate-bounce" size={24} />
                <span className="text-[10px] text-amber-400">DECIPHERING VECTOR MAPS...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleUploadFakeLogo('Tesla_Cyber_Cab.svg', BrandStyle.TECHNOLOGY)}
                  className="p-4 bg-black/45 border border-dashed border-neutral-800 hover:border-amber-500 rounded-lg text-left transition flex flex-col justify-between h-28"
                >
                  <span className="text-[9px] text-neutral-500 uppercase font-black">Preset A</span>
                  <p className="text-[11px] font-bold text-white leading-tight">Tesla_Cyber_Cab.svg</p>
                  <span className="text-[8px] bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-1 rounded self-start mt-2">Vector Core</span>
                </button>

                <button
                  onClick={() => handleUploadFakeLogo('Rolex_Oyster_Crown.svg', BrandStyle.LUXURY)}
                  className="p-4 bg-black/45 border border-dashed border-neutral-800 hover:border-amber-500 rounded-lg text-left transition flex flex-col justify-between h-28"
                >
                  <span className="text-[9px] text-neutral-500 uppercase font-black">Preset B</span>
                  <p className="text-[11px] font-bold text-white leading-tight">Rolex_Oyster_Crown.svg</p>
                  <span className="text-[8px] bg-amber-950/40 text-amber-400 border border-amber-900/40 px-1 rounded self-start mt-2">Premium Luxe</span>
                </button>

                <button
                  onClick={() => handleUploadFakeLogo('Nike_AlphaFly_Spike.svg', BrandStyle.SPORTS)}
                  className="p-4 bg-black/45 border border-dashed border-neutral-800 hover:border-amber-500 rounded-lg text-left transition flex flex-col justify-between h-28"
                >
                  <span className="text-[9px] text-neutral-500 uppercase font-black">Preset C</span>
                  <p className="text-[11px] font-bold text-white leading-tight">Nike_AlphaFly_Spike.svg</p>
                  <span className="text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-1 rounded self-start mt-2">Kinetic Active</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Brand Analysis */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 2: Brand Shape Analysis & Decoupling</h4>
            <div className="p-4 bg-[#0a0a0c] border border-neutral-850 rounded-lg space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                <span className="text-[10px] text-neutral-400">Parsed Path File Name:</span>
                <span className="text-amber-400 font-bold text-[11px]">{logoName}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2 bg-neutral-900/40 rounded text-left">
                  <span className="text-[8px] text-neutral-500 block uppercase">Dominant Hex</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 block" style={{ backgroundColor: selectedStyle === BrandStyle.LUXURY ? '#ffd700' : '#00f0ff' }} />
                    <span className="text-[10px] font-bold">#D4AF37</span>
                  </div>
                </div>
                <div className="p-2 bg-neutral-900/40 rounded text-left">
                  <span className="text-[8px] text-neutral-500 block uppercase">Path Symmetry</span>
                  <span className="text-[10px] font-bold mt-1 block">94.8% ACCURATE</span>
                </div>
                <div className="p-2 bg-neutral-900/40 rounded text-left">
                  <span className="text-[8px] text-neutral-500 block uppercase">Geometry Type</span>
                  <span className="text-[10px] font-bold mt-1 block">{selectedStyle === BrandStyle.TECHNOLOGY ? 'ANGULAR VECTOR' : 'CURVED SINE'}</span>
                </div>
                <div className="p-2 bg-neutral-900/40 rounded text-left">
                  <span className="text-[8px] text-neutral-500 block uppercase">Brand Archetype</span>
                  <span className="text-[10px] font-bold text-amber-400 mt-1 block uppercase">{selectedStyle}</span>
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-neutral-400 leading-relaxed bg-amber-500/5 p-3 rounded border border-amber-500/20">
              <HelpCircle size={12} className="inline mr-1 text-amber-500" /> Shape integrity reports 14 independent nodes. The generator recommends applying **{selectedStyle}** aesthetics to render pipelines.
            </p>
          </div>
        )}

        {/* Step 3: Choose Style */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 3: Confirm Visual Brand Style</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { style: BrandStyle.LUXURY, desc: 'Velvet gold, soft DOF bokeh' },
                { style: BrandStyle.TECHNOLOGY, desc: 'Cyan lines, grid arrays' },
                { style: BrandStyle.SPORTS, desc: 'Angular sweeps, high dynamic energy' },
                { style: BrandStyle.GAMING, desc: 'Raw neon glimmers, lightning particles' },
                { style: BrandStyle.MINIMAL, desc: 'Zen polar canvas, silent layout' }
              ].map(opt => (
                <button
                  key={opt.style}
                  onClick={() => setSelectedStyle(opt.style)}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between h-24 transition ${
                    selectedStyle === opt.style 
                      ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-950/20' 
                      : 'border-neutral-850 hover:border-neutral-600 bg-neutral-900/20'
                  }`}
                >
                  <span className={`text-[11px] font-black uppercase ${selectedStyle === opt.style ? 'text-amber-400' : 'text-neutral-400'}`}>
                    {opt.style}
                  </span>
                  <span className="text-[8.5px] text-neutral-500 leading-tight block mt-2">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Choose Duration */}
        {step === 4 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 4: Config Target Video Duration</h4>
            <div className="space-y-3 max-w-lg">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-neutral-400">Active Duration:</span>
                <span className="text-amber-400 font-extrabold text-[12px]">{durationSec} Seconds ({durationSec * 60} rendered ticks)</span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[9px] text-neutral-600">
                <span>3s (Short Ad)</span>
                <span>8s (Branding Loop)</span>
                <span>15s (Complete Promo)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Choose Aspect Ratio */}
        {step === 5 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 5: Pick Screen Aspect Ratio Bounds</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { ratio: '16:9', label: 'Cinema Horizontal', icon: Grid },
                { ratio: '9:16', label: 'TikTok/Reels Vertical', icon: Film },
                { ratio: '1:1', label: 'Instagram Square', icon: Camera },
                { ratio: '21:9', label: 'UltraWide Panoramic', icon: Film }
              ].map(opt => (
                <button
                  key={opt.ratio}
                  onClick={() => setAspectRatio(opt.ratio as any)}
                  className={`p-4 rounded-lg border text-left h-24 flex flex-col justify-between transition ${
                    aspectRatio === opt.ratio 
                      ? 'border-amber-500 bg-amber-500/5' 
                      : 'border-neutral-850 hover:border-neutral-600 bg-neutral-900/20'
                  }`}
                >
                  <opt.icon size={14} className={aspectRatio === opt.ratio ? 'text-amber-400' : 'text-neutral-500'} />
                  <div>
                    <span className="text-[11px] font-black block text-white">{opt.ratio}</span>
                    <span className="text-[8.5px] text-neutral-500">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Choose Quality */}
        {step === 6 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 6: Choose Hardware Quality Profile</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { q: 'Draft', desc: 'Fast turnaround testing (720px, no antialiasing)' },
                { q: 'Normal', desc: 'Standard production preview (1080px, low pass DOF)' },
                { q: 'Producer 4K', desc: 'High visual depth (2160px, multi-sampled shadows)' },
                { q: 'Master 8K', desc: 'Ultimate cinematic presentation (4320px, maximum light raytracing)' }
              ].map(opt => (
                <button
                  key={opt.q}
                  onClick={() => setQuality(opt.q as any)}
                  className={`p-4 rounded-lg border text-left h-28 flex flex-col justify-between transition ${
                    quality === opt.q 
                      ? 'border-amber-500 bg-amber-500/5' 
                      : 'border-neutral-850 hover:border-neutral-600 bg-neutral-900/20'
                  }`}
                >
                  <Gauge size={14} className={quality === opt.q ? 'text-amber-400' : 'text-neutral-500'} />
                  <div>
                    <span className="text-[11px] font-black block text-white">{opt.q}</span>
                    <span className="text-[8.5px] text-neutral-500 leading-tight block mt-1">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Generate Complete Pipeline */}
        {step === 7 && (
          <div className="space-y-5 text-center">
            <h4 className="text-xs font-bold uppercase text-neutral-200">Step 7: Compile Motion Studio Parameters</h4>
            
            <div className="p-4 bg-black/45 border border-neutral-850 rounded-lg max-w-lg mx-auto text-left text-[11px] space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">Vector Link:</span> <span className="text-neutral-200 font-bold">{logoName || 'default_brand_vector_logo.svg'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Brand Style:</span> <span className="text-amber-400 font-black uppercase text-[10px]">{selectedStyle}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Duration:</span> <span className="text-neutral-200">{durationSec} Seconds</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Aspect Bounds:</span> <span className="text-neutral-200">{aspectRatio}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Video Quality:</span> <span className="text-indigo-400 uppercase text-[10px] font-black">{quality}</span></div>
            </div>

            <button
              onClick={handleGenerateAndSynthesize}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-black text-xs uppercase border border-amber-500 transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={13} fill="currentColor" />
              <span>SYNTESIZE PROCEDURAL MOTION DNA</span>
            </button>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-neutral-850 pt-4">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          className="flex items-center gap-1 text-[10.5px] text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={14} /> Back
        </button>

        {step < 7 ? (
          <button
            onClick={() => setStep(prev => Math.min(7, prev + 1))}
            disabled={step === 1 && !logoName}
            className={`flex items-center gap-1 text-[10.5px] transition ${
              step === 1 && !logoName 
                ? 'text-neutral-600 cursor-not-allowed' 
                : 'text-amber-400 hover:text-amber-300 font-bold cursor-pointer'
            }`}
          >
            Next <ChevronRight size={14} />
          </button>
        ) : null}
      </div>

    </div>
  );
}
export default ProjectWizard;
