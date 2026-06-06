export class CacheStats {
  public hits: number = 0;
  public misses: number = 0;
}

export class GenericCache<T> {
  private store: Map<string, T> = new Map();
  public stats: CacheStats = new CacheStats();

  get(key: string): T | undefined {
    const val = this.store.get(key);
    if (val) this.stats.hits++;
    else this.stats.misses++;
    return val;
  }

  set(key: string, value: T) {
    this.store.set(key, value);
  }

  invalidate(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export class CompilationCache extends GenericCache<any> {}
export class ExecutionCache extends GenericCache<any> {}
export class InstructionCache extends GenericCache<any> {}
export class SceneCache extends GenericCache<any> {}
export class ObjectCache extends GenericCache<any> {}
export class AssetCache extends GenericCache<any> {}
export class RegistryCache extends GenericCache<any> {}
export class FutureRenderCache extends GenericCache<any> {}
export class TimelineCache extends GenericCache<any> {}
export class CurveCache extends GenericCache<any> {}
export class KeyframeCache extends GenericCache<any> {}
export class InterpolationCache extends GenericCache<any> {}
export class TrackCache extends GenericCache<any> {}

export class CacheSystem {
  public compilationCache = new CompilationCache();
  public executionCache = new ExecutionCache();
  public instructionCache = new InstructionCache();
  public sceneCache = new SceneCache();
  public objectCache = new ObjectCache();
  public assetCache = new AssetCache();
  public registryCache = new RegistryCache();
  public futureRenderCache = new FutureRenderCache();
  public timelineCache = new TimelineCache();
  public curveCache = new CurveCache();
  public keyframeCache = new KeyframeCache();
  public interpolationCache = new InterpolationCache();
  public trackCache = new TrackCache();
}
