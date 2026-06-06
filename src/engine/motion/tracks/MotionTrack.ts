import { MotionClip } from './MotionClip';

export enum TrackType {
  Position = 'Position',
  Rotation = 'Rotation',
  Scale = 'Scale',
  Opacity = 'Opacity',
  Custom = 'Custom'
}

export class MotionTrack {
  public targetId: string = '';
  public property: string = '';
  public type: TrackType = TrackType.Custom;
  public clips: MotionClip[] = [];

  evaluate(time: number): any {
    for (const clip of this.clips) {
      if (time >= clip.startTime && time <= clip.endTime) {
        return clip.evaluate(time);
      }
    }
    return null;
  }
}
