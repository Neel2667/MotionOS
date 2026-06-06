export enum EffectType {
  ENERGY_BURST = 'ENERGY_BURST',
  SHOCKWAVE = 'SHOCKWAVE',
  SMOKE = 'SMOKE',
  FIRE = 'FIRE',
  SPARKS = 'SPARKS',
  DUST = 'DUST',
  INK = 'INK',
  LIQUID = 'LIQUID',
  ELECTRIC_ARC = 'ELECTRIC_ARC',
  CRYSTAL_GROWTH = 'CRYSTAL_GROWTH',
  GLASS_SHATTER = 'GLASS_SHATTER',
  RIBBON_TRAILS = 'RIBBON_TRAILS',
  LIGHT_RAYS = 'LIGHT_RAYS',
  GLOW_PULSE = 'GLOW_PULSE',
  LENS_FLARE = 'LENS_FLARE',
  BLOOM = 'BLOOM',
  VOLUMETRIC_FOG = 'VOLUMETRIC_FOG',
  MOTION_STREAKS = 'MOTION_STREAKS'
}

export class EffectLibrary {
  static getEffectDefinition(type: EffectType) {
    switch(type) {
      case EffectType.ENERGY_BURST: return { intensity: 5.0, radius: 10, falloff: 0.8, color: '#00ffff' };
      case EffectType.SHOCKWAVE: return { thickness: 1.2, speed: 20, distortion: 0.5 };
      case EffectType.LENS_FLARE: return { elements: 8, intensity: 2.0, color: '#ffffff', artifacting: 0.2 };
      case EffectType.GLOW_PULSE: return { frequency: 4.0, minIntensity: 0.2, maxIntensity: 2.0 };
      case EffectType.LIGHT_RAYS: return { density: 0.5, weight: 0.3, decay: 0.95 };
      case EffectType.VOLUMETRIC_FOG: return { density: 0.05, heightFalloff: 0.2, color: '#111122' };
      case EffectType.MOTION_STREAKS: return { blendTime: 0.5, length: 1.5, threshold: 0.8 };
      case EffectType.BLOOM: return { threshold: 0.8, strength: 1.5, radius: 0.4 };
      default: return { intensity: 1.0 };
    }
  }
}
