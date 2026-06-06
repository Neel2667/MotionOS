import { v4 as uuidv4 } from 'uuid';

export enum ParticlePreset {
  DUST = 'DUST',
  SMOKE = 'SMOKE',
  FIRE = 'FIRE',
  SNOW = 'SNOW',
  RAIN = 'RAIN',
  ENERGY = 'ENERGY',
  GLASS_FRAGMENTS = 'GLASS_FRAGMENTS',
  METAL_FRAGMENTS = 'METAL_FRAGMENTS',
  INK = 'INK',
  BUBBLES = 'BUBBLES'
}

export class ParticleSystem {
  public id: string = uuidv4();
  public maxParticles: number = 1000;
  public activeParticles: number = 0;
  // Represented sequentially in Float32 arrays later
}

export class Emitter {
  public rate: number = 10; // particles per second
  public shape: string = 'POINT';
}

export class Spawner {
  spawn(system: ParticleSystem, count: number) {
    // Math to instantiate N particles based on Emitter rules
  }
}

export class Modifier {
  apply(system: ParticleSystem, dt: number) {}
}

export class Updater {
  update(system: ParticleSystem, dt: number) {
    // Process physics logic: velocity integrated to position
  }
}

export class Collider {
  checkCollisions(system: ParticleSystem) {}
}

export class Destroyer {
  cull(system: ParticleSystem) {
    // Find dead particles (life > maxLife) and reset to queue
  }
}

export class ParticleRegistry {
  private systems: Map<string, ParticleSystem> = new Map();
  register(system: ParticleSystem) { this.systems.set(system.id, system); }
  get(id: string) { return this.systems.get(id); }
}

export class ParticleLibrary {
  static getPreset(preset: ParticlePreset): any {
    switch (preset) {
      case ParticlePreset.DUST: return { rate: 50, life: 5.0, size: [0.1, 0.5], velocity: [0.1, 0.5] };
      case ParticlePreset.SMOKE: return { rate: 20, life: 3.0, size: [1.0, 5.0], color: '#333333' };
      case ParticlePreset.FIRE: return { rate: 100, life: 1.0, color: ['#ffff00', '#ff0000'] };
      case ParticlePreset.SNOW: return { rate: 200, life: 10.0, fallSpeed: 2.0 };
      case ParticlePreset.RAIN: return { rate: 500, life: 2.0, fallSpeed: 20.0 };
      case ParticlePreset.ENERGY: return { rate: 300, life: 0.5, emitShape: 'SPHERE' };
      case ParticlePreset.GLASS_FRAGMENTS: return { rate: 50, life: 4.0, gravity: 9.8 };
      case ParticlePreset.METAL_FRAGMENTS: return { rate: 30, life: 3.0, mass: 2.0 };
      case ParticlePreset.INK: return { rate: 150, life: 5.0, fluidDynamics: true };
      case ParticlePreset.BUBBLES: return { rate: 40, life: 6.0, buoyancy: 1.5 };
      default: return {};
    }
  }
}
