import { TrackCollection, TrackRegistry } from '../track/TrackSystem';
import { BindingRegistry } from '../binding/PropertyBinding';

export class TimelineState {
  public currentTime: number = 0;
  public duration: number = 0;
  public fps: number = 60;
  public playbackRate: number = 1.0;
  public isPlaying: boolean = false;
  public isLooping: boolean = false;
}

export class TimelineClock {
  public lastUpdate: number = 0;
  public delta: number = 0;
  
  update(timeNow: number) {
     this.delta = timeNow - this.lastUpdate;
     this.lastUpdate = timeNow;
  }
}

export class TimelineContext {
  public tracks: TrackCollection = new TrackCollection();
  public trackRegistry: TrackRegistry = new TrackRegistry();
  public bindingRegistry: BindingRegistry = new BindingRegistry();
  public curves: Map<string, any> = new Map();
}

export class TimelineController {
  private state: TimelineState;
  
  constructor(state: TimelineState) {
    this.state = state;
  }
  
  play() { this.state.isPlaying = true; }
  pause() { this.state.isPlaying = false; }
  stop() { 
    this.state.isPlaying = false; 
    this.state.currentTime = 0; 
  }
  seek(t: number) { 
    this.state.currentTime = Math.max(0, Math.min(this.state.duration, t)); 
  }
  loop(enable: boolean) { this.state.isLooping = enable; }
  setFPS(fps: number) { this.state.fps = fps; }
  setDuration(duration: number) { this.state.duration = duration; }
  setPlaybackRate(rate: number) { this.state.playbackRate = rate; }
  
  update(deltaMs: number) {
    if (!this.state.isPlaying) return;
    
    // delta is in MS, convert to seconds based on state.playbackRate
    const deltaSeconds = (deltaMs / 1000) * this.state.playbackRate;
    this.state.currentTime += deltaSeconds;
    
    if (this.state.currentTime > this.state.duration) {
      if (this.state.isLooping) {
        this.state.currentTime = this.state.currentTime % this.state.duration;
      } else {
        this.state.currentTime = this.state.duration;
        this.pause();
      }
    }
  }
}

export class TimelineSerializer {
  serialize(ctx: TimelineContext, state: TimelineState): any {
    return {
      duration: state.duration,
      fps: state.fps
      // serialize tracks, etc
    };
  }
}

export class TimelineCache {
  invalidate() {}
  rebuild() {}
  serialize() {}
}

export class Timeline {
  public state: TimelineState = new TimelineState();
  public clock: TimelineClock = new TimelineClock();
  public context: TimelineContext = new TimelineContext();
  public controller: TimelineController = new TimelineController(this.state);
  
  // Backward compatibility properties and methods
  get currentTime(): number { return this.state.currentTime; }
  set currentTime(time: number) { this.state.currentTime = time; }
  get playing(): boolean { return this.state.isPlaying; }
  get duration(): number { return this.state.duration; }
  set duration(d: number) { this.state.duration = d; }
  
  play() { this.controller.play(); }
  pause() { this.controller.pause(); }
  stop() { this.controller.stop(); }
  seek(time: number) { this.controller.seek(time); }
  
  update(deltaMs: number) {
     this.controller.update(deltaMs);
  }
  
  evaluate(timeNowMs: number, executionBuffer: Float32Array) {
    this.clock.update(timeNowMs);
    this.controller.update(this.clock.delta);
    const evalTime = this.state.currentTime;
    // ...
  }
}
