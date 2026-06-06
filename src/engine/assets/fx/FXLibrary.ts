export enum FXType {
  GLOW = 'GLOW',
  BLOOM = 'BLOOM',
  LIGHT_SWEEP = 'LIGHT_SWEEP',
  LENS_FLARE = 'LENS_FLARE',
  FOG = 'FOG',
  SMOKE = 'SMOKE',
  DUST = 'DUST',
  SPARK = 'SPARK',
  ENERGY = 'ENERGY',
  TRAIL = 'TRAIL',
  RIPPLE = 'RIPPLE',
  SHOCKWAVE = 'SHOCKWAVE',
  REFLECTION = 'REFLECTION',
  REFRACTION = 'REFRACTION',
  CHROMATIC_SHIFT = 'CHROMATIC_SHIFT'
}

export class FXLibrary {
  static getDefinition(type: FXType): Record<string, any> {
    switch (type) {
      case FXType.GLOW: return { intensity: 1.5, radius: 10, color: '#ffffff' };
      case FXType.BLOOM: return { threshold: 0.8, strength: 1.2, radius: 0.5 };
      case FXType.LIGHT_SWEEP: return { angle: 45, width: 20, speed: 1.0, color: '#ffffff', opacity: 0.8 };
      case FXType.LENS_FLARE: return { elements: 5, intensity: 1.0, color: '#ffffff' };
      case FXType.FOG: return { density: 0.05, color: '#cccccc', near: 10, far: 100 };
      case FXType.SMOKE: return { particleCount: 100, lifetime: 5.0, color: '#444444' };
      case FXType.DUST: return { particleCount: 500, size: 0.1, speed: 0.05 };
      case FXType.SPARK: return { count: 30, lifetime: 0.5, velocity: 10, color: '#ffaa00' };
      case FXType.ENERGY: return { frequency: 5.0, amplitude: 0.5, thickness: 2.0, color: '#00ffff' };
      case FXType.TRAIL: return { length: 20, fadeTime: 1.0, color: '#ff00ff' };
      case FXType.RIPPLE: return { frequency: 10.0, speed: 2.0, amplitude: 0.1 };
      case FXType.SHOCKWAVE: return { speed: 15.0, thickness: 1.0, refraction: 0.2 };
      case FXType.REFLECTION: return { blur: 0.1, intensity: 0.5, mirror: true };
      case FXType.REFRACTION: return { ior: 1.2, dispersion: 0.05 };
      case FXType.CHROMATIC_SHIFT: return { amount: 0.02, angle: 45 };
      default: return {};
    }
  }
}
