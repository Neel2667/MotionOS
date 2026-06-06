export enum EasingType {
  Linear = 'Linear',
  EaseIn = 'EaseIn',
  EaseOut = 'EaseOut',
  EaseInOut = 'EaseInOut',
  Bezier = 'Bezier',
  Bounce = 'Bounce',
  Elastic = 'Elastic',
  Custom = 'Custom'
}

export class MotionCurve {
  public type: EasingType = EasingType.Linear;

  evaluate(t: number): number {
    t = Math.max(0, Math.min(1, t));
    switch(this.type) {
      case EasingType.EaseIn: return t * t;
      case EasingType.EaseOut: return t * (2 - t);
      case EasingType.EaseInOut: return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: return t;
    }
  }
}
