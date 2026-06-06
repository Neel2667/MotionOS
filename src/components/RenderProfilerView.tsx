import React, { useState, useEffect } from 'react';
import { RenderProfiler, ProfilePassData } from '../engine/render/RenderProfiler';
import { Gauge, Flame, AlertTriangle, Cpu, TrendingUp } from 'lucide-react';

export function RenderProfilerView() {
  const [metrics, setMetrics] = useState<ProfilePassData[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const updateMetrics = () => {
      const prof = RenderProfiler.getInstance();
      setMetrics(prof.getMetrics());
      setSummary(prof.getSummary());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!summary) {
    return <div className="p-4 text-xs font-mono text-neutral-500">Loading Render Profiler...</div>;
  }

  return (
    <div className="bg-[#0f0f12] border border-neutral-800/80 rounded-xl p-5 shadow-lg font-mono text-xs text-neutral-300">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Graphics Pipeline Profiler (VRAM Bottlenecks)</h2>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <TrendingUp size={12} className="text-indigo-400" /> Avg Efficiency: <span className="font-bold text-white">{summary.averageEfficiency}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <div className="bg-neutral-900/40 p-2.5 rounded border border-neutral-850">
          <span className="text-[10px] text-neutral-500 block uppercase">Total Frame time (CPU bound)</span>
          <p className="text-sm font-black text-neutral-200 mt-1">{summary.totalCpuTimeMs.toFixed(3)} ms</p>
        </div>
        <div className="bg-neutral-900/40 p-2.5 rounded border border-neutral-850">
          <span className="text-[10px] text-neutral-500 block uppercase">Total Frame time (GPU target bound)</span>
          <p className="text-sm font-black text-violet-400 mt-1">{summary.totalGpuTimeMs.toFixed(3)} ms</p>
        </div>
        <div className="bg-neutral-900/40 p-2.5 rounded border border-neutral-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Detected Bottleneck</span>
            <code className="text-[10px] text-amber-500 font-bold block mt-1 uppercase">{summary.bottleneckPassId}</code>
          </div>
          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
        </div>
      </div>

      {/* Render passes progress profile bars */}
      <div className="space-y-3.5">
        {metrics.map(pass => {
          const ratio = (pass.gpuTimeMs / summary.totalGpuTimeMs) * 100;
          return (
            <div key={pass.passId} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-200">{pass.passName}</span>
                <span className="text-neutral-500">
                  CPU: <span className="text-neutral-300 font-bold">{pass.cpuTimeMs}ms</span> | GPU: <span className="text-indigo-300 font-bold">{pass.gpuTimeMs}ms</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-neutral-900 h-2 rounded overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full" style={{ width: `${ratio}%` }} />
                </div>
                <div className="min-w-16 text-right">
                  <code className="text-[10px] text-neutral-400">{pass.memoryBandwidthGbps} GB/s</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
