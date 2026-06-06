import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class CustomNode extends MotionNode {
  constructor() {
    super('CustomNode');
    this.type = 'CustomNode';
    this.parameters = { script: '/* custom logic */' };
  }

  execute(context: MotionContext) {
    // Stub for user-defined node logic
  }
}
