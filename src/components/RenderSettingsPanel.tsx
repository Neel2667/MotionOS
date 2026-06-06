import { useState } from 'react';
import { 
  Settings, Layers, Tv, Sliders, Shield, RefreshCw, 
  HelpCircle, Eye, Zap, Image, Video, FileCode 
} from 'lucide-react';
import { RenderSettings, ExportType, ResolutionPreset, RESOLUTION_MAP } from '../engine/export/RenderSettings';
import { RenderPreset, PRESETS } from '../engine/export/RenderPreset';

export interface RenderSettingsPanelProps {
  settings: RenderSettings;
  onSettingsChange: (settings: RenderSettings) => void;
}

export function RenderSettingsPanel({ settings, onSettingsChange }: RenderSettingsPanelProps) {
  const [localPreset, setLocalPreset] = useState<RenderPreset>(settings.preset);
  const [localRes, setLocalRes] = useState<ResolutionPreset>(settings.resolutionPreset);

  const updateSetting = <K extends keyof RenderSettings>(key: K, value: RenderSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onSettingsChange(updated);
  };

  const handlePresetChange = (preset: RenderPreset) => {
    setLocalPreset(preset);
    const presetProps = PRESETS[preset];
    
    const updated = {
      ...settings,
      preset,
      fps: presetProps.fps,
      motionBlurStrength: presetProps.motionBlur ? 0.6 : 0.0
    };
    onSettingsChange(updated);
  };

  const handleResolutionPresetChange = (res: ResolutionPreset) => {
    setLocalRes(res);
    const dimensions = RESOLUTION_MAP[res];
    const updated = {
      ...settings,
      resolutionPreset: res,
      customWidth: dimensions.width,
      customHeight: dimensions.height
    };
    onSettingsChange(updated);
  };

  return (
    <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
        <Settings size={16} className="text-pink-400" />
        <h3 className="font-semibold text-white text-sm tracking-wide">Output &amp; Rendering Profile</h3>
      </div>

      {/* Preset Profiles */}
      <div className="space-y-2">
        <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Quality Standard</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(RenderPreset).map(pr => {
            const isSelected = localPreset === pr;
            const props = PRESETS[pr];
            return (
              <button
                key={pr}
                type="button"
                onClick={() => handlePresetChange(pr)}
                className={`py-2 px-3 rounded-lg border text-left transition group ${
                  isSelected 
                    ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-mono tracking-wider">{pr}</span>
                  {isSelected && <Zap size={10} className="text-indigo-400 shrink-0" />}
                </div>
                <span className="text-[9px] text-neutral-500 block mt-0.5 truncate">{props.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution Selector */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Dimensions Canvas Preset</label>
          <span className="text-xs font-mono text-indigo-400 font-semibold">
            {settings.resolutionPreset === ResolutionPreset.CUSTOM 
              ? `${settings.customWidth} × ${settings.customHeight}`
              : `${RESOLUTION_MAP[settings.resolutionPreset].width} × ${RESOLUTION_MAP[settings.resolutionPreset].height} (${settings.resolutionPreset})`}
          </span>
        </div>
        <select
          value={localRes}
          onChange={(e) => handleResolutionPresetChange(e.target.value as ResolutionPreset)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
        >
          {Object.values(ResolutionPreset).map(r => (
            <option key={r} value={r}>{r.toUpperCase()} UltraHD Mode</option>
          ))}
        </select>

        {localRes === ResolutionPreset.CUSTOM && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono">Custom Width (px)</span>
              <input
                type="number"
                value={settings.customWidth}
                onChange={(e) => updateSetting('customWidth', Math.max(128, parseInt(e.target.value) || 128))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 mt-0.5"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono">Custom Height (px)</span>
              <input
                type="number"
                value={settings.customHeight}
                onChange={(e) => updateSetting('customHeight', Math.max(128, parseInt(e.target.value) || 128))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 mt-0.5"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-800/80 my-4" />

      {/* Export Format Select & Sliders */}
      <div className="space-y-4">
        <div>
          <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block mb-2">Export Format Codec</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(ExportType).map(f => {
              const active = settings.exportType === f;
              let Icon = Video;
              if (f.includes('Sequence') || f === 'GIF') Icon = Image;
              if (f.includes('JSON')) Icon = FileCode;
              
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => updateSetting('exportType', f)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition ${
                    active 
                      ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon size={12} className={active ? 'text-emerald-400' : 'text-neutral-500'} />
                  <span className="text-[10px] font-bold font-mono truncate">{f}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compression slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-neutral-400">Encoder Compression Compression Quality</span>
            <span className="font-mono text-emerald-400">{(settings.compressionQuality * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={settings.compressionQuality}
            onChange={(e) => updateSetting('compressionQuality', parseFloat(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Frame range Inputs */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Start Frame</span>
            <input
              type="number"
              value={settings.startFrame}
              onChange={(e) => updateSetting('startFrame', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg p-2 text-xs text-white"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">End Frame</span>
            <input
              type="number"
              value={settings.endFrame}
              onChange={(e) => updateSetting('endFrame', Math.max(settings.startFrame + 1, parseInt(e.target.value) || 120))}
              className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg p-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Framerate Selection */}
        <div className="space-y-2">
          <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Video Target Frame Rate (FPS)</label>
          <select
            value={settings.fps}
            onChange={(e) => updateSetting('fps', parseInt(e.target.value))}
            className="w-full bg-[#1c1c1f] border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none"
          >
            {[15, 24, 30, 60, 120].map(fpsVal => (
              <option key={fpsVal} value={fpsVal}>{fpsVal} FPS Cine-Standard</option>
            ))}
          </select>
        </div>

        <div className="border-t border-neutral-800/80 my-2" />

        {/* Optimization Options */}
        <div className="space-y-2.5">
          <span className="text-[11px] text-neutral-500 font-mono block">ADVANCED COMPILER PERFORMANCE BOUNDS</span>
          
          <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-lg border border-neutral-800">
            <div className="space-y-0.5">
              <span className="text-[10px] text-neutral-300 font-semibold block">Preallocated Buffers</span>
              <p className="text-[9px] text-neutral-500">Locks heaps to eliminate GC stutters.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.usePreallocatedBuffers}
              onChange={(e) => updateSetting('usePreallocatedBuffers', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-500 border-neutral-850 accent-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-lg border border-neutral-800">
            <div className="space-y-0.5">
              <span className="text-[10px] text-neutral-300 font-semibold block">Deterministic Execution</span>
              <p className="text-[9px] text-neutral-500">Enforces timing consistency per frame tick.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.deterministicExecution}
              onChange={(e) => updateSetting('deterministicExecution', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-500 border-neutral-850 accent-indigo-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
