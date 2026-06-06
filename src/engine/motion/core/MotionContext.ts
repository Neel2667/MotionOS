import { Scene } from '../../scene/Scene';
import { Blackboard } from '../../blackboard/Blackboard';

export class MotionContext {
  public time: number = 0;
  public delta: number = 0;
  public scene: Scene;
  public state: Record<string, any> = {};
  public blackboard: Blackboard;

  constructor(scene: Scene, blackboard: Blackboard) {
    this.scene = scene;
    this.blackboard = blackboard;
  }
}
