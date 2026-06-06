import React, { useState } from 'react';
import { RenderCenter } from './RenderCenter';
import { PerformanceDashboard } from './PerformanceDashboard';
import { DeploymentCenter } from './DeploymentCenter';
import { RefreshCw, Cpu, Globe, Database, HelpCircle, Film, BarChart3, CloudLightning } from 'lucide-react';

export function RenderQueueView() {
  const [activeTab, setActiveTab] = useState<'orchestration' | 'performance' | 'deployment'>('orchestration');

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0a0a0c] text-neutral-200">
      
      {/* Upper Brand Info Banner */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-neutral-850">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-2">
            <RefreshCw size={14} className="animate-spin-slow" /> MotionOS Production Systems
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Active Render & Deploy Hub</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Track multi-pass encoding, profile real-time WebGPU shaders, manage worker pools and release codebases directly.
          </p>
        </div>
      </header>

      {/* Tabs list navigation */}
      <div className="flex border-b border-neutral-850 gap-1.5 mb-6">
        <button 
          onClick={() => setActiveTab('orchestration')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold border-b-2 tracking-wide transition ${activeTab === 'orchestration' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-neutral-450 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'}`}
        >
          <Film size={13} />
          Queue & Job Orchestrator
        </button>
        <button 
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold border-b-2 tracking-wide transition ${activeTab === 'performance' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-neutral-450 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'}`}
        >
          <BarChart3 size={13} />
          WebGPU Performance Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('deployment')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold border-b-2 tracking-wide transition ${activeTab === 'deployment' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-neutral-450 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'}`}
        >
          <CloudLightning size={13} />
          CDN Deployment & Archival Center
        </button>
      </div>

      {/* Content dispatch area */}
      <div className="space-y-6">
        {activeTab === 'orchestration' && <RenderCenter />}
        {activeTab === 'performance' && <PerformanceDashboard />}
        {activeTab === 'deployment' && <DeploymentCenter />}
      </div>
    </div>
  );
}
export default RenderQueueView;
