export interface JobMetadata {
  jobId: string;
  projectId: string;
  frameIndex: number;
}

export type WorkerState = 'idle' | 'busy' | 'offline';

export class RenderWorker {
  public id: string;
  public label: string;
  public state: WorkerState = 'idle';
  public currentJob: JobMetadata | null = null;
  public completedTaskCount = 0;
  public averageTaskTimeMs = 8.5;
  public coreFactor = 1.0;

  constructor(id: string, label: string, coreFactor = 1.0) {
    this.id = id;
    this.label = label;
    this.coreFactor = coreFactor;
    this.averageTaskTimeMs = parseFloat((8.5 / coreFactor).toFixed(2));
  }

  public assignJob(jobId: string, projectId: string, frameIndex: number) {
    this.state = 'busy';
    this.currentJob = { jobId, projectId, frameIndex };
  }

  public completeJob(): JobMetadata | null {
    const job = this.currentJob;
    if (job) {
      this.completedTaskCount++;
      this.state = 'idle';
      this.currentJob = null;
    }
    return job;
  }

  public setOffline() {
    this.state = 'offline';
    this.currentJob = null;
  }

  public setOnline() {
    this.state = 'idle';
  }
}
