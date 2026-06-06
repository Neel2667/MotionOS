import { v4 as uuidv4 } from 'uuid';
import { KeyframeSet, KeyframeInterpolator } from '../keyframe/KeyframeSystem';

export abstract class Curve {
  public id: string = uuidv4();
  abstract evaluate(t: number, outBuffer: Float32Array): void;
  abstract estimateCost(): number;
  serialize(): any { return { id: this.id, type: this.constructor.name }; }
  deserialize(data: any): void { this.id = data.id; }
}

export class LinearCurve extends Curve {
  public keyframes: KeyframeSet = new KeyframeSet();
  
  evaluate(t: number, outBuffer: Float32Array) {
    KeyframeInterpolator.interpolate(this.keyframes, t, outBuffer);
  }
  
  estimateCost() { return this.keyframes.keyframes.length; } // Approximate complexity
}

export class BezierCurve extends Curve {
  // Simple cubic bezier structure
  public p0: Float32Array;
  public p1: Float32Array;
  public p2: Float32Array;
  public p3: Float32Array;
  
  constructor(dim: number = 1) {
    super();
    this.p0 = new Float32Array(dim);
    this.p1 = new Float32Array(dim);
    this.p2 = new Float32Array(dim);
    this.p3 = new Float32Array(dim);
  }

  evaluate(t: number, outBuffer: Float32Array) {
     const invT = 1 - t;
     const c0 = invT * invT * invT;
     const c1 = 3 * invT * invT * t;
     const c2 = 3 * invT * t * t;
     const c3 = t * t * t;
     
     for (let i = 0; i < outBuffer.length; i++) {
        outBuffer[i] = c0 * this.p0[i] + c1 * this.p1[i] + c2 * this.p2[i] + c3 * this.p3[i];
     }
  }
  
  estimateCost() { return 16; } // Math ops
}

export class SplineCurve extends Curve {
  public points: Float32Array[] = [];
  evaluate(t: number, outBuffer: Float32Array) {}
  estimateCost() { return 32; }
}

export class HermiteCurve extends Curve {
  evaluate(t: number, outBuffer: Float32Array) {}
  estimateCost() { return 32; }
}

export class CatmullRomCurve extends Curve {
  evaluate(t: number, outBuffer: Float32Array) {}
  estimateCost() { return 64; }
}

export class StepCurve extends Curve {
  evaluate(t: number, outBuffer: Float32Array) {}
  estimateCost() { return 8; }
}

export class CustomCurve extends Curve {
  evaluate(t: number, outBuffer: Float32Array) {}
  estimateCost() { return 128; }
}

export class CurveCache {
  private cache: Map<string, Float32Array> = new Map();
  get(hash: string): Float32Array | undefined { return this.cache.get(hash); }
  set(hash: string, val: Float32Array) { this.cache.set(hash, val); }
}
