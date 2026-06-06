import { v4 as uuidv4 } from 'uuid';

export enum TransitionType {
  CUT = 'Cut',
  FADE = 'Fade',
  MORPH = 'Morph',
  LIGHT_FLASH = 'Light Flash',
  ENERGY_BURST = 'Energy Burst',
  PARTICLE_BLEND = 'Particle Blend',
  CAMERA_BLEND = 'Camera Blend',
  MOTION_BLEND = 'Motion Blend'
}

export interface Transition {
  id: string;
  type: TransitionType;
  duration: number; // in seconds
  triggerTime: number; // in seconds
  parameters: Record<string, any>;
}

export class TransitionLibrary {
  static getTransitionDefinition(type: TransitionType): Partial<Transition> {
    switch (type) {
      case TransitionType.FADE:
        return { duration: 1.0, parameters: { curve: 'easeInOutCubic', easeColor: '#000000' } };
      case TransitionType.LIGHT_FLASH:
        return { duration: 0.6, parameters: { flashIntensity: 3.5, flashColor: '#ffffff' } };
      case TransitionType.ENERGY_BURST:
        return { duration: 1.2, parameters: { particleBurstMultiplier: 2.5, forceRadius: 4.0 } };
      case TransitionType.CAMERA_BLEND:
        return { duration: 1.5, parameters: { trackingSmoothness: 0.95 } };
      default:
        return { duration: 0.0, parameters: {} }; // Cut or basic
    }
  }
}

export class TransitionManager {
  private transitions: Transition[] = [];

  addTransition(type: TransitionType, triggerTime: number, duration?: number, parameters: Record<string, any> = {}): Transition {
    const libraryDef = TransitionLibrary.getTransitionDefinition(type);
    const transition: Transition = {
      id: uuidv4(),
      type,
      duration: duration !== undefined ? duration : (libraryDef.duration || 0.5),
      triggerTime,
      parameters: { ...(libraryDef.parameters || {}), ...parameters }
    };
    this.transitions.push(transition);
    return transition;
  }

  getTransitions(): Transition[] {
    return this.transitions;
  }

  clear() {
    this.transitions = [];
  }

  /**
   * Applies the transitions overlay logic.
   * Based on current timeline playhead, returns weight properties for blending.
   */
  evaluate(time: number): { activeTransition: Transition | null, progress: number } {
    for (const transition of this.transitions) {
      const start = transition.triggerTime;
      const end = start + transition.duration;
      if (time >= start && time <= end) {
        const progress = (time - start) / transition.duration;
        return { activeTransition: transition, progress };
      }
    }
    return { activeTransition: null, progress: 0 };
  }
}
