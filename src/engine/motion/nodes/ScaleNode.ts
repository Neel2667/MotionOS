import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class ScaleNode extends MotionNode {
  constructor() {
    super('ScaleNode');
    this.type = 'ScaleNode';
    this.parameters = { targetName: '', sx: 1, sy: 1, sz: 1, oscillate: 0, speed: 1 };
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
    if (obj && obj.transform) {
      const sx = this.parameters.sx || 1;
      const sy = this.parameters.sy || 1;
      const sz = this.parameters.sz || 1;
      const oscillate = this.parameters.oscillate || 0;
      const speed = this.parameters.speed || 1;
      
      const time = context.blackboard.getValue('Time') ?? context.time;
      const factor = 1 + Math.sin(time * speed) * oscillate;
      obj.transform.scale.set(sx * factor, sy * factor, sz * factor);
    }
  }
}
