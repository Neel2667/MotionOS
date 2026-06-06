import { MotionNode } from '../core/MotionNode';
import { MotionContext } from '../core/MotionContext';

export class TranslateNode extends MotionNode {
  constructor() {
    super('TranslateNode');
    this.type = 'TranslateNode';
    this.parameters = { targetName: '', x: 0, y: 0, z: 0, speed: 1 };
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
      const speed = this.parameters.speed || 0;
      const delta = context.blackboard.getValue('DeltaTime') ?? context.delta;
      obj.transform.position.x += (this.parameters.x || 0) * delta * speed;
      obj.transform.position.y += (this.parameters.y || 0) * delta * speed;
      obj.transform.position.z += (this.parameters.z || 0) * delta * speed;
    }
  }
}
