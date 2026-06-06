import { v4 as uuidv4 } from 'uuid';

export enum CustomBlockType {
  REVEAL = 'Reveal',
  SCALE = 'Scale',
  ROTATE = 'Rotate',
  MORPH = 'Morph',
  EXPLODE = 'Explode',
  ASSEMBLE = 'Assemble',
  ORBIT = 'Orbit',
  PULSE = 'Pulse',
  TRAIL = 'Trail',
  SHATTER = 'Shatter',
  DISSOLVE = 'Dissolve',
  RIBBON = 'Ribbon',
  GLOW = 'Glow',
  WAVE = 'Wave',
  ELASTIC = 'Elastic',
  BOUNCE = 'Bounce'
}

export type MotionBlendMode = 'Add' | 'Multiply' | 'Override' | 'Blend';

export interface MotionBlock {
  id: string;
  name: string;
  type: CustomBlockType;
  duration: number; // seconds
  intensity: number; // 0 to 1
  delay: number; // seconds
  blendMode: MotionBlendMode;
  priority: number;
  parameters: Record<string, any>;
}

export class MotionBlockFactory {
  static create(type: CustomBlockType, overrides: Partial<MotionBlock> = {}): MotionBlock {
    const defaultParams: Record<string, any> = {};
    
    switch (type) {
      case CustomBlockType.REVEAL:
        defaultParams.direction = 'up';
        defaultParams.feather = 0.5;
        break;
      case CustomBlockType.ROTATE:
        defaultParams.axis = 'y';
        defaultParams.speed = 1.0;
        break;
      case CustomBlockType.SCALE:
        defaultParams.from = 0;
        defaultParams.to = 1;
        break;
      case CustomBlockType.GLOW:
        defaultParams.color = '#00ffff';
        defaultParams.glowIntensity = 1.5;
        break;
      case CustomBlockType.EXPLODE:
        defaultParams.particleCount = 500;
        defaultParams.velocity = 2.0;
        break;
      case CustomBlockType.WAVE:
        defaultParams.frequency = 3.0;
        defaultParams.amplitude = 0.2;
        break;
      default:
        break;
    }

    return {
      id: uuidv4(),
      name: overrides.name || `${type} Block`,
      type,
      duration: overrides.duration !== undefined ? overrides.duration : 2.0,
      intensity: overrides.intensity !== undefined ? overrides.intensity : 0.8,
      delay: overrides.delay !== undefined ? overrides.delay : 0,
      blendMode: overrides.blendMode || 'Blend',
      priority: overrides.priority !== undefined ? overrides.priority : 1,
      parameters: { ...defaultParams, ...(overrides.parameters || {}) }
    };
  }
}
