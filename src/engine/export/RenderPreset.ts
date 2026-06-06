export enum RenderPreset {
  DRAFT = 'DRAFT',
  PREVIEW = 'PREVIEW',
  HIGH = 'HIGH',
  ULTRA = 'ULTRA',
  PRODUCTION = 'PRODUCTION'
}

export interface PresetProperties {
  name: string;
  sampleCount: number;
  shadows: boolean;
  antiAliasing: boolean;
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  motionBlur: boolean;
  depthOfField: boolean;
  fps: number;
}

export const PRESETS: Record<RenderPreset, PresetProperties> = {
  [RenderPreset.DRAFT]: {
    name: 'Draft (Draft Render)',
    sampleCount: 1,
    shadows: false,
    antiAliasing: false,
    textureQuality: 'low',
    motionBlur: false,
    depthOfField: false,
    fps: 15
  },
  [RenderPreset.PREVIEW]: {
    name: 'Preview (Standard View)',
    sampleCount: 2,
    shadows: true,
    antiAliasing: true,
    textureQuality: 'medium',
    motionBlur: false,
    depthOfField: false,
    fps: 24
  },
  [RenderPreset.HIGH]: {
    name: 'High Quality (Full HD)',
    sampleCount: 4,
    shadows: true,
    antiAliasing: true,
    textureQuality: 'high',
    motionBlur: true,
    depthOfField: true,
    fps: 30
  },
  [RenderPreset.ULTRA]: {
    name: 'Ultra (4K Master)',
    sampleCount: 8,
    shadows: true,
    antiAliasing: true,
    textureQuality: 'ultra',
    motionBlur: true,
    depthOfField: true,
    fps: 60
  },
  [RenderPreset.PRODUCTION]: {
    name: 'Cinema Production (120 FPS)',
    sampleCount: 16,
    shadows: true,
    antiAliasing: true,
    textureQuality: 'ultra',
    motionBlur: true,
    depthOfField: true,
    fps: 120
  }
};
