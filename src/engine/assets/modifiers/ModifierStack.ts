import { v4 as uuidv4 } from 'uuid';

export enum ModifierType {
  SCALE = 'SCALE',
  ROTATION = 'ROTATION',
  VELOCITY = 'VELOCITY',
  ACCELERATION = 'ACCELERATION',
  GRAVITY = 'GRAVITY',
  DRAG = 'DRAG',
  NOISE = 'NOISE',
  CURL = 'CURL',
  COLOR = 'COLOR',
  OPACITY = 'OPACITY',
  LIFETIME = 'LIFETIME'
}

export abstract class ModifierNode {
  public id: string = uuidv4();
  public type: ModifierType;
  public active: boolean = true;
  constructor(type: ModifierType) { this.type = type; }
  abstract apply(buffer: Float32Array, stride: number, count: number, dt: number): void;
}

export class ModifierStack {
  public id: string = uuidv4();
  public modifiers: ModifierNode[] = [];
  
  add(mod: ModifierNode) {
    this.modifiers.push(mod);
  }
  
  remove(id: string) {
    this.modifiers = this.modifiers.filter(m => m.id !== id);
  }
  
  applyAll(buffer: Float32Array, stride: number, count: number, dt: number) {
    for (const mod of this.modifiers) {
      if (mod.active) {
        mod.apply(buffer, stride, count, dt);
      }
    }
  }
}

// Example modifiers
export class ScaleModifier extends ModifierNode {
  public targetScale: number = 1.0;
  constructor() { super(ModifierType.SCALE); }
  apply(buffer: Float32Array, stride: number, count: number, dt: number) {}
}

export class GravityModifier extends ModifierNode {
  public force: number = -9.81;
  constructor() { super(ModifierType.GRAVITY); }
  apply(buffer: Float32Array, stride: number, count: number, dt: number) {}
}

export class NoiseModifier extends ModifierNode {
  public frequency: number = 1.0;
  public amplitude: number = 1.0;
  constructor() { super(ModifierType.NOISE); }
  apply(buffer: Float32Array, stride: number, count: number, dt: number) {}
}

export class CurlModifier extends ModifierNode {
  public scale: number = 0.5;
  constructor() { super(ModifierType.CURL); }
  apply(buffer: Float32Array, stride: number, count: number, dt: number) {}
}
