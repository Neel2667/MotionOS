import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';

export interface MotionTemplate {
  duration: number;
  easing: string;
  speedMultiplier: number;
  frequency: number;
  amplitude: number;
  particleSpeed: number;
}

export interface CameraTemplate {
  fov: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  enableDof: boolean;
  focusDistance: number;
  trackingStyle: 'ORBIT' | 'DOLLY' | 'ZOOM' | 'STATIC' | 'SWEEP';
}

export interface LightingTemplate {
  rigName: string;
  ambientIntensity: number;
  primaryLightColor: string;
  secondaryLightColor: string;
  shadows: boolean;
}

export interface MaterialTemplate {
  activeMaterials: string[];
  metalness: number;
  roughness: number;
  baseColor: string;
  refractiveIndex: number;
}

export interface FXTemplate {
  activeFX: string[];
  bloomIntensity: number;
  particleCount: number;
  chromaticAberration: number;
  vignette: number;
}

export interface TransitionTemplate {
  type: 'FADE' | 'CROSS_DISSOLVE' | 'WIPE' | 'GLITCH' | 'ZOOM_IN';
  durationSec: number;
  easing: string;
}

export interface TypographyTemplate {
  fontFamily: string;
  fontSize: number;
  letterSpacing: string;
  fontWeight: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  brandStyle: BrandStyle;
  motion: MotionTemplate;
  camera: CameraTemplate;
  lighting: LightingTemplate;
  materials: MaterialTemplate;
  fx: FXTemplate;
  transitions: TransitionTemplate;
  typography: TypographyTemplate;
}

export const industryTemplates: Record<string, IndustryTemplate> = {
  luxury: {
    id: 'luxury',
    name: 'Luxury Velvet Gold',
    brandStyle: BrandStyle.LUXURY,
    motion: { duration: 8.0, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', speedMultiplier: 0.5, frequency: 0.5, amplitude: 0.8, particleSpeed: 0.2 },
    camera: { fov: 35, position: [0, 4, 12], lookAt: [0, 0, 0], enableDof: true, focusDistance: 11.5, trackingStyle: 'SWEEP' },
    lighting: { rigName: 'LUXURY_WARM_STUDIO', ambientIntensity: 0.4, primaryLightColor: '#FFF4E0', secondaryLightColor: '#D4AF37', shadows: true },
    materials: { activeMaterials: ['GOLD', 'MARBLE', 'VELVET'], metalness: 0.95, roughness: 0.05, baseColor: '#D4AF37', refractiveIndex: 2.4 },
    fx: { activeFX: ['BLOOM', 'DEPTH_OF_FIELD', 'SLOW_PARTICLES'], bloomIntensity: 2.0, particleCount: 80, chromaticAberration: 0.005, vignette: 0.6 },
    transitions: { type: 'FADE', durationSec: 1.5, easing: 'ease-in-out' },
    typography: { fontFamily: 'Playfair Display, serif', fontSize: 24, letterSpacing: '0.25em', fontWeight: '500' }
  },
  technology: {
    id: 'technology',
    name: 'Silicon Vector Grid',
    brandStyle: BrandStyle.TECHNOLOGY,
    motion: { duration: 6.0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', speedMultiplier: 1.2, frequency: 1.5, amplitude: 1.2, particleSpeed: 1.5 },
    camera: { fov: 45, position: [3, 5, 8], lookAt: [0, 0, 0], enableDof: false, focusDistance: 8.0, trackingStyle: 'ORBIT' },
    lighting: { rigName: 'NEON_GRID_RIG', ambientIntensity: 0.2, primaryLightColor: '#00F0FF', secondaryLightColor: '#7000FF', shadows: false },
    materials: { activeMaterials: ['CHROME', 'EMISSIVE_NEON', 'CARBON_FIBER'], metalness: 0.9, roughness: 0.1, baseColor: '#00F0FF', refractiveIndex: 1.5 },
    fx: { activeFX: ['GLOW', 'GRID_OVERLAY', 'SCAN_LINES', 'CYAN_PARTICLES'], bloomIntensity: 3.5, particleCount: 400, chromaticAberration: 0.02, vignette: 0.4 },
    transitions: { type: 'GLITCH', durationSec: 0.8, easing: 'linear' },
    typography: { fontFamily: 'JetBrains Mono, monospace', fontSize: 18, letterSpacing: '0.1em', fontWeight: '700' }
  },
  corporate: {
    id: 'corporate',
    name: 'Blue Solid Integrity',
    brandStyle: BrandStyle.CORPORATE,
    motion: { duration: 5.0, easing: 'ease-out', speedMultiplier: 1.0, frequency: 0.8, amplitude: 0.5, particleSpeed: 0.5 },
    camera: { fov: 40, position: [0, 3, 10], lookAt: [0, 0, 0], enableDof: true, focusDistance: 9.8, trackingStyle: 'DOLLY' },
    lighting: { rigName: 'THREE_POINT_OFFICE', ambientIntensity: 0.6, primaryLightColor: '#FFFFFF', secondaryLightColor: '#1E3A8A', shadows: true },
    materials: { activeMaterials: ['MATTE_STEEL', 'FROSTED_GLASS'], metalness: 0.5, roughness: 0.4, baseColor: '#1E3A8A', refractiveIndex: 1.45 },
    fx: { activeFX: ['BLOOM', 'DOF'], bloomIntensity: 1.0, particleCount: 30, chromaticAberration: 0.0, vignette: 0.2 },
    transitions: { type: 'CROSS_DISSOLVE', durationSec: 1.0, easing: 'ease-out' },
    typography: { fontFamily: 'Inter, sans-serif', fontSize: 20, letterSpacing: '0.05em', fontWeight: '600' }
  },
  minimal: {
    id: 'minimal',
    name: 'Zen Polar Void',
    brandStyle: BrandStyle.MINIMAL,
    motion: { duration: 7.0, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', speedMultiplier: 0.4, frequency: 0.3, amplitude: 0.2, particleSpeed: 0.1 },
    camera: { fov: 30, position: [0, 0, 15], lookAt: [0, 0, 0], enableDof: true, focusDistance: 15.0, trackingStyle: 'ZOOM' },
    lighting: { rigName: 'MONOCHROMETIC_SKY', ambientIntensity: 0.8, primaryLightColor: '#FDFDFD', secondaryLightColor: '#1A1A1A', shadows: true },
    materials: { activeMaterials: ['PLASTER', 'OAK_WOOD', 'FROSTED_GLASS'], metalness: 0.05, roughness: 0.85, baseColor: '#EBEBEB', refractiveIndex: 1.3 },
    fx: { activeFX: ['DOF', 'SOFT_VIGNETTE'], bloomIntensity: 0.5, particleCount: 0, chromaticAberration: 0.0, vignette: 0.7 },
    transitions: { type: 'FADE', durationSec: 2.0, easing: 'ease-in-out' },
    typography: { fontFamily: 'Helvetica Neue, sans-serif', fontSize: 16, letterSpacing: '0.3em', fontWeight: '300' }
  },
  gaming: {
    id: 'gaming',
    name: 'Cyberpunk Hyperdrive',
    brandStyle: BrandStyle.GAMING,
    motion: { duration: 4.5, easing: 'cubic-bezier(0.8, 0, 0.2, 1)', speedMultiplier: 1.5, frequency: 2.0, amplitude: 1.8, particleSpeed: 2.5 },
    camera: { fov: 50, position: [-4, 6, 6], lookAt: [0, 0, 0], enableDof: false, focusDistance: 7.0, trackingStyle: 'ORBIT' },
    lighting: { rigName: 'RGB_ARENA_RIG', ambientIntensity: 0.3, primaryLightColor: '#FF0055', secondaryLightColor: '#00FF66', shadows: true },
    materials: { activeMaterials: ['CARBON_FIBER', 'RED_EMISSIVE', 'GREEN_LASER'], metalness: 0.8, roughness: 0.2, baseColor: '#FF0055', refractiveIndex: 1.6 },
    fx: { activeFX: ['GLOW', 'LENS_FLARE', 'FAST_SPARKS', 'GLITCH_JITTER'], bloomIntensity: 5.0, particleCount: 600, chromaticAberration: 0.05, vignette: 0.5 },
    transitions: { type: 'WIPE', durationSec: 0.5, easing: 'ease-in' },
    typography: { fontFamily: 'Fira Code, monospace', fontSize: 22, letterSpacing: '0.02em', fontWeight: '900' }
  },
  sports: {
    id: 'sports',
    name: 'Asphalt Kinetic Speed',
    brandStyle: BrandStyle.SPORTS,
    motion: { duration: 5.0, easing: 'cubic-bezier(0.6, 0.01, 0.05, 0.99)', speedMultiplier: 1.4, frequency: 1.8, amplitude: 1.5, particleSpeed: 1.8 },
    camera: { fov: 48, position: [5, 2, 8], lookAt: [0, 1, 0], enableDof: true, focusDistance: 8.5, trackingStyle: 'SWEEP' },
    lighting: { rigName: 'STADIUM_FLOOD_RIG', ambientIntensity: 0.4, primaryLightColor: '#E2F952', secondaryLightColor: '#0A0A0A', shadows: true },
    materials: { activeMaterials: ['KINETIC_FIBER', 'RUBBER', 'CHROME'], metalness: 0.7, roughness: 0.3, baseColor: '#E2F952', refractiveIndex: 1.7 },
    fx: { activeFX: ['BLOOM', 'FAST_SPARKS', 'MOTION_BLUR'], bloomIntensity: 2.2, particleCount: 150, chromaticAberration: 0.015, vignette: 0.3 },
    transitions: { type: 'ZOOM_IN', durationSec: 0.7, easing: 'cubic-bezier(0.3, 1, 0.3, 1)' },
    typography: { fontFamily: 'Outfit, sans-serif', fontSize: 26, letterSpacing: '0.01em', fontWeight: '800' }
  },
  fashion: {
    id: 'fashion',
    name: 'Sartorial Silk Wave',
    brandStyle: BrandStyle.FASHION,
    motion: { duration: 7.5, easing: 'ease-in-out', speedMultiplier: 0.6, frequency: 0.6, amplitude: 0.9, particleSpeed: 0.3 },
    camera: { fov: 38, position: [0, 1, 14], lookAt: [0, 0, 0], enableDof: true, focusDistance: 13.5, trackingStyle: 'SWEEP' },
    lighting: { rigName: 'FASHION_RUNWAY_SOFT_LIGHT', ambientIntensity: 0.5, primaryLightColor: '#FFF0F5', secondaryLightColor: '#FF69B4', shadows: true },
    materials: { activeMaterials: ['SILK', 'ROSE_GOLD', 'CLEAR_GLASS'], metalness: 0.4, roughness: 0.1, baseColor: '#FFC0CB', refractiveIndex: 1.9 },
    fx: { activeFX: ['GLOW', 'SLOW_PARTICLES', 'LENS_BLOOM'], bloomIntensity: 2.8, particleCount: 100, chromaticAberration: 0.008, vignette: 0.4 },
    transitions: { type: 'CROSS_DISSOLVE', durationSec: 1.2, easing: 'ease-in-out' },
    typography: { fontFamily: 'Bodoni MT, serif', fontSize: 23, letterSpacing: '0.2em', fontWeight: '400' }
  },
  medical: {
    id: 'medical',
    name: 'Clinical Quartz Pulse',
    brandStyle: BrandStyle.CORPORATE,
    motion: { duration: 6.5, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', speedMultiplier: 0.7, frequency: 0.4, amplitude: 0.4, particleSpeed: 0.4 },
    camera: { fov: 42, position: [0, 4, 11], lookAt: [0, 0, 0], enableDof: true, focusDistance: 10.5, trackingStyle: 'ZOOM' },
    lighting: { rigName: 'SURGICAL_CLEAN_FLUORESCENT', ambientIntensity: 0.7, primaryLightColor: '#E0FAFF', secondaryLightColor: '#FFFFFF', shadows: false },
    materials: { activeMaterials: ['BIO_SYNTHETIC', 'QUARTZ', 'WHITE_CERAMIC'], metalness: 0.1, roughness: 0.2, baseColor: '#00D1FF', refractiveIndex: 1.55 },
    fx: { activeFX: ['BLOOM', 'DOF', 'WHITE_DUST'], bloomIntensity: 1.5, particleCount: 50, chromaticAberration: 0.002, vignette: 0.15 },
    transitions: { type: 'FADE', durationSec: 1.0, easing: 'ease-out' },
    typography: { fontFamily: 'Inter, sans-serif', fontSize: 19, letterSpacing: '0.08em', fontWeight: '500' }
  },
  education: {
    id: 'education',
    name: 'Academics Blueprint Canvas',
    brandStyle: BrandStyle.MINIMAL,
    motion: { duration: 6.2, easing: 'ease-out', speedMultiplier: 0.8, frequency: 0.7, amplitude: 0.6, particleSpeed: 0.6 },
    camera: { fov: 44, position: [2, 3, 9], lookAt: [0, 0.5, 0], enableDof: false, focusDistance: 9.0, trackingStyle: 'SWEEP' },
    lighting: { rigName: 'CLASSROOM_AMBIENT', ambientIntensity: 0.55, primaryLightColor: '#FFFCEE', secondaryLightColor: '#3B82F6', shadows: true },
    materials: { activeMaterials: ['MATTE_PAPER', 'PRIMARY_PLASTIC'], metalness: 0.0, roughness: 0.6, baseColor: '#3B82F6', refractiveIndex: 1.4 },
    fx: { activeFX: ['DOF', 'GRID_MEASUREMENTS'], bloomIntensity: 0.8, particleCount: 20, chromaticAberration: 0.0, vignette: 0.25 },
    transitions: { type: 'WIPE', durationSec: 1.2, easing: 'ease-in-out' },
    typography: { fontFamily: 'Outfit, sans-serif', fontSize: 18, letterSpacing: '0.05em', fontWeight: '600' }
  },
  startup: {
    id: 'startup',
    name: 'Spark Bold Rocketry',
    brandStyle: BrandStyle.CREATIVE,
    motion: { duration: 5.5, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', speedMultiplier: 1.3, frequency: 1.2, amplitude: 1.1, particleSpeed: 1.2 },
    camera: { fov: 46, position: [3, 4, 10], lookAt: [0, 0, 0], enableDof: true, focusDistance: 9.5, trackingStyle: 'ORBIT' },
    lighting: { rigName: 'SUNSET_CREATIVE_OFFICE', ambientIntensity: 0.45, primaryLightColor: '#FF7A00', secondaryLightColor: '#7F00FF', shadows: true },
    materials: { activeMaterials: ['GLOSSY_ACRYLIC', 'VIBRANT_POLYMER'], metalness: 0.3, roughness: 0.15, baseColor: '#FF7A00', refractiveIndex: 1.48 },
    fx: { activeFX: ['BLOOM', 'STREAKING_LIGHTS', 'ORANGE_PARTICLES'], bloomIntensity: 3.0, particleCount: 250, chromaticAberration: 0.012, vignette: 0.35 },
    transitions: { type: 'ZOOM_IN', durationSec: 0.9, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    typography: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 21, letterSpacing: '0.03em', fontWeight: '700' }
  }
};
