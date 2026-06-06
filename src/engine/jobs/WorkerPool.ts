import { RenderWorker } from './RenderWorker';

export class WorkerPool {
  private static instance: WorkerPool | null = null;
  private workers: RenderWorker[] = [];

  public static getInstance(): WorkerPool {
    if (!WorkerPool.instance) {
      WorkerPool.instance = new WorkerPool();
      WorkerPool.instance.spawnInitialWorkers();
    }
    return WorkerPool.instance;
  }

  private constructor() {}

  private spawnInitialWorkers() {
    this.workers.push(new RenderWorker('w-0', 'GPU Thread Direct-0', 2.5));
    this.workers.push(new RenderWorker('w-1', 'GPU Thread Direct-1', 2.5));
    this.workers.push(new RenderWorker('w-2', 'CPU Cluster Core-A', 1.2));
    this.workers.push(new RenderWorker('w-3', 'CPU Cluster Core-B', 1.2));
    this.workers.push(new RenderWorker('w-4', 'CPU Cluster Core-C', 1.0));
    this.workers.push(new RenderWorker('w-5', 'CPU Cluster Core-D', 1.0));
    this.workers.push(new RenderWorker('w-6', 'Network Distributed Node-00', 1.8));
    this.workers.push(new RenderWorker('w-7', 'Network Distributed Node-01', 1.8));
  }

  public getWorkers(): RenderWorker[] {
    return this.workers;
  }

  public getIdleWorker(): RenderWorker | undefined {
    return this.workers.find(w => w.state === 'idle');
  }

  public getBusyWorkersCount(): number {
    return this.workers.filter(w => w.state === 'busy').length;
  }

  public scaleUp(labelPrefix: string) {
    const id = `w-${this.workers.length}`;
    this.workers.push(new RenderWorker(id, `${labelPrefix} Core-${id}`, 1.5));
  }

  public scaleDown() {
    if (this.workers.length > 4) {
      const popped = this.workers.pop();
      if (popped && popped.state === 'busy') {
        // re-route active task if needed (simulated)
      }
    }
  }

  public getDiagnostics() {
    const total = this.workers.length;
    const busy = this.getBusyWorkersCount();
    const offline = this.workers.filter(w => w.state === 'offline').length;
    const idle = total - busy - offline;

    return {
      totalThreads: total,
      busyThreads: busy,
      idleThreads: idle,
      offlineThreads: offline,
      aggregateUtilization: (busy / Math.max(total, 1)) * 100
    };
  }
}
