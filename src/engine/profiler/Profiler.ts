export class ProfilerStats {
  public samples: number[] = [];
  public current: number = 0;
  public average: number = 0;
  
  record(value: number) {
    this.current = value;
    this.samples.push(value);
    if (this.samples.length > 60) this.samples.shift(); // Keep last 60 frames
    this.average = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }
}

export class CompilationProfiler {
  public compileTime = new ProfilerStats();
  public nodesCompiled = new ProfilerStats();
}

export class RuntimeProfiler {
  public executionTime = new ProfilerStats();
}

export class SchedulerProfiler {
  public tasksExecuted = new ProfilerStats();
  public taskQueueLength = new ProfilerStats();
}

export class FrameProfiler {
  public frameCost = new ProfilerStats();
  public fps = new ProfilerStats();
}

export class MemoryProfiler {
  public usedMemory = new ProfilerStats();
  public allocations = new ProfilerStats();
}

export class CacheProfiler {
  public hits = new ProfilerStats();
  public misses = new ProfilerStats();
}

export class InstructionProfiler {
  public instructionCount = new ProfilerStats();
}

export class TimelineProfiler {
  public evaluationTime = new ProfilerStats();
}

export class TrackProfiler {
  public trackCount = new ProfilerStats();
}

export class CurveProfiler {
  public curveCost = new ProfilerStats();
}

export class InterpolationProfiler {
  public evaluations = new ProfilerStats();
}

export class ProfilerState {
  public compilation = new CompilationProfiler();
  public runtime = new RuntimeProfiler();
  public scheduler = new SchedulerProfiler();
  public frame = new FrameProfiler();
  public memory = new MemoryProfiler();
  public cache = new CacheProfiler();
  public instructions = new InstructionProfiler();
  public timeline = new TimelineProfiler();
  public track = new TrackProfiler();
  public curve = new CurveProfiler();
  public interpolation = new InterpolationProfiler();
}

export const globalProfiler = new ProfilerState();
