import { v4 as uuidv4 } from 'uuid';

export enum PropertyType {
  POSITION = 'POSITION',
  ROTATION = 'ROTATION',
  SCALE = 'SCALE',
  OPACITY = 'OPACITY',
  COLOR = 'COLOR',
  FLOAT = 'FLOAT',
  VECTOR = 'VECTOR',
  QUATERNION = 'QUATERNION',
  CUSTOM = 'CUSTOM'
}

export class PropertyBinding {
  public id: string = uuidv4();
  public targetUUID: string;
  public propertyType: PropertyType;
  public customPropertyPath: string = '';
  // The index within the Exec Context or Object Transform register layout this maps to
  public registerOffset: number = -1; 
  public dimensions: number = 1;
  
  constructor(targetUUID: string, type: PropertyType) {
    this.targetUUID = targetUUID;
    this.propertyType = type;
  }
}

export class BindingResolver {
  // Precomputes the offset locations so the VM can directly dump curve outputs into floats without lookups
  static resolve(binding: PropertyBinding, registryMap: any): boolean {
    // lookup entity UUID offset inside memory arenas
    return true;
  }
}

export class BindingRegistry {
  private bindings: Map<string, PropertyBinding> = new Map();
  register(binding: PropertyBinding) { this.bindings.set(binding.id, binding); }
  get(id: string) { return this.bindings.get(id); }
}

export class AnimationChannel {
  public id: string = uuidv4();
  public curveId: string;
  public bindingId: string;
  
  constructor(curveId: string, bindingId: string) {
    this.curveId = curveId;
    this.bindingId = bindingId;
  }
}
