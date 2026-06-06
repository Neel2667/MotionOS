import { FrameGraph } from './FrameGraph';
import { RenderGraph } from './RenderGraph';
import { RenderStatistics } from './RenderStatistics';
import { RenderProfiler } from './RenderProfiler';
import { RenderScheduler } from './RenderScheduler';
import { WebGPUManager } from '../webgpu/WebGPUManager';

export class RenderCoordinator {
  private static instance: RenderCoordinator | null = null;
  private frameGraph: FrameGraph;
  private renderGraph: RenderGraph;
  private stats: RenderStatistics;
  private profiler: RenderProfiler;
  private scheduler: RenderScheduler;
  private currentFrameStatus: 'idle' | 'rendering' | 'completed' | 'compiling-shaders' = 'idle';
  private frameCount = 0;

  public static getInstance(): RenderCoordinator {
    if (!RenderCoordinator.instance) {
      RenderCoordinator.instance = new RenderCoordinator();
    }
    return RenderCoordinator.instance;
  }

  private constructor() {
    this.frameGraph = new FrameGraph();
    this.renderGraph = RenderGraph.getInstance();
    this.stats = RenderStatistics.getInstance();
    this.profiler = RenderProfiler.getInstance();
    this.scheduler = RenderScheduler.getInstance();
  }

  public getFrameGraph(): FrameGraph {
    return this.frameGraph;
  }

  public getRenderGraph(): RenderGraph {
    return this.renderGraph;
  }

  public getStats(): RenderStatistics {
    return this.stats;
  }

  public getProfiler(): RenderProfiler {
    return this.profiler;
  }

  public getScheduler(): RenderScheduler {
    return this.scheduler;
  }

  public executeFrame(): number {
    this.currentFrameStatus = 'rendering';
    this.frameCount++;
    const executionTimeMs = this.frameGraph.executeAll();
    
    // Simulate updating GPU profiling statistics dynamically
    this.profiler.recordMetric(
      'deferred-lighting',
      'Physically-Based Lighting Resolver',
      0.65 + Math.random() * 0.05,
      0.45 + Math.random() * 0.04,
      345.8 + Math.random() * 5,
      92 + Math.floor(Math.random() * 3)
    );

    const gpuTelem = WebGPUManager.getInstance().getStatus();
    this.stats.trackFrame(
      45 + Math.floor(Math.random() * 10),
      124000 + Math.floor(Math.random() * 2000),
      24,
      gpuTelem.memoryUsedMb
    );

    this.currentFrameStatus = 'completed';
    return executionTimeMs;
  }

  public triggerCompileShaders() {
    this.currentFrameStatus = 'compiling-shaders';
    setTimeout(() => {
      this.currentFrameStatus = 'idle';
    }, 500);
  }

  public getStatus() {
    return {
      currentStatus: this.currentFrameStatus,
      totalFramesRendered: this.frameCount,
      viewportWidth: this.renderGraph.getDimensions().width,
      viewportHeight: this.renderGraph.getDimensions().height,
      gpuBackend: WebGPUManager.getInstance().getStatus().adapter?.backend || 'vulkan'
    };
  }
}
