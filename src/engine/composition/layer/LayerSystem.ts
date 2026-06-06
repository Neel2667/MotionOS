import { v4 as uuidv4 } from 'uuid';

export enum LayerType {
  LOGO = 'LOGO',
  TEXT = 'TEXT',
  SHAPE = 'SHAPE',
  PARTICLE = 'PARTICLE',
  LIGHT = 'LIGHT',
  REFLECTION = 'REFLECTION',
  SHADOW = 'SHADOW',
  OVERLAY = 'OVERLAY',
  BACKGROUND = 'BACKGROUND',
  EFFECT = 'EFFECT'
}

export enum BlendMode {
  NORMAL = 'NORMAL',
  MULTIPLY = 'MULTIPLY',
  SCREEN = 'SCREEN',
  OVERLAY = 'OVERLAY',
  DARKEN = 'DARKEN',
  LIGHTEN = 'LIGHTEN',
  COLOR_DODGE = 'COLOR_DODGE',
  COLOR_BURN = 'COLOR_BURN',
  HARD_LIGHT = 'HARD_LIGHT',
  SOFT_LIGHT = 'SOFT_LIGHT',
  DIFFERENCE = 'DIFFERENCE',
  EXCLUSION = 'EXCLUSION'
}

export class Layer {
  public id: string = uuidv4();
  public name: string;
  public type: LayerType;
  
  public visible: boolean = true;
  public opacity: number = 1.0;
  public blendMode: BlendMode = BlendMode.NORMAL;
  public priority: number = 0; // Z-index equivalent
  
  public parentId: string | null = null;
  public childrenIds: string[] = [];
  
  public locked: boolean = false;
  public soloed: boolean = false;
  public muted: boolean = false; // Prevents timeline evaluation

  constructor(name: string, type: LayerType) {
    this.name = name;
    this.type = type;
  }
}

export class LayerGroup extends Layer {
  constructor(name: string) {
    super(name, LayerType.EFFECT); // Or CUSTOM
  }
}

export class LayerMask {
  public id: string = uuidv4();
  public targetLayerId: string = '';
  public maskLayerId: string = '';
  public inverted: boolean = false;
}

export class LayerStack {
  public id: string = uuidv4();
  public rootLayers: string[] = [];
}

export class LayerRegistry {
  private layers: Map<string, Layer> = new Map();
  register(layer: Layer) { this.layers.set(layer.id, layer); }
  get(id: string) { return this.layers.get(id); }
  
  remove(id: string) {
    // Should also handle parent/child cleanups
    this.layers.delete(id);
  }
}
