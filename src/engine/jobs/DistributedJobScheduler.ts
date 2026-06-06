import { QueueManager, RenderJob } from './QueueManager';
import { WorkerPool } from './WorkerPool';

export class DistributedJobScheduler {
  private static instance: DistributedJobScheduler | null = null;
  private isProcessing = false;
  private intervalId: any = null;

  public static getInstance(): DistributedJobScheduler {
    if (!DistributedJobScheduler.instance) {
      DistributedJobScheduler.instance = new DistributedJobScheduler();
    }
    return DistributedJobScheduler.instance;
  }

  private constructor() {}

  public startScheduler() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    // Simulate multi-threaded processing cycles
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  public stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isProcessing = false;
  }

  public tick() {
    const queue = QueueManager.getInstance();
    const pool = WorkerPool.getInstance();

    const activeJob = queue.getNextExecutableJob();
    if (!activeJob) {
      // Clear busy workers if no active jobs left
      pool.getWorkers().forEach(w => {
        if (w.state === 'busy') w.completeJob();
      });
      return;
    }

    // Try to find idle workers and assign frame pieces
    const idleWorker = pool.getIdleWorker();
    if (idleWorker && activeJob.processedFrames < activeJob.totalFrames) {
      const nextFrameIdx = activeJob.processedFrames;
      idleWorker.assignJob(`job-${activeJob.id}-chunk`, activeJob.projectId, nextFrameIdx);
      
      // Complete simulated frame after short delay
      setTimeout(() => {
        const completed = idleWorker.completeJob();
        if (completed) {
          queue.updateJobProgress(activeJob.id, 1);
        }
      }, 700);
    }
  }

  public getEstimatedTimeSeconds(): number {
    const queue = QueueManager.getInstance();
    const pool = WorkerPool.getInstance();
    
    const activeJob = queue.getNextExecutableJob();
    if (!activeJob) return 0;

    const remainingFrames = activeJob.totalFrames - activeJob.processedFrames;
    const activeWorkersCount = Math.max(pool.getWorkers().filter(w => w.state !== 'offline').length, 1);
    
    // average of 0.8 seconds per frame processed divided across active threads
    return Math.ceil((remainingFrames * 0.8) / activeWorkersCount);
  }

  public getStatus() {
    const queue = QueueManager.getInstance();
    const pool = WorkerPool.getInstance();

    const jobs = queue.getJobs();
    const activeJob = queue.getNextExecutableJob();

    return {
      running: this.isProcessing,
      totalJobsInQueue: jobs.length,
      currentJobName: activeJob ? activeJob.name : 'None',
      currentJobProgress: activeJob ? parseFloat(((activeJob.processedFrames / activeJob.totalFrames) * 100).toFixed(1)) : 100,
      workerPoolUtilization: pool.getDiagnostics().aggregateUtilization,
      estimatedTimeRemainingSec: this.getEstimatedTimeSeconds()
    };
  }
}
