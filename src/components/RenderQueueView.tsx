import { useState, useEffect } from 'react';
import { 
  Play, Pause, X, Trash2, CheckCircle2, AlertOctagon, 
  Clock, Download, RefreshCcw, Layers, Ban, HelpCircle 
} from 'lucide-react';
import { globalJobManager } from '../engine/jobs/JobManager';
import { Job, JobStatus } from '../engine/jobs/Job';

export function RenderQueueView() {
  const [jobs, setJobs] = useState<Job[]>(() => globalJobManager.queue.getJobs());

  useEffect(() => {
    const unsub = globalJobManager.registerListener((updatedList) => {
      setJobs([...updatedList]);
    });
    return unsub;
  }, []);

  const handlePause = (id: string) => {
    globalJobManager.pauseJob(id);
  };

  const handleResume = (id: string) => {
    globalJobManager.resumeJob(id);
  };

  const handleCancel = (id: string) => {
    globalJobManager.cancelJob(id);
  };

  const handleRemove = (id: string) => {
    globalJobManager.removeJob(id);
  };

  const handleClearAll = () => {
    globalJobManager.clearAll();
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (ms: number) => {
    const secs = Math.ceil(ms / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#09090b] text-neutral-200">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-8 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase tracking-wider mb-2">
            <RefreshCcw size={14} className="animate-spin-slow" /> Multiprocess Render Pipeline
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Active Render Queue</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Track multi-pass encoding and download finalized high quality assets. Background compiler works concurrently without UI blockage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-400 transition"
          >
            <Trash2 size={13} /> Purge Finished Archive
          </button>
        </div>
      </header>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-[#121214] border border-neutral-800 rounded-xl relative overflow-hidden">
          <div className="text-[10px] text-neutral-500 tracking-wider font-mono uppercase">Jobs count</div>
          <div className="text-2xl font-bold text-white mt-1.5">{jobs.length}</div>
          <p className="text-[10px] text-neutral-400 mt-1">Scheduled in pool</p>
        </div>
        <div className="p-4 bg-[#121214] border border-neutral-800 rounded-xl">
          <div className="text-[10px] text-neutral-500 tracking-wider font-mono uppercase">Processing</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1.5">
            {jobs.filter(j => j.status === JobStatus.WORKING).length}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Concurrently Rendering</p>
        </div>
        <div className="p-4 bg-[#121214] border border-neutral-800 rounded-xl">
          <div className="text-[10px] text-neutral-500 tracking-wider font-mono uppercase">Successfully Compiled</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1.5">
            {jobs.filter(j => j.status === JobStatus.COMPLETED).length}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Ready for download</p>
        </div>
        <div className="p-4 bg-[#121214] border border-neutral-800 rounded-xl">
          <div className="text-[10px] text-neutral-500 tracking-wider font-mono uppercase">Failures</div>
          <div className="text-2xl font-bold text-red-400 mt-1.5">
            {jobs.filter(j => j.status === JobStatus.FAILED).length}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Flagged logs available</p>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        
        {jobs.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl bg-[#121214]/30">
            <Layers size={32} className="mx-auto text-neutral-600 mb-3" />
            <p className="text-sm font-semibold text-neutral-400">Queue is vacant</p>
            <p className="text-xs text-neutral-500 mt-1">Trigger an export inside the layout panel to queue frames render.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => {
              const working = job.status === JobStatus.WORKING;
              const completed = job.status === JobStatus.COMPLETED;
              const failed = job.status === JobStatus.FAILED;
              const sub = job.status === JobStatus.PAUSED;
              const queued = job.status === JobStatus.STANDBY;
              const canceled = job.status === JobStatus.CANCELED;

              return (
                <div 
                  key={job.id} 
                  className={`p-4 bg-[#121214] border rounded-xl transition ${
                    working ? 'border-indigo-500 shadow-md shadow-indigo-600/5' :
                    completed ? 'border-emerald-500/30' : 'border-neutral-800'
                  }`}
                >
                  
                  {/* Title Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 select-none font-mono">
                        <span className="text-[10px] text-neutral-500">ID: {job.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          job.priority === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          job.priority === 'HIGH' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}>
                          {job.priority} PRIORITY
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {job.projectName} <span className="font-mono text-neutral-500 font-normal">({job.name})</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Interactive Triggers */}
                      {working && (
                        <button
                          onClick={() => handlePause(job.id)}
                          className="p-1 px-2.5 rounded bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 text-xs font-mono text-neutral-400 flex items-center gap-1 transition"
                        >
                          <Pause size={12} /> Pause
                        </button>
                      )}
                      {sub && (
                        <button
                          onClick={() => handleResume(job.id)}
                          className="p-1 px-2.5 rounded bg-neutral-950 hover:bg-neutral-900 hover:text-white border border-neutral-800 text-xs font-mono text-neutral-400 flex items-center gap-1 transition"
                        >
                          <Play size={12} /> Resume
                        </button>
                      )}
                      {(working || sub || queued) && (
                        <button
                          onClick={() => handleCancel(job.id)}
                          className="p-1 px-2 rounded bg-neutral-950 hover:bg-red-500/10 hover:text-red-400 border border-neutral-850 text-xs text-neutral-500 transition"
                          title="Abort Engine Compile"
                        >
                          Cancel
                        </button>
                      )}
                      {(completed || failed || canceled) && (
                        <button
                          onClick={() => handleRemove(job.id)}
                          className="p-1 px-2 hover:bg-neutral-800 rounded text-neutral-500 transition"
                          title="Purge record"
                        >
                          <X size={14} />
                        </button>
                      )}

                      {/* Status Badges */}
                      <span className={`text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded border ${
                        working ? 'bg-indigo-500/15 border-indigo-500/25 text-indigo-400 animate-pulse' :
                        completed ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' :
                        failed ? 'bg-red-500/15 border-red-500/20 text-red-500' :
                        canceled ? 'bg-neutral-950 border-neutral-800 text-neutral-600' :
                        sub ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Body elements / progress indicators */}
                  {completed ? (
                    <div className="pt-2 bg-neutral-950/40 p-3 rounded-lg border border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-neutral-300 font-semibold font-mono">
                          <CheckCircle2 size={13} className="text-emerald-400" /> Compiled successfully.
                        </div>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          Specs: {job.output?.metadata.resolution} @ {job.settings.fps}FPS • {job.output?.metadata.totalFrames} frames packed • Signature: {job.output?.metadata.hashSignature}
                        </p>
                      </div>

                      {job.output?.blobUrl && (
                        <a
                          href={job.output.blobUrl}
                          download={job.output.fileName}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-500/10 text-center"
                        >
                          <Download size={14} /> Download ({formatSize(job.output.fileSizeEstimateBytes)})
                        </a>
                      )}
                    </div>
                  ) : failed ? (
                    <div className="pt-2 bg-red-500/5 p-3 rounded-lg border border-red-500/20 text-xs flex items-start gap-2 text-red-300/80 leading-relaxed font-mono">
                      <AlertOctagon size={14} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <strong>Fatal Engine Failure:</strong> {job.error}
                      </div>
                    </div>
                  ) : canceled ? (
                    <div className="pt-2 text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                      <Ban size={12} /> Render operation manually aborted at frame {job.currentFrame}/{job.totalFrames}.
                    </div>
                  ) : (
                    // Rendering details
                    <div className="space-y-3 pt-2">
                       <div className="flex justify-between items-center text-xs">
                         <span className="text-neutral-400 font-mono">
                           Progress Frames: <strong className="text-white font-semibold">{job.currentFrame}</strong> / {job.totalFrames}
                         </span>
                         <span className="font-mono text-indigo-400 font-bold">{job.progressPercent}%</span>
                       </div>

                       {/* Progress slider container bar */}
                       <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                         <div 
                           className={`h-full rounded-full transition-all duration-300 ${
                             sub ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-pink-500'
                           }`} 
                           style={{ width: `${job.progressPercent}%` }} 
                         />
                       </div>

                       <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] font-mono text-neutral-400 pt-1">
                         <div className="flex items-center gap-1">
                           <Clock size={12} className="text-neutral-500" />
                           <span>Elapsed: {formatDuration(job.timeElapsedMs)}</span>
                         </div>
                         {!sub && (
                           <div className="flex items-center gap-1">
                             <Clock size={12} className="text-indigo-400 animate-pulse" />
                             <span>ETA remaining: {formatDuration(job.timeEstimatedMs)}</span>
                           </div>
                         )}
                         <div className="flex items-center gap-1 text-neutral-500">
                           <span>• Width: {job.settings.resolutionPreset === 'Custom' ? job.settings.customWidth : 1920}px • Format: {job.settings.exportType}</span>
                         </div>
                       </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
export { globalJobManager };
