import React, { useState, useEffect } from 'react';
import { WorkerPool } from '../engine/jobs/WorkerPool';
import { RenderWorker } from '../engine/jobs/RenderWorker';
import { Users, Plus, Minus, ServerCrash, Cpu, Activity, Zap } from 'lucide-react';

export function WorkerMonitor() {
  const [workers, setWorkers] = useState<RenderWorker[]>([]);
  const [stats, setStats] = useState<any>(null);

  const updateList = () => {
    const pool = WorkerPool.getInstance();
    // Copy reference elements to trigger React component updates
    setWorkers([...pool.getWorkers()]);
    setStats(pool.getDiagnostics());
  };

  useEffect(() => {
    updateList();
    const interval = setInterval(updateList, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScaleUp = () => {
    const pool = WorkerPool.getInstance();
    pool.scaleUp('Dynamo Ext');
    updateList();
  };

  const handleScaleDown = () => {
    const pool = WorkerPool.getInstance();
    pool.scaleDown();
    updateList();
  };

  if (!stats) {
    return (
      <div className="p-4 text-xs font-mono text-neutral-500">
        Loading Worker Monitoring Cluster...
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e10] border border-neutral-800/80 rounded-xl p-5 shadow-xl font-mono text-xs text-neutral-300">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="text-emerald-400" size={16} />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Multi-Threaded Worker Pool</h2>
        </div>
        <div className="flex gap-1.5">
          <button 
            onClick={handleScaleDown}
            className="p-1 px-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition"
            title="Scale down cluster cores"
          >
            <Minus size={12} />
          </button>
          <button 
            onClick={handleScaleUp}
            className="p-1 px-2 rounded bg-neutral-900 border border-neutral-800 hover:bg-emerald-950/40 hover:text-emerald-400 hover:border-emerald-800 transition"
            title="Scale up cluster cores"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-neutral-900/40 p-2 border border-neutral-850 rounded">
          <span className="text-[9px] text-neutral-500 block uppercase">Cluster Cores</span>
          <p className="text-sm font-bold text-neutral-200 mt-1">{stats.totalThreads} Threads</p>
        </div>
        <div className="bg-neutral-900/40 p-2 border border-neutral-850 rounded">
          <span className="text-[9px] text-neutral-500 block uppercase">Active Cores</span>
          <p className="text-sm font-bold text-amber-400 mt-1">{stats.busyThreads} Working</p>
        </div>
        <div className="bg-neutral-900/40 p-2 border border-neutral-850 rounded">
          <span className="text-[9px] text-neutral-500 block uppercase">Offline Cores</span>
          <p className="text-sm font-bold text-neutral-500 mt-1">{stats.offlineThreads} Idle</p>
        </div>
        <div className="bg-neutral-900/40 p-2 border border-neutral-850 rounded">
          <span className="text-[9px] text-neutral-500 block uppercase">Co-Processing Efficiency</span>
          <p className="text-sm font-bold text-emerald-400 mt-1">{stats.aggregateUtilization.toFixed(0)}%</p>
        </div>
      </div>

      {/* Workers list */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {workers.map(worker => (
          <div key={worker.id} className="p-2 bg-neutral-950/40 border border-neutral-900 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${worker.state === 'busy' ? 'bg-amber-400 animate-pulse' : (worker.state === 'idle' ? 'bg-emerald-400' : 'bg-neutral-600')}`} />
              <div>
                <p className="font-bold text-neutral-200 text-[11px]">{worker.label}</p>
                <p className="text-[9px] text-neutral-500 font-mono">
                  Core Factor: <span className="text-neutral-400">{worker.coreFactor}x</span> | ID: <span className="text-neutral-400">{worker.id}</span>
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold ${worker.state === 'busy' ? 'bg-amber-950/20 text-amber-400 border border-amber-500/20' : 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20'}`}>
                {worker.state}
              </span>
              <p className="text-[9px] text-neutral-600 mt-1">Processed: <span className="font-bold text-neutral-400">{worker.completedTaskCount} frames</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
