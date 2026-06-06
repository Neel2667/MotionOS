import { v4 as uuidv4 } from 'uuid';

export enum AspectRatio {
  RATIO_16_9 = '16:9',
  RATIO_9_16 = '9:16',
  RATIO_1_1 = '1:1',
  RATIO_4_5 = '4:5',
  RATIO_21_9 = '21:9',
  CUSTOM = 'CUSTOM'
}

export class CompositionSettings {
  public aspectRatio: AspectRatio = AspectRatio.RATIO_16_9;
  public width: number = 1920;
  public height: number = 1080;
  public fps: number = 60;
  public duration: number = 10.0; // seconds
  public background: string = '#000000';
  public safeArea: number = 0.1; // 10%
  public margins: number[] = [0, 0, 0, 0]; // T, R, B, L
  public centerGuides: boolean = true;
}

export class Composition {
  public id: string = uuidv4();
  public name: string;
  public settings: CompositionSettings = new CompositionSettings();
  public layerStackId: string = '';

  constructor(name: string) {
    this.name = name;
  }
}

export class CompositionRegistry {
  private comps: Map<string, Composition> = new Map();
  register(comp: Composition) { this.comps.set(comp.id, comp); }
  get(id: string) { return this.comps.get(id); }
}

export class CompositionManager {
  private registry: CompositionRegistry;

  constructor(registry: CompositionRegistry) {
    this.registry = registry;
  }

  createComposition(name: string, settings?: Partial<CompositionSettings>): Composition {
    const comp = new Composition(name);
    if (settings) {
      Object.assign(comp.settings, settings);
    }
    this.registry.register(comp);
    return comp;
  }
}
