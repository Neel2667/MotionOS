import { MotionBlockConfig } from './MotionBlocks';

export interface MotionDNA {
  id: string;
  version: string;
  style: string;
  mood: string;
  pacing: string;
  camera: any;
  lighting_style: any;
  colors: string[];
  transitions: any[];
  motion_blocks: MotionBlockConfig[];
  timing: any;
  metadata: Record<string, any>;
}
