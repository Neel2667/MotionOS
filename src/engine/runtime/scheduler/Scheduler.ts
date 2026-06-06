import { v4 as uuidv4 } from 'uuid';

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export class TaskHandle {
  constructor(public id: string = uuidv4()) {}
}

export type TaskClosure = () => void;

export class Task {
  public id: string = uuidv4();
  public handle: TaskHandle;
  public priority: TaskPriority = TaskPriority.NORMAL;
  public closure: TaskClosure;
  public estimatedCost: number = 1;
  public dependencies: Set<string> = new Set();
  
  constructor(closure: TaskClosure, priority: TaskPriority = TaskPriority.NORMAL) {
    this.handle = new TaskHandle(this.id);
    this.closure = closure;
    this.priority = priority;
  }
}

export class TaskGroup {
  public id: string = uuidv4();
  public tasks: Task[] = [];
  
  add(task: Task) {
    this.tasks.push(task);
  }
}

export class TaskQueue {
  private queue: Task[] = [];

  enqueue(task: Task) {
    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): Task | undefined {
    return this.queue.shift();
  }

  remove(id: string) {
    this.queue = this.queue.filter(t => t.id !== id);
  }

  get length() { return this.queue.length; }
}

export class DependencyGraph {
  public resolve(tasks: Task[]): Task[] {
    // Stub for topological sort of tasks
    return tasks;
  }
}

export class TaskExecutor {
  execute(task: Task) {
    task.closure();
  }
}

export class FrameScheduler {
  public queue: TaskQueue = new TaskQueue();
  public executor: TaskExecutor = new TaskExecutor();

  enqueue(task: Task): TaskHandle {
    this.queue.enqueue(task);
    return task.handle;
  }

  executeFrame(timeBudgetMs: number = 16.6) {
    const start = performance.now();
    while (this.queue.length > 0) {
      if (performance.now() - start >= timeBudgetMs) break;
      const task = this.queue.dequeue();
      if (task) this.executor.execute(task);
    }
  }
}

export class FutureParallelScheduler {
  // Stub for WebWorker/SharedArrayBuffer executor
}

export class Scheduler {
  public frameScheduler: FrameScheduler = new FrameScheduler();
  public paused: boolean = false;

  enqueue(closure: TaskClosure, priority?: TaskPriority): TaskHandle {
    return this.frameScheduler.enqueue(new Task(closure, priority));
  }

  cancel(handle: TaskHandle) {
    this.frameScheduler.queue.remove(handle.id);
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }

  execute(timeBudgetMs?: number) {
    if (!this.paused) {
      this.frameScheduler.executeFrame(timeBudgetMs);
    }
  }
}
