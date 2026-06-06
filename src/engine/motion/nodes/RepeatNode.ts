import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class RepeatNode extends MotionNode {
  constructor() {
    super('RepeatNode');
    this.type = 'RepeatNode';
    this.parameters = { iterations: 1 };
  }

  execute(context: MotionContext) {
    // Stub
  }
}
