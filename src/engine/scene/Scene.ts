import { Object3D } from '../objects/Object3D';

export class Scene extends Object3D {
  constructor() {
    super('Scene');
  }

  createObject(name: string): Object3D {
    const obj = new Object3D(name);
    this.add(obj);
    return obj;
  }

  removeObject(obj: Object3D) {
    this.remove(obj);
  }

  // update inherited from Object3D

  serialize(): any {
    return {
      version: '1.0',
      type: 'Scene',
      data: super.serialize()
    };
  }

  deserialize(data: any) {
    if (data.type !== 'Scene') throw new Error("Invalid Scene data");
    
    // Quick recursion for simple Object3D deserialization
    const buildTree = (nodeData: any, parentNode: Object3D) => {
      parentNode.deserialize(nodeData);
      if (nodeData.children) {
        for (const childData of nodeData.children) {
          const childObj = new Object3D();
          buildTree(childData, childObj);
          parentNode.add(childObj);
        }
      }
    };
    
    // Clear current children
    this.children = [];
    buildTree(data.data, this);
  }
}
