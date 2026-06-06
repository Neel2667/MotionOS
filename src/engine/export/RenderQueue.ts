import { RenderSettings } from './RenderSettings';
import { EncodedOutput, Encoder } from './Encoder';

export enum QueueJobStatus {
  QUEUED = 'QUEUED',
  RENDERING = 'RENDERING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED'
}

export interface RenderJob {
  id: string;
  projectName: string;
  settings: RenderSettings;
  status: QueueJobStatus;
  totalFrames: number;
  currentFrame: number;
  progressPercent: number;
  timeElapsedMs: number;
  timeEstimatedRemainingMs: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  outputFile?: EncodedOutput;
  errorMessage?: string;
  complexityFactor: number; // 0.5 to 3.0 based on settings, which influences render times
}

export class RenderQueue {
  private jobs: Map<string, RenderJob> = new Map();
  private activeJobId: string | null = null;
  private timerId: any = null;

  public addJob(projectName: string, settings: RenderSettings): RenderJob {
    const totalFrames = settings.endFrame - settings.startFrame;
    const id = `job_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // Compute a complexity modifier
    let complexity = 1.0;
    if (settings.preset === 'ULTRA' || settings.preset === 'PRODUCTION') complexity = 2.5;
    else if (settings.preset === 'HIGH') complexity = 1.5;
    else if (settings.preset === 'DRAFT') complexity = 0.5;

    const job: RenderJob = {
      id,
      projectName,
      settings: { ...settings },
      status: QueueJobStatus.QUEUED,
      totalFrames,
      currentFrame: 0,
      progressPercent: 0,
      timeElapsedMs: 0,
      timeEstimatedRemainingMs: totalFrames * complexity * 65, // baseline estimate: 65ms per frame * complexity
      createdAt: Date.now(),
      complexityFactor: complexity
    };

    this.jobs.set(id, job);
    return job;
  }

  public getJobs(): RenderJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  public getJob(id: string): RenderJob | undefined {
    return this.jobs.get(id);
  }

  public getActiveJob(): RenderJob | null {
    if (!this.activeJobId) return null;
    return this.jobs.get(this.activeJobId) || null;
  }

  public cancelJob(id: string) {
    const job = this.jobs.get(id);
    if (job) {
      job.status = QueueJobStatus.CANCELED;
      job.completedAt = Date.now();
      if (this.activeJobId === id) {
        this.activeJobId = null;
      }
    }
  }

  public pauseJob(id: string) {
    const job = this.jobs.get(id);
    if (job && job.status === QueueJobStatus.RENDERING) {
      job.status = QueueJobStatus.PAUSED;
    }
  }

  public resumeJob(id: string) {
    const job = this.jobs.get(id);
    if (job && job.status === QueueJobStatus.PAUSED) {
      job.status = QueueJobStatus.RENDERING;
      this.activeJobId = id;
    }
  }

  public removeJob(id: string) {
    this.jobs.delete(id);
    if (this.activeJobId === id) {
      this.activeJobId = null;
    }
  }

  public clearQueue() {
    this.jobs.clear();
    this.activeJobId = null;
  }

  /**
   * Sets a job as active and triggers simulated progress frames updates
   */
  public startRendering(id: string, onUpdate: (job: RenderJob) => void, onComplete: (job: RenderJob) => void) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = QueueJobStatus.RENDERING;
    job.startedAt = Date.now();
    this.activeJobId = id;

    const frameStepTime = job.complexityFactor * 40; // 40ms simulation step times complexity
    
    const tick = () => {
      const current = this.jobs.get(id);
      if (!current || current.status !== QueueJobStatus.RENDERING) {
        return; // Stopped, paused or canceled
      }

      if (current.currentFrame < current.totalFrames) {
        current.currentFrame += 1;
        current.progressPercent = Math.min(100, Math.round((current.currentFrame / current.totalFrames) * 100));
        current.timeElapsedMs += frameStepTime;
        
        // Dynamic remaining estimate
        const msPerFrame = current.timeElapsedMs / current.currentFrame;
        current.timeEstimatedRemainingMs = Math.round(msPerFrame * (current.totalFrames - current.currentFrame));

        onUpdate(current);
        setTimeout(tick, frameStepTime);
      } else {
        current.status = QueueJobStatus.COMPLETED;
        current.completedAt = Date.now();
        current.timeEstimatedRemainingMs = 0;
        
        // Create an encoder output
        const encoder = new Encoder();
        current.outputFile = encoder.encode(current.totalFrames, current.settings, current.projectName);

        this.activeJobId = null;
        onComplete(current);
      }
    };

    setTimeout(tick, frameStepTime);
  }
}
