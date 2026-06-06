import { globalStudioSession, StudioSessionState } from './StudioSession';

export interface WorkflowStep {
  index: number;
  id: string;
  label: string;
  description: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { index: 0, id: 'UPLOAD', label: 'Upload Logo', description: 'Ingest company branding vectors into memory.' },
  { index: 1, id: 'ANALYZE', label: 'Analyze Brand', description: 'Decouple logo shapes and match visual palettes.' },
  { index: 2, id: 'DNA', label: 'Generate Motion DNA', description: 'Deconstruct logo pathways into procedural rules.' },
  { index: 3, id: 'SCENE', label: 'Generate Scene', description: 'Build reflective materials and atmospheric environments.' },
  { index: 4, id: 'CAMERA', label: 'Generate Camera', description: 'Anchor cinematic fov, focal macro limits, and Dolly sweeps.' },
  { index: 5, id: 'FX', label: 'Generate FX', description: 'Overlay particle systems, bloom flares, and glimmers.' },
  { index: 6, id: 'TIMELINE', label: 'Generate Timeline', description: 'Synthesize speed graphs and parametric keyframe lines.' },
  { index: 7, id: 'PREVIEW', label: 'Generate Preview', description: 'Compile real-time rendering checks in high efficiency.' },
  { index: 8, id: 'EDIT', label: 'Manual Editing', description: 'Fine-tune generated attributes through inspector controls.' },
  { index: 9, id: 'VALIDATE', label: 'Validation', description: 'Audit structure conflicts and calculate integrity score.' },
  { index: 10, id: 'EXPORT', label: 'Export Final', description: 'Dispatch render priority jobs into high-fidelity streams.' }
];

export class WorkflowManager {
  getSteps(): WorkflowStep[] {
    return WORKFLOW_STEPS;
  }

  getCurrentStep(): WorkflowStep {
    const state = globalStudioSession.getState();
    return WORKFLOW_STEPS[state.currentStepIndex] || WORKFLOW_STEPS[0];
  }

  canAdvance(): boolean {
    const state = globalStudioSession.getState();
    const idx = state.currentStepIndex;
    
    // Strict requirements for advancing
    if (idx === 0) return state.logo !== null;
    if (idx === 1) return state.brandStyle !== null;
    if (idx === 2) return state.generatedMotionDNA !== null;
    if (idx === 3) return state.sceneName !== null;
    if (idx === 4) return state.cameraSettingApplied;
    if (idx === 5) return state.fxApplied;
    if (idx === 6) return state.timelineSynthesized;
    if (idx === 7) return state.previewReady;
    
    return idx < WORKFLOW_STEPS.length - 1;
  }

  advance(): boolean {
    if (!this.canAdvance()) return false;
    const state = globalStudioSession.getState();
    globalStudioSession.updateState({ currentStepIndex: state.currentStepIndex + 1 });
    return true;
  }

  regress(): boolean {
    const state = globalStudioSession.getState();
    if (state.currentStepIndex === 0) return false;
    globalStudioSession.updateState({ currentStepIndex: state.currentStepIndex - 1 });
    return true;
  }

  jumpToStep(index: number): boolean {
    if (index >= 0 && index < WORKFLOW_STEPS.length) {
      globalStudioSession.updateState({ currentStepIndex: index });
      return true;
    }
    return false;
  }
}

export const globalWorkflowManager = new WorkflowManager();
export default globalWorkflowManager;
