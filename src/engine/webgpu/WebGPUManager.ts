import { ShaderLibrary } from './ShaderLibrary';
import { GPUBufferManager } from './GPUBufferManager';
import { ComputeDispatcher } from './ComputeDispatcher';

export interface GPUAdapterTelem {
  deviceLabel: string;
  vendor: string;
  architecture: string;
  backend: 'direct3d' | 'vulkan' | 'metal' | 'webgpu-mock';
  features: string[];
  maxComputeWorkgroupsPerDimension: number;
}

export class WebGPUManager {
  private static instance: WebGPUManager | null = null;
  private isInitialized = false;
  private adapterTelem: GPUAdapterTelem | null = null;
  private canvasBound: HTMLCanvasElement | null = null;

  public static getInstance(): WebGPUManager {
    if (!WebGPUManager.instance) {
      WebGPUManager.instance = new WebGPUManager();
      WebGPUManager.instance.initializeMockDevice();
    }
    return WebGPUManager.instance;
  }

  private constructor() {}

  public initializeMockDevice() {
    this.adapterTelem = {
      deviceLabel: 'AMD Radeon PRO W7900 / NVIDIA RTX 4090 Core',
      vendor: 'Advanced Micro/NVIDIA',
      architecture: 'RDNA 3 / Ada Lovelace',
      backend: 'vulkan',
      features: [
        'texture-compression-bc',
        'depth-clip-control',
        'indirect-first-draw',
        'timestamp-query',
        'float32-filterable',
        'dual-source-blending'
      ],
      maxComputeWorkgroupsPerDimension: 65535
    };
    this.isInitialized = true;
  }

  public bindCanvas(canvas: HTMLCanvasElement) {
    this.canvasBound = canvas;
  }

  public getStatus() {
    const bufMgr = GPUBufferManager.getInstance();
    const dispatcher = ComputeDispatcher.getInstance();
    const shaders = ShaderLibrary.getInstance();
    const memStats = bufMgr.getMemoryStats();

    return {
      initialized: this.isInitialized,
      adapter: this.adapterTelem,
      allocatedBuffersCount: bufMgr.getBuffers().length,
      memoryUsedMb: parseFloat((memStats.usedBytes / (1024 * 1024)).toFixed(2)),
      memoryLimitMb: parseFloat((memStats.limitBytes / (1024 * 1024)).toFixed(2)),
      memoryPercentage: parseFloat(memStats.utilizationPercentage.toFixed(2)),
      pipelineCacheCount: dispatcher.getPipelines().length,
      pipelineCacheEfficiency: dispatcher.getEfficiency(),
      shadersRegistered: shaders.getShaders().length,
      activeCanvasId: this.canvasBound ? this.canvasBound.id || 'WebGPU-Viewport' : 'None'
    };
  }

  public getMemoryReport() {
    return GPUBufferManager.getInstance().getMemoryStats();
  }
}
