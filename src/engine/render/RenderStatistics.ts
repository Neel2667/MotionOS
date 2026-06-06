export interface DrawCallTelemetry {
  frameCount: number;
  drawCallsPerFrame: number;
  trianglesProcessed: number;
  verticesProcessed: number;
  instancedObjectsCount: number;
  vramUsageMb: number;
}

export class RenderStatistics {
  private static instance: RenderStatistics | null = null;
  private currentStats: DrawCallTelemetry = {
    frameCount: 0,
    drawCallsPerFrame: 48,
    trianglesProcessed: 125400,
    verticesProcessed: 376200,
    instancedObjectsCount: 24,
    vramUsageMb: 112.4
  };

  public static getInstance(): RenderStatistics {
    if (!RenderStatistics.instance) {
      RenderStatistics.instance = new RenderStatistics();
    }
    return RenderStatistics.instance;
  }

  private constructor() {}

  public getStats(): DrawCallTelemetry {
    return this.currentStats;
  }

  public trackFrame(drawCalls: number, triCount: number, instCount: number, vramMb: number) {
    this.currentStats.frameCount++;
    this.currentStats.drawCallsPerFrame = drawCalls;
    this.currentStats.trianglesProcessed = triCount;
    this.currentStats.verticesProcessed = triCount * 3;
    this.currentStats.instancedObjectsCount = instCount;
    this.currentStats.vramUsageMb = parseFloat(vramMb.toFixed(2));
  }

  public resetTelemetry() {
    this.currentStats.frameCount = 0;
  }
}
