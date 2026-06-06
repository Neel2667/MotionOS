import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class SequenceNode extends MotionNode {
  constructor() {
    super('SequenceNode');
    this.type = 'SequenceNode';
  }

  execute(context: MotionContext) {
    // Stub: Triggers branches sequentially
  }
}
