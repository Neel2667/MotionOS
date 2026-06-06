import { RenderStatistics } from './RenderStatistics';
import { FrameGraph } from './FrameGraph';

export class RenderScheduler {
  private static instance: RenderScheduler | null = null;
  private frameRateLimit = 60;
  private isThrottled = false;
  private animFrameId: number | null = null;
  private lastFrameTime = 0;
  private totalFrameRendered = 0;

  public static getInstance(): RenderScheduler {
    if (!RenderScheduler.instance) {
      RenderScheduler.instance = new RenderScheduler();
    }
    return RenderScheduler.instance;
  }

  private constructor() {}

  public getFrameRateLimit(): number {
    return this.frameRateLimit;
  }

  public setFrameRateLimit(limit: number) {
    this.frameRateLimit = limit;
  }

  public toggleThrottle(throttled: boolean) {
    this.isThrottled = throttled;
    this.frameRateLimit = throttled ? 30 : 60;
  }

  public renderTick(timestamp: number) {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
    }

    const elapsed = timestamp - this.lastFrameTime;
    const spacing = 1000 / this.frameRateLimit;

    if (elapsed >= spacing) {
      const graph = new FrameGraph();
      const nodeTime = graph.executeAll();
      
      const stats = RenderStatistics.getInstance();
      stats.trackFrame(
        48 + Math.floor(Math.random() * 10), // draw calls
        125000 + Math.floor(Math.random() * 1000), // triangles
        24, // instances
        112.4 + Math.random() * 2 // vram usage mb
      );

      this.totalFrameRendered++;
      this.lastFrameTime = timestamp - (elapsed % spacing);
    }
  }

  public getSchedulerDiagnostics() {
    return {
      frameRateLimit: this.frameRateLimit,
      isThrottled: this.isThrottled,
      totalFramesDrawn: this.totalFrameRendered,
      lastFrameSpacedMs: parseFloat((1000 / this.frameRateLimit).toFixed(2))
    };
  }
}
