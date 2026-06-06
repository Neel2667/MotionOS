export interface FXPreset {
  id: string;
  name: string;
  description: string;
  activeFX: string[];
  bloomIntensity: number;
  chromaticAberration: number;
  vignette: number;
  particleStyle: 'VOLUMETRIC' | 'SPARKS' | 'GLOW_DUST' | 'NONE';
}

export const fxPresets: FXPreset[] = [
  {
    id: 'cosmic_glimmer',
    name: 'Cosmic Stellar Nebula',
    description: 'Vibrant interstellar dust streams and extreme bloom filters.',
    activeFX: ['BLOOM', 'SLOW_PARTICLES', 'VOLUMETRIC_SHIMMER'],
    bloomIntensity: 3.2,
    chromaticAberration: 0.008,
    vignette: 0.55,
    particleStyle: 'VOLUMETRIC'
  },
  {
    id: 'retro_crt',
    name: '1984 CRT VHS Decoder',
    description: 'Analog chromatic splitting and glowing horizontal scanlines.',
    activeFX: ['GLOW', 'SCAN_LINES', 'CHROMATIC_SPLIT', 'GLITCH_JITTER'],
    bloomIntensity: 1.8,
    chromaticAberration: 0.045,
    vignette: 0.35,
    particleStyle: 'NONE'
  },
  {
    id: 'liquid_glass',
    name: 'Refractive Fluid Prism',
    description: 'Microscopic glass refraction indices coupled with soft bokeh overlays.',
    activeFX: ['DOF', 'GLASS_REFRACTION', 'AMBER_GRAIN'],
    bloomIntensity: 1.2,
    chromaticAberration: 0.015,
    vignette: 0.45,
    particleStyle: 'GLOW_DUST'
  },
  {
    id: 'industrial_kinetic',
    name: 'High-Velocity Spark Shower',
    description: 'Dynamic direction-aligned metallic sparks radiating from active logo segments.',
    activeFX: ['FAST_SPARKS', 'BLOOM', 'LIGHTNING_BOOST'],
    bloomIntensity: 2.5,
    chromaticAberration: 0.01,
    vignette: 0.2,
    particleStyle: 'SPARKS'
  }
];
