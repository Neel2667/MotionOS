import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class VisibilityNode extends MotionNode {
  constructor() {
    super('VisibilityNode');
    this.type = 'VisibilityNode';
    this.parameters = { targetName: '', visibleTimeStart: 0, visibleTimeEnd: Infinity };
  }

  execute(context: MotionContext) {
    const targetName = this.parameters.targetName;
    if (!targetName) return;
    
    const findObject = (node: any): any => {
      if (node.name === targetName) return node;
      for (const child of node.children) {
        const found = findObject(child);
        if (found) return found;
      }
      return null;
    };
    
    const obj = findObject(context.scene);
    if (obj) {
      const time = context.blackboard.getValue('Time') ?? context.time;
      obj.visibility = time >= this.parameters.visibleTimeStart && time <= this.parameters.visibleTimeEnd;
    }
  }
}
