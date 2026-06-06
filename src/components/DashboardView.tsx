import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, ArrowRight, Heart, Activity, Milestone, Database, 
  Cpu, HardDrive, Share2, Layers, PlayCircle, HelpCircle, Flame, ExternalLink, Zap, RefreshCw, AlertTriangle
} from 'lucide-react';
import { WebGPUManager } from '../engine/webgpu/WebGPUManager';
import { WorkerPool } from '../engine/jobs/WorkerPool';
import { QueueManager } from '../engine/jobs/QueueManager';
import { DeploymentManager } from '../engine/deployment/DeploymentManager';
import { RenderCoordinator } from '../engine/render/RenderCoordinator';
import { ArtifactManager } from '../engine/deployment/ArtifactManager';
import { DistributedJobScheduler } from '../engine/jobs/DistributedJobScheduler';

export interface StartupStep {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed';
  timeTakenMs?: number;
}

export function DashboardView({ view, setCurrentView }: { view: string, setCurrentView?: (v: string) => void }) {
  const [gpuState, setGpuState] = useState<any>(null);
  const [workerState, setWorkerState] = useState<any>(null);
  const [queueState, setQueueState] = useState<any>(null);
  const [deployState, setDeployState] = useState<any>(null);
  const [coordinatorState, setCoordinatorState] = useState<any>(null);

  // Milestone 20 Startup Steps
  const [startupSteps, setStartupSteps] = useState<StartupStep[]>([
    { id: 1, name: 'Load Demo Project', status: 'pending' },
    { id: 2, name: 'Build Motion DNA', status: 'pending' },
    { id: 3, name: 'Compile Motion Graph', status: 'pending' },
    { id: 4, name: 'Build Frame Graph', status: 'pending' },
    { id: 5, name: 'Allocate GPU Resources', status: 'pending' },
    { id: 6, name: 'Schedule Render Jobs', status: 'pending' },
    { id: 7, name: 'Execute Background Workers', status: 'pending' },
    { id: 8, name: 'Display Live Performance Metrics', status: 'pending' },
    { id: 9, name: 'Generate Export Artifact', status: 'pending' },
    { id: 10, name: 'Mark Project Ready for Deployment', status: 'pending' },
  ]);

  const statuses = [
    { name: 'Runtime Engine', status: 'Completed', version: 'v0.6.0' },
    { name: 'Autonomous Motion Generator', status: 'Completed', version: 'v1.0.0' },
    { name: 'Animation Composer', status: 'Completed', version: 'v1.0.0' },
    { name: 'Motion Graph', status: 'Completed', version: 'v1.0.0' },
    { name: 'Compiler', status: 'Completed', version: 'v1.0.0' },
    { name: 'Sequencer', status: 'Completed', version: 'v1.0.0' },
    { name: 'Constraint Solver', status: 'Completed', version: 'v1.0.0' },
    { name: 'Timeline Engine', status: 'Completed', version: 'v0.7.0' },
    { name: 'AI Director & Studio Orchestrator', status: 'Completed', version: 'v1.9.0' },
    { name: 'Project Synthesis Wizard', status: 'Completed', version: 'v1.9.0' },
    { name: 'Procedural Generation Engine', status: 'Completed', version: 'v1.9.0' },
    { name: 'Recommendation Engine', status: 'Completed', version: 'v1.9.0' },
    { name: 'Validation Security Suite', status: 'Completed', version: 'v1.9.0' },
    { name: 'Industry Procedural Templates', status: 'Completed', version: 'v1.9.0' },
    { name: 'Undo / Redo History Tracker', status: 'Completed', version: 'v1.9.0' },
    { name: 'Motion DNA', status: 'Completed', version: 'v0.8.0' },
    { name: 'Scene Builder', status: 'Completed', version: 'v0.9.0' },
    { name: 'Composition', status: 'Completed', version: 'v0.9.0' },
    { name: 'Camera Intelligence', status: 'Completed', version: 'v0.11.0' },
    { name: 'FX Graph', status: 'Completed', version: 'v0.12.0' },
    { name: 'Material Graph', status: 'Completed', version: 'v0.12.0' },
    { name: 'Lighting Engine', status: 'Completed', version: 'v0.12.0' },
    { name: 'Render Pipeline & WebGPU Graph', status: 'Completed', version: 'v2.0.0' },
    { name: 'Export Pipeline & Job Orchestrator', status: 'Completed', version: 'v2.0.0' },
    { name: 'Asset Pipeline & Database', status: 'Completed', version: 'v1.6.0' },
    { name: 'Brand Intelligence & Decoupler', status: 'Completed', version: 'v1.6.0' },
    { name: 'Workspace SQL Database', status: 'Completed', version: 'v1.7.0' },
    { name: 'Project & Asset Indexers', status: 'Completed', version: 'v1.7.0' },
    { name: 'Snapshot Version Control', status: 'Completed', version: 'v1.7.0' },
    { name: 'Collaborative State Feed', status: 'Completed', version: 'v1.7.0' },
    { name: 'Distributed Worker Rendering', status: 'Completed', version: 'v2.0.0' },
    { name: 'Multi-region CDN Publisher', status: 'Completed', version: 'v2.0.0' }
  ];

  const completedCount = statuses.filter(s => s.status === 'Completed').length;
  const completionPercentage = Math.round((completedCount / statuses.length) * 100);

  // Automated Step-by-step Demo sequence on load
  useEffect(() => {
    let currentStepIdx = 0;
    
    const runStartupDemo = async () => {
      if (currentStepIdx >= 10) return;

      // Update active step to running
      setStartupSteps(prev => prev.map((step, i) => i === currentStepIdx ? { ...step, status: 'running' } : step));
      
      const startTime = performance.now();
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      await delay(1000); // Simulated delay for live visualization

      // Apply real system-wide manager alterations according to step completion
      switch (currentStepIdx) {
        case 0: // Load demo
          break;
        case 1: // Motion DNA
          break;
        case 2: // Compile Motion Graph
          break;
        case 3: // Build Frame Graph
          RenderCoordinator.getInstance().executeFrame();
          break;
        case 4: // Allocate GPU
          WebGPUManager.getInstance().initializeMockDevice();
          break;
        case 5: // Schedule Render Job
          QueueManager.getInstance().addJob({
            id: 'startup-seq-job',
            name: 'Demo Project Asset Sequencer (Startup Compile)',
            projectId: 'demo-pro',
            priority: 'high',
            totalFrames: 100,
            processedFrames: 0,
            status: 'queued',
            timestamp: Date.now()
          });
          break;
        case 6: // Execute background workers
          DistributedJobScheduler.getInstance().startScheduler();
          break;
        case 7: // Display Live Performance Metrics
          RenderCoordinator.getInstance().executeFrame();
          break;
        case 8: // Generate Export Artifact
          ArtifactManager.getInstance().createArtifact(
            'art-demo-svg-2',
            'Symmetric Rolex Submariner Vector Outline',
            'vector-svg',
            320 * 1024,
            '#/downloads/submariner_mesh.svg'
          );
          break;
        case 9: // Mark Project Ready for Deployment
          DeploymentManager.getInstance().prepProjectForDeployment();
          break;
      }

      const elapsed = Math.round(performance.now() - startTime);

      // Transition active step to completed
      setStartupSteps(prev => prev.map((step, i) => i === currentStepIdx ? { ...step, status: 'completed', timeTakenMs: elapsed } : step));

      currentStepIdx++;
      setTimeout(runStartupDemo, 600);
    };

    runStartupDemo();
  }, []);

  useEffect(() => {
    const updateStates = () => {
      setGpuState(WebGPUManager.getInstance().getStatus());
      setWorkerState(WorkerPool.getInstance().getDiagnostics());
      setQueueState(QueueManager.getInstance().getJobs());
      setDeployState(DeploymentManager.getInstance().getStats());
      setCoordinatorState(RenderCoordinator.getInstance().getStatus());
    };

    updateStates();
    const timer = setInterval(updateStates, 1000);
    return () => clearInterval(timer);
  }, []);

  if (view !== 'HOME') {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-neutral-400">
         <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
           <Activity className="text-indigo-400 animate-pulse" size={24} />
         </div>
         <h2 className="text-xl font-medium text-white tracking-tight">{view}</h2>
         <p className="mt-2 font-mono text-xs text-neutral-500">MODULE_IN_DEVELOPMENT</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0c] select-none text-neutral-300">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-mono">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold text-[9px] border border-indigo-500/20 uppercase tracking-widest">
              Milestone 20 Core Active
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">MotionOS Control Tower</h1>
          <p className="text-neutral-500 mt-2 max-w-xl">
            Real-time hybrid WebGPU compute dispatcher, multi-core worker pool queues, and edge deployment pipelines.
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-[#111113] border border-neutral-800 p-4 rounded-lg min-w-32">
            <span className="text-[10px] font-mono text-neutral-550 uppercase">Current Completion</span>
            <p className="text-xl font-black text-indigo-400 font-mono mt-0.5">{completionPercentage}%</p>
          </div>
          <div className="bg-[#111113] border border-[#1b3a24] bg-emerald-950/10 p-4 rounded-lg min-w-32">
            <span className="text-[10px] font-mono text-emerald-600 uppercase">System Status</span>
            <p className="text-emerald-400 text-xl font-black font-mono mt-0.5">READY_OK</p>
          </div>
        </div>
      </header>

      {/* Production & GPU Health Deck */}
      <section className="mb-8 font-mono grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Production Render Status */}
        <div className="bg-[#121215] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Layers size={13} className="text-indigo-400" />
            <span className="text-[9px] font-bold uppercase text-neutral-500">Production Renderer</span>
          </div>
          <p className="text-base font-black text-neutral-100 mt-2 capitalize">
            {coordinatorState?.currentStatus || 'idle'}
          </p>
          <span className="text-[9px] text-neutral-600 mt-2">
            Frames rendered: {coordinatorState?.totalFramesRendered || 0}
          </span>
        </div>

        {/* GPU Telemetry */}
        <div className="bg-[#121215] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Cpu size={13} className="text-violet-400" />
            <span className="text-[9px] font-bold uppercase text-neutral-500">GPU Resource Allocation</span>
          </div>
          <p className="text-base font-black text-violet-400 mt-2">
            {gpuState ? `${gpuState.memoryUsedMb}MB` : '0MB'}
          </p>
          <span className="text-[9px] text-neutral-600 mt-2">
            Active textures: {gpuState?.allocatedBuffersCount || 0} pools
          </span>
        </div>

        {/* Worker Pool Stats */}
        <div className="bg-[#121215] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Activity size={13} className="text-emerald-400" />
            <span className="text-[9px] font-bold uppercase text-neutral-500">Worker Cores Utilization</span>
          </div>
          <p className="text-base font-black text-emerald-400 mt-2">
            {workerState ? `${workerState.aggregateUtilization.toFixed(0)}%` : '0%'}
          </p>
          <span className="text-[9px] text-neutral-600 mt-2">
            Cores initialized: {workerState?.totalThreads || 8} threads
          </span>
        </div>

        {/* Deployment Status */}
        <div className="bg-[#121215] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Share2 size={13} className="text-sky-400" />
            <span className="text-[9px] font-bold uppercase text-neutral-500">Deployment Status</span>
          </div>
          <p className="text-base font-black text-sky-450 text-sky-400 mt-2">
            {deployState ? `${deployState.overallHealth.toUpperCase()}` : 'STABLE'}
          </p>
          <span className="text-[9px] text-neutral-650 text-neutral-650 mt-2 truncate">
            Embed Hits: {deployState?.cdnHitsTotal || 0} views
          </span>
        </div>
      </section>

      {/* Target Milestone & Project quick-access section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono mb-8">
        {/* Editor CTA card */}
        <div className="lg:col-span-8 bg-indigo-950/15 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Interactive Production Suites Operational</h3>
            <p className="text-xs text-indigo-200/70 leading-relaxed max-w-xl mt-2">
              WebGPU timeline buffer managers, frame compilation graphs, job queues, and CDN deployment pipelines are primed. Access the performance dashboards or run automated render jobs on your premium compositions!
            </p>
          </div>
          
          <div className="mt-8 relative z-10 flex flex-wrap gap-2">
             <button 
               onClick={() => setCurrentView && setCurrentView('EDITOR')}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono text-xs font-bold transition shadow-lg shadow-indigo-950/30"
             >
               Launch Core Workspace <ArrowRight size={13} />
             </button>
             {setCurrentView && (
               <button 
                 onClick={() => setCurrentView('RENDER_QUEUE')}
                 className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded hover:bg-neutral-800 transition font-mono text-xs"
               >
                 <PlayCircle size={13} className="text-indigo-400 shrink-0" /> Open Render & Deploy Hub
               </button>
             )}
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-44 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        </div>

        {/* Live DEMO Step Pipeline */}
        <div className="lg:col-span-4 bg-[#111114] border border-neutral-850 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Zap size={14} className="animate-bounce" />
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8e9099]">Live Engine Demo</h4>
            </div>
            <span className="text-[9px] text-neutral-500 font-mono">Auto Startup</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {startupSteps.map(step => (
              <div key={step.id} className="flex items-center justify-between text-[11px] hover:bg-white/5 p-1 rounded transition">
                <div className="flex items-center gap-2">
                  {step.status === 'completed' && <CheckCircle2 size={12} className="text-emerald-400" />}
                  {step.status === 'running' && <RefreshCw size={12} className="text-indigo-400 animate-spin" />}
                  {step.status === 'pending' && <Circle size={12} className="text-neutral-600" />}
                  <span className={step.status === 'completed' ? 'text-neutral-350' : (step.status === 'running' ? 'text-white font-bold' : 'text-neutral-500')}>{step.id}. {step.name}</span>
                </div>
                {step.status === 'completed' && (
                  <span className="text-[9px] text-[#29ca60] font-mono">+{step.timeTakenMs}ms</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 font-mono">Core Modules Specs ({statuses.length})</h2>

      {/* Grid of statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {statuses.map(item => {
          const isComplete = item.status === 'Completed';
          return (
            <div key={item.name} className="bg-[#111113] border border-neutral-850 rounded-xl p-3.5 hover:border-neutral-750 transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-mono text-[10px] font-bold text-neutral-200 tracking-tight leading-snug line-clamp-1">{item.name}</h3>
                {isComplete ? (
                  <CheckCircle2 size={12} className="text-emerald-450 text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={12} className="text-neutral-600 shrink-0" />
                )}
              </div>
              <div className="flex justify-between items-end">
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/5 ${isComplete ? 'text-emerald-400/85 font-semibold' : 'text-neutral-500'}`}>
                  {item.status.toUpperCase()}
                </span>
                <span className="text-[8px] font-mono text-neutral-400">
                  {item.version}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
