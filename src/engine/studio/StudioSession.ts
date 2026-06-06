import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';

export interface UploadedLogo {
  fileName: string;
  fileSizeBytes: number;
  dataUrl?: string; // Loaded image
  dominantColors: string[];
  symmetryScore: number;
}

export type ScreenAspectRatio = '16:9' | '9:16' | '1:1' | '21:9';
export type RenderQuality = 'Draft' | 'Normal' | 'Producer 4K' | 'Master 8K';

export interface StudioSessionState {
  currentStepIndex: number; // 0 to 10 matching flow steps
  logo: UploadedLogo | null;
  brandStyle: BrandStyle | null;
  durationSec: number;
  aspectRatio: ScreenAspectRatio;
  quality: RenderQuality;
  generatedMotionDNA: string | null;
  sceneName: string | null;
  cameraSettingApplied: boolean;
  fxApplied: boolean;
  timelineSynthesized: boolean;
  previewReady: boolean;
  isProjectValidated: boolean;
}

export class StudioSession {
  private state: StudioSessionState = {
    currentStepIndex: 0,
    logo: null,
    brandStyle: null,
    durationSec: 5,
    aspectRatio: '16:9',
    quality: 'Normal',
    generatedMotionDNA: null,
    sceneName: null,
    cameraSettingApplied: false,
    fxApplied: false,
    timelineSynthesized: false,
    previewReady: false,
    isProjectValidated: false
  };

  private listeners: Set<(state: StudioSessionState) => void> = new Set();

  getState(): StudioSessionState {
    return { ...this.state };
  }

  registerListener(cb: (state: StudioSessionState) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  updateState(partial: Partial<StudioSessionState>) {
    this.state = {
      ...this.state,
      ...partial
    };
    this.notify();
  }

  reset() {
    this.state = {
      currentStepIndex: 0,
      logo: null,
      brandStyle: null,
      durationSec: 5,
      aspectRatio: '16:9',
      quality: 'Normal',
      generatedMotionDNA: null,
      sceneName: null,
      cameraSettingApplied: false,
      fxApplied: false,
      timelineSynthesized: false,
      previewReady: false,
      isProjectValidated: false
    };
    this.notify();
  }
}

export const globalStudioSession = new StudioSession();
export default globalStudioSession;
