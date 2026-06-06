import React, { useState, useEffect } from 'react';
import { QueueManager, RenderJob } from '../engine/jobs/QueueManager';
import { DistributedJobScheduler } from '../engine/jobs/DistributedJobScheduler';
import { WorkerPool } from '../engine/jobs/WorkerPool';
import { WebGPUManager } from '../engine/webgpu/WebGPUManager';
import { Play, Pause, Trash2, Plus, Clock, HelpCircle, Film, CheckCircle2, ChevronRight, LayoutGrid } from 'lucide-react';

export function RenderCenter() {
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<any>(null);
  const [vramMb, setVramMb] = useState(112);

  const updateAllStats = () => {
    const queue = QueueManager.getInstance();
    const sched = DistributedJobScheduler.getInstance();
    
    setJobs(queue.getJobs());
    setSchedulerStatus(sched.getStatus());

    const webGPUMem = WebGPUManager.getInstance().getMemoryReport();
    setVramMb(parseFloat((webGPUMem.usedBytes / (1024 * 1024)).toFixed(1)));
  };

  useEffect(() => {
    // Start automated scheduler processes
    DistributedJobScheduler.getInstance().startScheduler();
    updateAllStats();
    
    const interval = setInterval(updateAllStats, 800);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleToggleScheduler = () => {
    const sched = DistributedJobScheduler.getInstance();
    const status = sched.getStatus();
    if (status.running) {
      sched.stopScheduler();
    } else {
      sched.startScheduler();
    }
    updateAllStats();
  };

  const handleAddPreviewJob = () => {
    const queue = QueueManager.getInstance();
    const id = `job-${Date.now()}`;
    queue.addJob({
      id,
      name: `Procedural Cinematic Motion DNA Track (Job #${Math.floor(Math.random() * 900) + 100})`,
      projectId: 'temp-preview',
      priority: 'high',
      totalFrames: 180,
      processedFrames: 0,
      status: 'queued',
      timestamp: Date.now()
    });
    updateAllStats();
  };

  const handleClearQueues = () => {
    const queue = QueueManager.getInstance();
    queue.clearQueue();
    updateAllStats();
  };

  if (!schedulerStatus) {
    return <div className="p-4 text-xs font-mono text-neutral-500">Retrieving Render Pipeline Diagnostics...</div>;
  }

  const activeJob = jobs.find(j => j.status === 'rendering');

  return (
    <div className="bg-[#0b0b0d] border border-neutral-800 rounded-xl p-5 shadow-2xl font-mono text-xs text-neutral-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-850 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Film className="text-indigo-400" size={17} />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Production Rendering & Job Orchestration</h2>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Multi-core render queue pipelines with dynamic runtime priority sorting.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddPreviewJob}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold hover:shadow-lg transition flex items-center gap-1 text-[10px]"
          >
            <Plus size={11} /> Queue Render Job
          </button>
          <button 
            onClick={handleToggleScheduler}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1 text-[10px] ${schedulerStatus.running ? 'bg-amber-955 bg-amber-950/40 text-amber-400 border border-amber-800' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'}`}
          >
            {schedulerStatus.running ? <><Pause size={11} /> Pause Cluster</> : <><Play size={11} /> Start Cluster</>}
          </button>
          <button 
            onClick={handleClearQueues}
            className="p-1.5 rounded border border-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-500 transition"
            title="Purge queued jobs"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Progress Telemetry */}
      {activeJob && (
        <div className="bg-neutral-900/60 border border-neutral-850 rounded-lg p-3.5 mb-5 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-neutral-200">Processing: {activeJob.name}</span>
            <span className="text-indigo-400 font-bold">{Math.round((activeJob.processedFrames / activeJob.totalFrames) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${(activeJob.processedFrames / activeJob.totalFrames) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500">
            <span>Frames completed: {activeJob.processedFrames} / {activeJob.totalFrames}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> EST Time Remaining: {schedulerStatus.estimatedTimeRemainingSec} seconds</span>
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div>
        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">Live Queue States ({jobs.length} Items)</h3>
        <div className="border border-neutral-850 rounded-lg overflow-hidden bg-neutral-950/40 divide-y divide-neutral-900">
          {jobs.length === 0 ? (
            <div className="p-6 text-center text-neutral-500 font-mono text-xs">
              No active rendering jobs. Queue a preview job above to verify pipeline throughput!
            </div>
          ) : (
            jobs.map(job => {
              const pct = Math.round((job.processedFrames / job.totalFrames) * 100);
              return (
                <div key={job.id} className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-900/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-emerald-400' : (job.status === 'rendering' ? 'bg-indigo-400 animate-pulse' : 'bg-neutral-600')}`} />
                      <p className="font-semibold text-neutral-200 text-[11px] leading-tight line-clamp-1">{job.name}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                      <span>Project: <strong className="text-neutral-400 font-normal">{job.projectId}</strong></span>
                      <span>Priority: <strong className={`uppercase ${job.priority === 'high' ? 'text-rose-400' : (job.priority === 'normal' ? 'text-amber-400' : 'text-neutral-500')}`}>{job.priority}</strong></span>
                      <span>Created: {new Date(job.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${job.status === 'completed' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' : (job.status === 'rendering' ? 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/40' : 'bg-neutral-900 text-neutral-400 border border-neutral-800')}`}>
                        {job.status}
                      </span>
                      <p className="text-[10px] text-neutral-400 mt-1 font-bold">{job.processedFrames} / {job.totalFrames} frames ({pct}%)</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
