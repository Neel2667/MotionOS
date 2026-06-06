import { MotionCurve } from '../curves/MotionCurve';

export class MotionClip {
  public startTime: number = 0;
  public duration: number = 1;
  public startValue: any;
  public endValue: any;
  public curve: MotionCurve = new MotionCurve();

  get endTime() { return this.startTime + this.duration; }

  evaluate(time: number): any {
    const t = Math.max(0, Math.min(1, (time - this.startTime) / this.duration));
    const progress = this.curve.evaluate(t);
    
    if (typeof this.startValue === 'number' && typeof this.endValue === 'number') {
        return this.startValue + (this.endValue - this.startValue) * progress;
    }
    return this.startValue;
  }
}
