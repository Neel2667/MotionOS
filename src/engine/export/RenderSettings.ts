import { RenderPreset } from './RenderPreset';

export enum ResolutionPreset {
  R_720P = '720p',
  R_1080P = '1080p',
  R_1440P = '1440p',
  R_4K = '4K',
  R_8K = '8K',
  CUSTOM = 'Custom'
}

export interface Resolution {
  width: number;
  height: number;
  aspectRatio: number;
}

export const RESOLUTION_MAP: Record<ResolutionPreset, Resolution> = {
  [ResolutionPreset.R_720P]: { width: 1280, height: 720, aspectRatio: 16 / 9 },
  [ResolutionPreset.R_1080P]: { width: 1920, height: 1080, aspectRatio: 16 / 9 },
  [ResolutionPreset.R_1440P]: { width: 2560, height: 1440, aspectRatio: 16 / 9 },
  [ResolutionPreset.R_4K]: { width: 3840, height: 2160, aspectRatio: 16 / 9 },
  [ResolutionPreset.R_8K]: { width: 7680, height: 4320, aspectRatio: 16 / 9 },
  [ResolutionPreset.CUSTOM]: { width: 1920, height: 1080, aspectRatio: 16 / 9 }
};

export enum ExportType {
  PNG_SEQUENCE = 'PNG Sequence',
  JPEG_SEQUENCE = 'JPEG Sequence',
  GIF = 'GIF',
  WEBM = 'WebM',
  MP4 = 'MP4',
  MOTION_DNA_JSON = 'MotionDNA JSON',
  PROJECT_JSON = 'Project JSON'
}

export interface RenderSettings {
  preset: RenderPreset;
  resolutionPreset: ResolutionPreset;
  customWidth: number;
  customHeight: number;
  exportType: ExportType;
  startFrame: number;
  endFrame: number;
  fps: number;
  compressionQuality: number; // 0.0 to 1.0
  motionBlurStrength: number; // 0.0 to 1.0
  usePreallocatedBuffers: boolean;
  deterministicExecution: boolean;
}

export const DEFAULT_RENDER_SETTINGS: RenderSettings = {
  preset: RenderPreset.PREVIEW,
  resolutionPreset: ResolutionPreset.R_1080P,
  customWidth: 1920,
  customHeight: 1080,
  exportType: ExportType.MP4,
  startFrame: 0,
  endFrame: 180, // 30fps * 6 seconds
  fps: 30,
  compressionQuality: 0.85,
  motionBlurStrength: 0.5,
  usePreallocatedBuffers: true,
  deterministicExecution: true
};
