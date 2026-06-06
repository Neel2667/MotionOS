import { Job, JobStatus, createRenderJob } from './Job';
import { RenderSettings } from '../export/RenderSettings';

export class JobQueue {
  private queue: Job[] = [];

  public enqueue(projectName: string, settings: RenderSettings, priority: Job['priority'] = 'NORMAL'): Job {
    const job = createRenderJob(projectName, settings, priority);
    this.queue.push(job);
    this.sortQueue();
    return job;
  }

  public getJobs(): Job[] {
    return [...this.queue];
  }

  public getJob(id: string): Job | undefined {
    return this.queue.find(j => j.id === id);
  }

  public remove(id: string): boolean {
    const initialLen = this.queue.length;
    this.queue = this.queue.filter(j => j.id !== id);
    return this.queue.length < initialLen;
  }

  public clear() {
    this.queue = [];
  }

  public getActiveJob(): Job | null {
    return this.queue.find(j => j.status === JobStatus.WORKING) || null;
  }

  public getStandbyJobs(): Job[] {
    return this.queue.filter(j => j.status === JobStatus.STANDBY);
  }

  public cancel(id: string) {
    const job = this.getJob(id);
    if (job) {
      job.status = JobStatus.CANCELED;
      job.completedAt = Date.now();
    }
  }

  public pause(id: string) {
    const job = this.getJob(id);
    if (job && job.status === JobStatus.WORKING) {
      job.status = JobStatus.PAUSED;
    }
  }

  public resume(id: string) {
    const job = this.getJob(id);
    if (job && job.status === JobStatus.PAUSED) {
      job.status = JobStatus.WORKING;
    }
  }

  private sortQueue() {
    // Critical starts first, then high, then normal, then low. Tiebreaker is creation timestamp.
    const priorityWeight: Record<Job['priority'], number> = {
      'CRITICAL': 4,
      'HIGH': 3,
      'NORMAL': 2,
      'LOW': 1
    };

    this.queue.sort((a, b) => {
      // Sort completed/failed to the bottom
      const aFinished = a.status === JobStatus.COMPLETED || a.status === JobStatus.FAILED || a.status === JobStatus.CANCELED;
      const bFinished = b.status === JobStatus.COMPLETED || b.status === JobStatus.FAILED || b.status === JobStatus.CANCELED;
      
      if (aFinished && !bFinished) return 1;
      if (!aFinished && bFinished) return -1;
      
      // If none or both finished, sort by priority
      if (!aFinished && !bFinished) {
        const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (pDiff !== 0) return pDiff;
      }

      return b.createdAt - a.createdAt; // newest first
    });
  }
}
