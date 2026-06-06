import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class ParallelNode extends MotionNode {
  constructor() {
    super('ParallelNode');
    this.type = 'ParallelNode';
  }

  execute(context: MotionContext) {
    // Stub: Triggers all branches simultaneously
  }
}
