export interface RenderTargetPool {
  id: string;
  width: number;
  height: number;
  format: 'rgba16float' | 'rgba8unorm' | 'depth32float';
  allocatedBytes: number;
  refCount: number;
}

export class RenderGraph {
  private static instance: RenderGraph | null = null;
  private width = 1920;
  private height = 1080;
  private sampleCount = 4; // 4x MSAA
  private targets = new Map<string, RenderTargetPool>();

  public static getInstance(): RenderGraph {
    if (!RenderGraph.instance) {
      RenderGraph.instance = new RenderGraph();
      RenderGraph.instance.initializePool();
    }
    return RenderGraph.instance;
  }

  private constructor() {}

  public initializePool() {
    this.allocateTarget('gbuf-color', this.width, this.height, 'rgba8unorm');
    this.allocateTarget('gbuf-normals', this.width, this.height, 'rgba16float');
    this.allocateTarget('gbuf-hdr', this.width, this.height, 'rgba16float');
    this.allocateTarget('gbuf-depth', this.width, this.height, 'depth32float');
  }

  public allocateTarget(id: string, w: number, h: number, format: RenderTargetPool['format']): RenderTargetPool {
    const bytesPerPixel = format === 'rgba16float' ? 8 : (format === 'depth32float' ? 4 : 4);
    const size = w * h * bytesPerPixel;
    const pool: RenderTargetPool = {
      id,
      width: w,
      height: h,
      format,
      allocatedBytes: size,
      refCount: 1,
    };
    this.targets.set(id, pool);
    return pool;
  }

  public resize(newWidth: number, newHeight: number) {
    this.width = newWidth;
    this.height = newHeight;
    this.targets.clear();
    this.initializePool();
  }

  public getTargets(): RenderTargetPool[] {
    return Array.from(this.targets.values());
  }

  public getDimensions() {
    return {
      width: this.width,
      height: this.height,
      sampleCount: this.sampleCount,
      totalTargetsAllocated: this.targets.size
    };
  }
}
