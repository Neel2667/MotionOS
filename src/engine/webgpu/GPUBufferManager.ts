export interface GPUBufferTracker {
  id: string;
  label: string;
  sizeBytes: number;
  usageType: 'storage' | 'uniform' | 'vertex' | 'index' | 'readback';
  allocated: boolean;
  boundPipelineId: string | null;
  lastUpdatedTimeMs: number;
}

export class GPUBufferManager {
  private static instance: GPUBufferManager | null = null;
  private buffers = new Map<string, GPUBufferTracker>();
  private totalAllocatedBytes = 0;
  private memoryLimitBytes = 2048 * 1024 * 1024; // 2GB Virtual VRAM

  public static getInstance(): GPUBufferManager {
    if (!GPUBufferManager.instance) {
      GPUBufferManager.instance = new GPUBufferManager();
      GPUBufferManager.instance.allocatePrebuffers();
    }
    return GPUBufferManager.instance;
  }

  private constructor() {}

  private allocatePrebuffers() {
    // Allocation of static, predivided pools for high-framerate rendering
    this.createBuffer('pre-vbo-0', 'Scene Vertex Preallocated Buffer', 512 * 1024, 'vertex');
    this.createBuffer('pre-ibo-0', 'Scene Index Preallocated Buffer', 256 * 1024, 'index');
    this.createBuffer('motion-storage-0', 'Motion DNA Storage Buffer A', 1024 * 1024, 'storage');
    this.createBuffer('motion-storage-1', 'Motion DNA Storage Buffer B', 1024 * 1024, 'storage');
    this.createBuffer('particle-state-vbo', 'Compute Particles Double Buffer', 2048 * 1024, 'storage');
    this.createBuffer('uniform-camera-cfg', 'Cinematic Camera Uniform Buffer', 16 * 1024, 'uniform');
    this.createBuffer('rendering-draw-calls', 'Multi-Indirect Draw Draw Call Buffer', 64 * 1024, 'indirect' as any);
  }

  public createBuffer(
    id: string,
    label: string,
    sizeBytes: number,
    usageType: GPUBufferTracker['usageType']
  ): GPUBufferTracker {
    if (this.buffers.has(id)) {
      const existing = this.buffers.get(id)!;
      this.totalAllocatedBytes -= existing.sizeBytes;
      existing.sizeBytes = sizeBytes;
      existing.usageType = usageType;
      existing.lastUpdatedTimeMs = Date.now();
      this.totalAllocatedBytes += sizeBytes;
      return existing;
    }

    const tracker: GPUBufferTracker = {
      id,
      label,
      sizeBytes,
      usageType,
      allocated: true,
      boundPipelineId: null,
      lastUpdatedTimeMs: Date.now(),
    };

    this.buffers.set(id, tracker);
    this.totalAllocatedBytes += sizeBytes;
    return tracker;
  }

  public getBuffer(id: string): GPUBufferTracker | undefined {
    return this.buffers.get(id);
  }

  public getBuffers(): GPUBufferTracker[] {
    return Array.from(this.buffers.values());
  }

  public bindBufferToPipeline(id: string, pipelineId: string) {
    const buf = this.buffers.get(id);
    if (buf) {
      buf.boundPipelineId = pipelineId;
      buf.lastUpdatedTimeMs = Date.now();
    }
  }

  public lazyAllocate(id: string, label: string, desiredSize: number, type: GPUBufferTracker['usageType']): GPUBufferTracker {
    const existing = this.buffers.get(id);
    if (existing) {
      if (existing.sizeBytes >= desiredSize) {
        return existing;
      }
      return this.createBuffer(id, label, desiredSize, type);
    }
    return this.createBuffer(id, label, desiredSize, type);
  }

  public updateBufferDataIncremental(id: string, sizeUpdated: number) {
    const buf = this.buffers.get(id);
    if (buf) {
      buf.lastUpdatedTimeMs = Date.now();
    }
  }

  public releaseBuffer(id: string) {
    const buf = this.buffers.get(id);
    if (buf) {
      this.totalAllocatedBytes -= buf.sizeBytes;
      this.buffers.delete(id);
    }
  }

  public getMemoryStats() {
    return {
      usedBytes: this.totalAllocatedBytes,
      limitBytes: this.memoryLimitBytes,
      utilizationPercentage: (this.totalAllocatedBytes / this.memoryLimitBytes) * 100,
    };
  }
}
