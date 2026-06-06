import { v4 as uuidv4 } from 'uuid';
import { InterpolationMode, InterpolationEngine } from '../interpolation/InterpolationEngine';

export class Keyframe {
  public id: string;
  public time: number;
  public value: Float32Array; // values are strictly Float32 buffers for deterministic vectorization
  public interpolation: InterpolationMode;
  public metadata: any;

  constructor(time: number, value: Float32Array, interpolation: InterpolationMode = InterpolationMode.LINEAR) {
    this.id = uuidv4();
    this.time = time;
    this.value = value;
    this.interpolation = interpolation;
    this.metadata = {};
  }
}

export class KeyframeSet {
  public keyframes: Keyframe[] = [];
  
  add(kf: Keyframe) {
    this.keyframes.push(kf);
    this.sort();
  }

  sort() {
    this.keyframes.sort((a, b) => a.time - b.time);
  }

  getKeyframesAt(time: number): { left: Keyframe | null, right: Keyframe | null, t: number } {
    if (this.keyframes.length === 0) return { left: null, right: null, t: 0 };
    if (this.keyframes.length === 1) return { left: this.keyframes[0], right: this.keyframes[0], t: 0 };
    
    if (time <= this.keyframes[0].time) return { left: this.keyframes[0], right: this.keyframes[0], t: 0 };
    if (time >= this.keyframes[this.keyframes.length - 1].time) {
      const last = this.keyframes[this.keyframes.length - 1];
      return { left: last, right: last, t: 1 };
    }

    for (let i = 0; i < this.keyframes.length - 1; i++) {
       if (time >= this.keyframes[i].time && time <= this.keyframes[i+1].time) {
         const range = this.keyframes[i+1].time - this.keyframes[i].time;
         const localT = (time - this.keyframes[i].time) / range;
         return { left: this.keyframes[i], right: this.keyframes[i+1], t: localT };
       }
    }
    
    return { left: null, right: null, t: 0 };
  }
}

export class KeyframeInterpolator {
  public static interpolate(set: KeyframeSet, time: number, outBuffer: Float32Array): void {
    const { left, right, t } = set.getKeyframesAt(time);
    
    if (!left || !right) return;
    if (left === right) {
      outBuffer.set(left.value);
      return;
    }

    const easedT = InterpolationEngine.evaluate(left.interpolation, t);
    
    for (let i = 0; i < outBuffer.length; i++) {
       outBuffer[i] = left.value[i] + easedT * (right.value[i] - left.value[i]);
    }
  }
}

export class KeyframeCache {
  private cache: Map<string, Float32Array> = new Map();
  
  get(hash: string): Float32Array | undefined {
    return this.cache.get(hash);
  }
  
  set(hash: string, val: Float32Array) {
    this.cache.set(hash, val);
  }
}

export class KeyframeSerializer {
  static serialize(kf: Keyframe): any {
    return {
      id: kf.id,
      time: kf.time,
      value: Array.from(kf.value),
      interpolation: kf.interpolation,
      metadata: kf.metadata
    };
  }
  static deserialize(data: any): Keyframe {
    const kf = new Keyframe(data.time, new Float32Array(data.value), data.interpolation);
    kf.id = data.id;
    kf.metadata = data.metadata;
    return kf;
  }
}
