import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class OpacityNode extends MotionNode {
  constructor() {
    super('OpacityNode');
    this.type = 'OpacityNode';
    this.parameters = { targetName: '', opacity: 1, pulse: 0, speed: 1 };
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
      const baseOpacity = this.parameters.opacity;
      const pulse = this.parameters.pulse || 0;
      const speed = this.parameters.speed || 1;
      
      const time = context.blackboard.getValue('Time') ?? context.time;
      obj.opacity = Math.max(0, Math.min(1, baseOpacity + Math.sin(time * speed) * pulse));
    }
  }
}
