export interface ProfilePassData {
  passId: string;
  passName: string;
  cpuTimeMs: number;
  gpuTimeMs: number;
  memoryBandwidthGbps: number;
  efficiencyIndex: number; // 0 to 100
}

export class RenderProfiler {
  private static instance: RenderProfiler | null = null;
  private metrics = new Map<string, ProfilePassData>();

  public static getInstance(): RenderProfiler {
    if (!RenderProfiler.instance) {
      RenderProfiler.instance = new RenderProfiler();
      RenderProfiler.instance.populateDefaultMetrics();
    }
    return RenderProfiler.instance;
  }

  private constructor() {}

  private populateDefaultMetrics() {
    this.recordMetric('depth-prepass', 'Geometric Depth Prepass', 0.15, 0.12, 115.4, 98);
    this.recordMetric('g-buffer', 'Metallic G-Buffer Pass', 0.45, 0.35, 234.1, 95);
    this.recordMetric('deferred-lighting', 'Physically-Based Lighting Resolver', 0.65, 0.45, 345.8, 92);
    this.recordMetric('bloom-extract', 'HDR Luma Downsampler', 0.22, 0.18, 95.2, 96);
    this.recordMetric('bloom-blur', 'Dual-Kawase Gaussian Blur', 0.28, 0.22, 110.3, 94);
    this.recordMetric('composite-filter', 'UI Color Compositor & CRT Filter', 0.35, 0.29, 142.1, 97);
  }

  public recordMetric(
    passId: string,
    passName: string,
    cpuTimeMs: number,
    gpuTimeMs: number,
    bandwidth: number,
    efficiency: number
  ) {
    this.metrics.set(passId, {
      passId,
      passName,
      cpuTimeMs,
      gpuTimeMs,
      memoryBandwidthGbps: bandwidth,
      efficiencyIndex: efficiency
    });
  }

  public getMetrics(): ProfilePassData[] {
    return Array.from(this.metrics.values());
  }

  public getSummary() {
    const arr = Array.from(this.metrics.values());
    const totalCpu = arr.reduce((sum, item) => sum + item.cpuTimeMs, 0);
    const totalGpu = arr.reduce((sum, item) => sum + item.gpuTimeMs, 0);
    const avgEfficiency = arr.length > 0 ? arr.reduce((sum, item) => sum + item.efficiencyIndex, 0) / arr.length : 100;
    
    return {
      totalCpuTimeMs: parseFloat(totalCpu.toFixed(3)),
      totalGpuTimeMs: parseFloat(totalGpu.toFixed(3)),
      averageEfficiency: parseFloat(avgEfficiency.toFixed(1)),
      bottleneckPassId: arr.length > 0 ? arr.sort((a, b) => b.gpuTimeMs - a.gpuTimeMs)[0].passId : 'none'
    };
  }
}
