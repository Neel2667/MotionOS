import { JobQueue } from './JobQueue';
import { BackgroundRenderer } from './BackgroundRenderer';
import { Job, JobStatus } from './Job';
import { RenderSettings } from '../export/RenderSettings';

export class JobManager {
  public queue = new JobQueue();
  private renderer = new BackgroundRenderer();
  private changeListeners: Array<(jobs: Job[]) => void> = [];

  constructor() {
    // Generate some starter finished and failed jobs in history for visual UI representation!
    const timestamp = Date.now();
    
    // Default Completed Job
    const completedJob = this.queue.enqueue('Mercedes Concept Reveal', {
      preset: 'HIGH' as any,
      resolutionPreset: '1080p' as any,
      customWidth: 1920,
      customHeight: 1080,
      exportType: 'MP4' as any,
      startFrame: 0,
      endFrame: 180,
      fps: 30,
      compressionQuality: 0.8,
      motionBlurStrength: 0.5,
      usePreallocatedBuffers: true,
      deterministicExecution: true
    }, 'NORMAL');
    completedJob.status = JobStatus.COMPLETED;
    completedJob.progressPercent = 100;
    completedJob.currentFrame = 180;
    completedJob.timeElapsedMs = 6400;
    completedJob.timeEstimatedMs = 0;
    completedJob.completedAt = timestamp - 3600000;
    
    // Add dummy output file
    completedJob.output = {
      exportType: 'MP4' as any,
      fileName: 'mercedes_reveal_render_1080p.mp4',
      blobUrl: '#',
      fileSizeEstimateBytes: 28400000,
      metadata: {
        resolution: '1920x1080',
        totalFrames: 180,
        encodedAt: completedJob.completedAt,
        hashSignature: 'mOS_X9E3G1'
      }
    };

    // Default Failed Job
    const failedJob = this.queue.enqueue('Nike Liquid Chrome Stream', {
      preset: 'ULTRA' as any,
      resolutionPreset: '4K' as any,
      customWidth: 3840,
      customHeight: 2160,
      exportType: 'WebM' as any,
      startFrame: 0,
      endFrame: 120,
      fps: 60,
      compressionQuality: 0.95,
      motionBlurStrength: 0.8,
      usePreallocatedBuffers: true,
      deterministicExecution: true
    }, 'HIGH');
    failedJob.status = JobStatus.FAILED;
    failedJob.progressPercent = 42;
    failedJob.currentFrame = 50;
    failedJob.timeElapsedMs = 12500;
    failedJob.timeEstimatedMs = 0;
    failedJob.error = 'GPU Context Lost: Out of Addressable VRAM allocations on slice partition.';
    failedJob.completedAt = timestamp - 1800000;
  }

  public registerListener(listener: (jobs: Job[]) => void) {
    this.changeListeners.push(listener);
    listener(this.queue.getJobs());
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const list = this.queue.getJobs();
    this.changeListeners.forEach(l => l(list));
  }

  public requestRender(projectName: string, settings: RenderSettings, priority: Job['priority'] = 'NORMAL'): Job {
    const job = this.queue.enqueue(projectName, settings, priority);
    this.notify();
    this.checkAndProcessNext();
    return job;
  }

  public cancelJob(id: string) {
    const active = this.queue.getActiveJob();
    if (active && active.id === id) {
      this.renderer.suspendCurrent();
    }
    this.queue.cancel(id);
    this.notify();
    this.checkAndProcessNext();
  }

  public pauseJob(id: string) {
    const active = this.queue.getActiveJob();
    if (active && active.id === id) {
      this.renderer.suspendCurrent();
    }
    this.queue.pause(id);
    this.notify();
  }

  public resumeJob(id: string) {
    this.queue.resume(id);
    this.notify();
    this.checkAndProcessNext();
  }

  public removeJob(id: string) {
    const active = this.queue.getActiveJob();
    if (active && active.id === id) {
      this.renderer.suspendCurrent();
    }
    this.queue.remove(id);
    this.notify();
    this.checkAndProcessNext();
  }

  public clearAll() {
    this.renderer.suspendCurrent();
    this.queue.clear();
    this.notify();
  }

  /**
   * Evaluates outstanding stack elements and starts next job
   */
  private checkAndProcessNext() {
    const active = this.queue.getActiveJob();
    if (active) return; // Wait until current working is paused/completed/canceled

    const standby = this.queue.getStandbyJobs();
    if (standby.length === 0) return;

    const nextJob = standby[0]; // Already sorted by priority
    
    this.renderer.runJob(
      nextJob,
      (updated) => {
        this.notify();
      },
      (finished) => {
        this.notify();
        this.checkAndProcessNext(); // Trigger next queue element immediately
      }
    );
    this.notify();
  }
}

export const globalJobManager = new JobManager();
