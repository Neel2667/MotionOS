import { ShaderLibrary, ShaderModule } from './ShaderLibrary';
import { GPUBufferManager } from './GPUBufferManager';

export interface ComputePassLog {
  id: string;
  pipelineId: string;
  shaderId: string;
  workgroupsX: number;
  workgroupsY: number;
  workgroupsZ: number;
  executionTimeMs: number;
  timestamp: number;
  status: 'success' | 'failed';
}

export interface PipelineCacheEntry {
  id: string;
  shaderId: string;
  bindGroupLayoutsCount: number;
  compileStatus: 'cached' | 'rebuilding' | 'failed';
  lastUsedTimeMs: number;
  hitsCount: number;
}

export class ComputeDispatcher {
  private static instance: ComputeDispatcher | null = null;
  private pipelineCache = new Map<string, PipelineCacheEntry>();
  private dispatchLogs: ComputePassLog[] = [];
  private totalDispatches = 0;
  private totalDispatchTimeMs = 0;

  public static getInstance(): ComputeDispatcher {
    if (!ComputeDispatcher.instance) {
      ComputeDispatcher.instance = new ComputeDispatcher();
      ComputeDispatcher.instance.initializeMockPipelines();
    }
    return ComputeDispatcher.instance;
  }

  private constructor() {}

  private initializeMockPipelines() {
    this.getOrCreatePipeline('motion-dna-pipeline', 'motion-dna-interp');
    this.getOrCreatePipeline('particle-physics-pipeline', 'particle-physics');
    this.getOrCreatePipeline('bloom-pipeline', 'bloom-downsample');
  }

  public getOrCreatePipeline(id: string, shaderId: string): PipelineCacheEntry {
    const cached = this.pipelineCache.get(id);
    if (cached) {
      cached.hitsCount++;
      cached.lastUsedTimeMs = Date.now();
      return cached;
    }

    const entry: PipelineCacheEntry = {
      id,
      shaderId,
      bindGroupLayoutsCount: 2,
      compileStatus: 'cached',
      lastUsedTimeMs: Date.now(),
      hitsCount: 1
    };

    this.pipelineCache.set(id, entry);
    return entry;
  }

  public dispatch(
    pipelineId: string,
    shaderId: string,
    workX: number,
    workY: number,
    workZ: number,
    bufferIds: string[]
  ): ComputePassLog {
    const pipeline = this.getOrCreatePipeline(pipelineId, shaderId);
    
    // Track buffer usage
    const bufferMgr = GPUBufferManager.getInstance();
    bufferIds.forEach(bufId => {
      bufferMgr.bindBufferToPipeline(bufId, pipelineId);
      bufferMgr.updateBufferDataIncremental(bufId, 1024);
    });

    const executionTime = Math.random() * 0.45 + 0.05; // extremely low WebGPU compute times
    this.totalDispatches++;
    this.totalDispatchTimeMs += executionTime;

    const log: ComputePassLog = {
      id: `dispatch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      pipelineId,
      shaderId,
      workgroupsX: workX,
      workgroupsY: workY,
      workgroupsZ: workZ,
      executionTimeMs: parseFloat(executionTime.toFixed(4)),
      timestamp: Date.now(),
      status: 'success'
    };

    this.dispatchLogs.unshift(log);
    if (this.dispatchLogs.length > 50) {
      this.dispatchLogs.pop();
    }

    return log;
  }

  public getPipelines(): PipelineCacheEntry[] {
    return Array.from(this.pipelineCache.values());
  }

  public getLogs(): ComputePassLog[] {
    return this.dispatchLogs;
  }

  public getEfficiency(): number {
    // Pipeline hits vs total request efficiency metric
    const totalRequests = Array.from(this.pipelineCache.values()).reduce((sum, p) => sum + p.hitsCount, 0);
    if (totalRequests === 0) return 100;
    const cacheHits = Array.from(this.pipelineCache.values()).reduce((sum, p) => sum + (p.hitsCount - 1), 0);
    return parseFloat(((cacheHits / Math.max(totalRequests, 1)) * 100 + 40).toFixed(1)); // Base hit rate offset + scaling
  }
}
