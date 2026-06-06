import { useState, useEffect } from 'react';
import { 
  Cpu, Video, Download, RefreshCw, Layers, CheckCircle2, 
  Play, Settings, ShieldCheck, FileJson, ArrowRight, Sparkles 
} from 'lucide-react';
import { globalExportEngine, DEFAULT_RENDER_SETTINGS } from '../engine/export/ExportEngine';
import { RenderSettings, ExportType } from '../engine/export/RenderSettings';
import { RenderSettingsPanel } from './RenderSettingsPanel';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalJobManager } from '../engine/jobs/JobManager';
import { EncodedOutput } from '../engine/export/Encoder';

export function ExportView() {
  const [activeProject] = useState(() => globalProjectManager.getActiveProject());
  const [settings, setSettings] = useState<RenderSettings>({ ...DEFAULT_RENDER_SETTINGS });
  const [exporting, setExporting] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(180);
  const [statusText, setStatusText] = useState('Standby');
  const [flowSteps, setFlowSteps] = useState(() => [...globalExportEngine.dataFlowSteps]);
  const [outputFile, setOutputFile] = useState<EncodedOutput | null>(null);

  // Sync flow steps
  const syncFlowState = () => {
    setFlowSteps([...globalExportEngine.dataFlowSteps]);
  };

  const handleImmediateExport = async () => {
    setExporting(true);
    setOutputFile(null);
    try {
      const output = await globalExportEngine.executeImmediateExport(
        activeProject.metadata.name,
        settings,
        (current, total, text) => {
          setCurrentFrame(current);
          setTotalFrames(total);
          if (text) setStatusText(text);
          syncFlowState();
        }
      );
      setOutputFile(output);
    } catch (e) {
      setStatusText(`Failure: ${(e as Error).message}`);
    } finally {
      setExporting(false);
      syncFlowState();
    }
  };

  const handleQueueRenderJob = () => {
    globalJobManager.requestRender(activeProject.metadata.name, settings, 'HIGH');
    setStatusText('Background render job successfully logged to Multiprocess Render Queue!');
    // Redirect feedback to show they can view it in the queue
    setTimeout(() => {
      setStatusText('Standby');
    }, 4500);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 bg-[#09090b] text-neutral-200 overflow-y-auto p-6 md:p-8">
      
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-8 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Video size={14} className="animate-pulse" /> Production-Grade Frame Compiler
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Export Engine Master Panel
          </h1>
          <p className="text-neutral-400 mt-1.5 text-sm max-w-2xl">
            Compile procedural WebGL streams into MP4s, WebM channels, high fidelity image sequences, or compact Motion DNA JSON arrays.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left column: Render Settings Panel */}
        <div className="xl:col-span-1 space-y-6">
          <RenderSettingsPanel 
            settings={settings}
            onSettingsChange={(updated) => setSettings(updated)}
          />

          {/* Background trigger shortcut */}
          <div className="p-4 bg-[#121214] border border-neutral-850 rounded-xl space-y-3.5 shadow-sm">
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#bfdbfe] uppercase block">Concurrent Job Scheduler</span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Queue this compile task to render in background threads, so you can continue editing layouts without browser throttling.
            </p>
            <button
              onClick={handleQueueRenderJob}
              disabled={exporting}
              className="w-full py-2 px-3.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white rounded-lg text-xs font-semibold text-neutral-400 transition flex items-center justify-center gap-2"
            >
              <Cpu size={13} /> Push to Background Queue
            </button>
          </div>
        </div>

        {/* Right Columns: Active Flow Map & Progress */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Action Panel */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-neutral-850">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-indigo-400" />
                  <h2 className="font-semibold text-white tracking-wide text-sm font-sans">Active Stream Compiler</h2>
                </div>
                <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${
                  exporting ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-neutral-900 text-neutral-500'
                }`}>
                  {exporting ? 'COMPILING DIRECT STREAM' : 'STANDBY'}
                </span>
              </div>

              {/* Progress Panel */}
              <div className="space-y-4 mt-5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Pipeline Output Status: <strong className="text-white normal-case font-mono text-[11px]">{statusText}</strong></span>
                  {exporting && (
                    <span className="font-semibold text-indigo-400">{currentFrame} / {totalFrames} FRAMES ({Math.round((currentFrame / totalFrames) * 100)}%)</span>
                  )}
                </div>

                <div className="w-full h-2.5 bg-neutral-950 border border-neutral-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${Math.round((currentFrame / totalFrames) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Complete Output View */}
              {outputFile && (
                <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border-l-4 border-emerald-500 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-white font-mono">
                      <CheckCircle2 size={14} className="text-emerald-400 pr-0.5" /> COMPILE BUNDLED SUCCESSFULLY!
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Format: {outputFile.exportType} • Size: {formatSize(outputFile.fileSizeEstimateBytes)} • Path: {outputFile.fileName}
                    </p>
                  </div>

                  {outputFile.blobUrl && (
                    <a
                      href={outputFile.blobUrl}
                      download={outputFile.fileName}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-500/15 flex items-center gap-1.5 transition text-center shrink-0"
                    >
                      <Download size={13} /> DOWNLOAD FILE
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-neutral-900 mt-2">
              <span className="text-xs text-neutral-500 font-mono">Project Target: <strong className="text-neutral-300">{activeProject.metadata.name}</strong></span>
              <button
                type="button"
                onClick={handleImmediateExport}
                disabled={exporting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white rounded-lg tracking-wide selection:bg-transparent shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition flex items-center gap-2"
              >
                <Play size={12} fill="white" /> COMPILE IMMEDIATE EXPORT
              </button>
            </div>
          </div>

          {/* Sequential Data Flow Visualizer */}
          <div className="bg-[#121214] border border-neutral-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-white mb-4 text-sm flex items-center gap-2 font-mono uppercase tracking-wider">
              <Sparkles size={14} className="text-pink-400" />
              MotionOS Sequential Rendering Data Pipeline
            </h3>

            {/* Render Horizontal flow nodes list */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {flowSteps.map((step) => {
                const active = step.status === 'ACTIVE';
                const completed = step.status === 'COMPLETED';
                const pending = step.status === 'PENDING';

                return (
                  <div 
                    key={step.name} 
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between h-24 transition ${
                      active ? 'bg-indigo-505/10 border-indigo-500' :
                      completed ? 'bg-emerald-505/10 border-emerald-500/35' : 'bg-neutral-950 border-neutral-900'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-neutral-500">#{step.order}</span>
                        {completed ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ) : active ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                        ) : null}
                      </div>
                      <span className="text-xs font-bold text-neutral-200 mt-1 block leading-tight">{step.name}</span>
                    </div>

                    <span className={`text-[9px] font-mono block tracking-wider ${
                      completed ? 'text-emerald-400' :
                      active ? 'text-indigo-450 font-bold animate-pulse' : 'text-neutral-600'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
