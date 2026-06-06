export enum MotionBlockType {
  REVEAL = 'REVEAL',
  ASSEMBLE = 'ASSEMBLE',
  EXPLODE = 'EXPLODE',
  ORBIT = 'ORBIT',
  ROTATE = 'ROTATE',
  SCALE = 'SCALE',
  GLOW = 'GLOW',
  ENERGY = 'ENERGY',
  TRAIL = 'TRAIL',
  MORPH = 'MORPH',
  FADE = 'FADE',
  FLASH = 'FLASH',
  HOLD = 'HOLD',
  EXIT = 'EXIT'
}

export interface MotionBlockConfig {
  id: string;
  type: MotionBlockType;
  duration: number;
  delay: number;
  easing?: string;
  parameters: Record<string, any>;
  dependencies?: string[];
}
