export interface RenderJob {
  id: string;
  name: string;
  projectId: string;
  priority: 'high' | 'normal' | 'low';
  totalFrames: number;
  processedFrames: number;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  timestamp: number;
  error?: string;
}

export class QueueManager {
  private static instance: QueueManager | null = null;
  private jobs = new Map<string, RenderJob>();

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
      QueueManager.instance.initializePredefinedJobs();
    }
    return QueueManager.instance;
  }

  private constructor() {}

  private initializePredefinedJobs() {
    this.addJob({
      id: 'job-h0',
      name: 'Oyster Crown Premium Animation - Ultra 4K Preview',
      projectId: 'demo-pro',
      priority: 'high',
      totalFrames: 120,
      processedFrames: 120,
      status: 'completed',
      timestamp: Date.now() - 360000
    });

    this.addJob({
      id: 'job-n0',
      name: 'Dynamic Tech-Grid Loop export',
      projectId: 'brand-91',
      priority: 'normal',
      totalFrames: 240,
      processedFrames: 180,
      status: 'rendering',
      timestamp: Date.now() - 120000
    });

    this.addJob({
      id: 'job-l0',
      name: 'Offline Archival Composition Backsplatters',
      projectId: 'archive-test',
      priority: 'low',
      totalFrames: 500,
      processedFrames: 0,
      status: 'queued',
      timestamp: Date.now() - 50000
    });
  }

  public addJob(job: RenderJob) {
    this.jobs.set(job.id, job);
  }

  public getJob(id: string): RenderJob | undefined {
    return this.jobs.get(id);
  }

  public getJobs(): RenderJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => {
      // Sort priority first: high > normal > low
      const weights = { high: 3, normal: 2, low: 1 };
      const weightA = weights[a.priority];
      const weightB = weights[b.priority];
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return b.timestamp - a.timestamp;
    });
  }

  public getNextExecutableJob(): RenderJob | undefined {
    const list = this.getJobs();
    return list.find(j => j.status === 'queued' || j.status === 'rendering');
  }

  public updateJobProgress(id: string, deltaFrames: number) {
    const job = this.jobs.get(id);
    if (job) {
      job.processedFrames += deltaFrames;
      if (job.processedFrames >= job.totalFrames) {
        job.processedFrames = job.totalFrames;
        job.status = 'completed';
      } else {
        job.status = 'rendering';
      }
    }
  }

  public failJob(id: string, reason: string) {
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'failed';
      job.error = reason;
    }
  }

  public clearQueue() {
    this.jobs.clear();
  }
}
