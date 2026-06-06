import { v4 as uuidv4 } from 'uuid';

export enum InterpolationMode {
  LINEAR = 'LINEAR',
  EASE_IN = 'EASE_IN',
  EASE_OUT = 'EASE_OUT',
  EASE_IN_OUT = 'EASE_IN_OUT',
  BOUNCE = 'BOUNCE',
  ELASTIC = 'ELASTIC',
  BACK = 'BACK',
  EXPO = 'EXPO',
  CIRC = 'CIRC',
  STEP = 'STEP',
  CUSTOM = 'CUSTOM'
}

export class InterpolationEngine {
  public static evaluate(mode: InterpolationMode, t: number): number {
    switch (mode) {
      case InterpolationMode.LINEAR: return t;
      case InterpolationMode.EASE_IN: return t * t;
      case InterpolationMode.EASE_OUT: return t * (2 - t);
      case InterpolationMode.EASE_IN_OUT: 
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case InterpolationMode.BOUNCE:
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      case InterpolationMode.ELASTIC:
        if (t === 0) return 0;
        if (t === 1) return 1;
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
      case InterpolationMode.BACK:
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
      case InterpolationMode.EXPO:
        return t === 0 ? 0 : Math.pow(1024, t - 1);
      case InterpolationMode.CIRC:
        return 1 - Math.sqrt(1 - t * t);
      case InterpolationMode.STEP:
        return t < 1 ? 0 : 1;
      default:
        return t;
    }
  }
}
