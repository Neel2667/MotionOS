import { FrameRenderer } from '../export/FrameRenderer';
import { Job, JobStatus } from './Job';
import { Encoder } from '../export/Encoder';

export class BackgroundRenderer {
  private frameRenderer = new FrameRenderer();
  private encoder = new Encoder();
  private activeTimerId: any = null;

  /**
   * Spasms rendering chunks in chunk cycles
   */
  public runJob(
    job: Job,
    onProgress: (job: Job) => void,
    onFinish: (job: Job) => void
  ) {
    if (this.activeTimerId) {
      clearTimeout(this.activeTimerId);
    }

    job.status = JobStatus.WORKING;
    job.startedAt = Date.now();

    const width = job.settings.resolutionPreset === 'Custom' ? job.settings.customWidth : 1280;
    const height = job.settings.resolutionPreset === 'Custom' ? job.settings.customHeight : 720;
    
    this.frameRenderer.prepareBuffers(width, height);
    this.encoder.initializeBuffer(width, height);

    // Speed parameter: Milliseconds step per frame based on render preset complexity
    let stepMs = 30;
    if (job.settings.preset === 'PRODUCTION') stepMs = 120;
    else if (job.settings.preset === 'ULTRA') stepMs = 80;
    else if (job.settings.preset === 'HIGH') stepMs = 50;
    else if (job.settings.preset === 'DRAFT') stepMs = 15;

    const renderTick = () => {
      // Check states
      if (job.status !== JobStatus.WORKING) {
        return; // Job was paused, canceled or deleted
      }

      const totalFrames = job.totalFrames;
      if (job.currentFrame < totalFrames) {
        // Execute a deterministic render tick
        this.frameRenderer.renderFrame(job.currentFrame, job.settings);
        
        job.currentFrame += 1;
        job.progressPercent = Math.min(100, Math.round((job.currentFrame / totalFrames) * 100));
        job.timeElapsedMs = Date.now() - (job.startedAt || Date.now());

        const elapsedSecs = job.timeElapsedMs / 1000;
        const framesPerSec = job.currentFrame / (elapsedSecs || 0.01);
        job.timeEstimatedMs = Math.round(((totalFrames - job.currentFrame) / (framesPerSec || 1)) * 1000);

        onProgress(job);
        
        // Loop back async to yield execution flow
        this.activeTimerId = setTimeout(renderTick, stepMs);
      } else {
        // Encode final package
        job.status = JobStatus.COMPLETED;
        job.completedAt = Date.now();
        job.timeEstimatedMs = 0;
        
        try {
          job.output = this.encoder.encode(job.totalFrames, job.settings, job.projectName);
        } catch (e) {
          job.status = JobStatus.FAILED;
          job.error = `Encoding Exception: ${(e as Error).message}`;
        }

        onFinish(job);
      }
    };

    this.activeTimerId = setTimeout(renderTick, stepMs);
  }

  public suspendCurrent() {
    if (this.activeTimerId) {
      clearTimeout(this.activeTimerId);
      this.activeTimerId = null;
    }
  }

  public dispose() {
    this.suspendCurrent();
    this.frameRenderer.dispose();
  }
}
