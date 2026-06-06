import React, { useState, useEffect } from 'react';
import { WebGPUManager } from '../engine/webgpu/WebGPUManager';
import { GPUBufferManager } from '../engine/webgpu/GPUBufferManager';
import { ShaderLibrary } from '../engine/webgpu/ShaderLibrary';
import { ComputeDispatcher } from '../engine/webgpu/ComputeDispatcher';
import { Cpu, Maximize2, Server, HelpCircle, HardDrive, Shield } from 'lucide-react';

export function GPUInspector() {
  const [gpustatus, setGpuStatus] = useState<any>(null);
  const [buffers, setBuffers] = useState<any[]>([]);
  const [shaders, setShaders] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);

  useEffect(() => {
    const updateStats = () => {
      const gpuMgr = WebGPUManager.getInstance();
      const bufMgr = GPUBufferManager.getInstance();
      const shaderMgr = ShaderLibrary.getInstance();
      const computeMgr = ComputeDispatcher.getInstance();

      setGpuStatus(gpuMgr.getStatus());
      setBuffers(bufMgr.getBuffers());
      setShaders(shaderMgr.getShaders());
      setPipelines(computeMgr.getPipelines());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!gpustatus) {
    return (
      <div className="p-6 bg-[#0f0e12] text-neutral-400 font-mono text-xs">
        Loading WebGPU Manager Pipeline...
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f11] border border-neutral-800/80 rounded-xl p-5 shadow-2.5xl font-mono text-xs text-neutral-300">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Server className="text-violet-400 animate-pulse" size={16} />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">WebGPU Pipeline & Resource Inspector</h2>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-violet-950/20 border border-violet-500/20 text-violet-400 text-[10px]">
          <Shield size={10} /> Active: {gpustatus.adapter ? 'Hardware-Accelerated' : 'Emulated'}
        </div>
      </div>

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-850">
          <span className="text-[10px] text-neutral-500 block uppercase">Virtual GPU Core</span>
          <p className="text-neutral-200 font-bold mt-1 line-clamp-1">{gpustatus.adapter?.deviceLabel || 'Default Core'}</p>
          <span className="text-[9px] text-neutral-600 block mt-1">Architecture: {gpustatus.adapter?.architecture}</span>
        </div>
        <div className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-850">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-neutral-500 block uppercase">Mapped Frame VRAM</span>
            <span className="text-[10px] text-violet-400">{gpustatus.memoryPercentage}%</span>
          </div>
          <div className="w-full bg-neutral-850 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-violet-500 h-full transition-all duration-300" style={{ width: `${gpustatus.memoryPercentage}%` }} />
          </div>
          <span className="text-[9px] text-neutral-600 block mt-1.5">Used: {gpustatus.memoryUsedMb}MB / {gpustatus.memoryLimitMb}MB</span>
        </div>
        <div className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-850">
          <span className="text-[10px] text-neutral-500 block uppercase">Pipeline Cache Health</span>
          <p className="text-emerald-400 font-bold mt-1 text-lg">
            {gpustatus.pipelineCacheEfficiency}%
          </p>
          <span className="text-[9px] text-neutral-600 block mt-0.5">Active pipelines: {gpustatus.pipelineCacheCount}</span>
        </div>
      </div>

      {/* Core Tabs Sections */}
      <div className="space-y-4">
        {/* Buffer Tracker */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <HardDrive size={13} className="text-neutral-500" />
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active GPU Buffers ({buffers.length})</h3>
          </div>
          <div className="max-h-48 overflow-y-auto border border-neutral-850 rounded-lg divide-y divide-neutral-900 bg-neutral-950/40">
            {buffers.map(buf => (
              <div key={buf.id} className="p-2.5 flex items-center justify-between hover:bg-neutral-900/50">
                <div>
                  <p className="font-semibold text-neutral-200 text-[11px]">{buf.label}</p>
                  <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                    ID: <span className="text-neutral-400">{buf.id}</span> | Target: <span className="text-indigo-400">{buf.usageType.toUpperCase()}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-neutral-300">{(buf.sizeBytes / 1024).toFixed(0)} KB</p>
                  <p className="text-[9px] text-neutral-600">Updated: {new Date(buf.lastUpdatedTimeMs).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shader Registration */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Cpu size={13} className="text-neutral-500" />
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Shader Collection ({shaders.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {shaders.map(sh => (
              <div key={sh.id} className="p-2.5 bg-neutral-950/35 border border-neutral-900 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-200 text-[11px]">{sh.name}</p>
                  <code className="text-[9px] text-violet-400/80 mt-0.5 block">{sh.id}.wgsl</code>
                </div>
                <div className="text-right">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/40">
                    Compiled
                  </span>
                  <p className="text-[8px] text-neutral-600 mt-1">{sh.compilationTimeMs}ms delay</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
