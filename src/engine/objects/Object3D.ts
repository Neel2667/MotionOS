import { Node } from '../core/Node';
import { Transform } from '../core/Transform';

export class Object3D extends Node {
  public name: string = '';
  public transform: Transform;
  public opacity: number = 1.0;
  public visibility: boolean = true;
  public metadata: Record<string, any> = {};

  constructor(name: string = 'Object3D') {
    super();
    this.name = name;
    this.transform = new Transform();
  }

  update(delta: number) {
    // Update local and world transform
    const parentWorldMatrix = (this.parent && (this.parent as any).transform) 
        ? (this.parent as any).transform.worldMatrix 
        : undefined;
        
    this.transform.updateWorldMatrix(parentWorldMatrix);

    super.update(delta);
  }

  serialize(): any {
    return {
      id: this.id,
      name: this.name,
      transform: this.transform.serialize(),
      opacity: this.opacity,
      visibility: this.visibility,
      metadata: this.metadata,
      children: this.children.map(c => (c as Object3D).serialize ? (c as Object3D).serialize() : null).filter(Boolean)
    };
  }

  deserialize(data: any) {
    if (data.id) this.id = data.id;
    if (data.name) this.name = data.name;
    if (data.transform) this.transform.deserialize(data.transform);
    if (typeof data.opacity === 'number') this.opacity = data.opacity;
    if (typeof data.visibility === 'boolean') this.visibility = data.visibility;
    if (data.metadata) this.metadata = { ...data.metadata };
    
    // We do not desertialize children directly here without knowing their type.
    // The Scene will typically handle full tree deserialization.
  }
}
