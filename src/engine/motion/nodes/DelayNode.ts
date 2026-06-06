import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class DelayNode extends MotionNode {
  constructor() {
    super('DelayNode');
    this.type = 'DelayNode';
    this.parameters = { delayTime: 1.0 };
  }

  execute(context: MotionContext) {
    // Stub: In a compiled graph, delays downstream execution signals
  }
}
