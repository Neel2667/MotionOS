import { MotionStyleType } from './MotionStyle';

export interface MotionRule {
  acceleration: string;
  easing: string;
  shake: string;
  cuts: string;
  movement: string;
  timing: string;
}

export const MotionRulesRegistry: Record<string, MotionRule> = {
  [MotionStyleType.LUXURY]: {
    acceleration: 'slow',
    easing: 'smooth',
    shake: 'minimal',
    cuts: 'crossfade/soft',
    movement: 'graceful',
    timing: 'relaxed'
  },
  [MotionStyleType.SPORTS]: {
    acceleration: 'fast',
    easing: 'punchy',
    shake: 'high',
    cuts: 'fast/hard',
    movement: 'energetic',
    timing: 'punchy'
  },
  [MotionStyleType.MINIMAL]: {
    acceleration: 'moderate',
    easing: 'linear or gentle_curve',
    shake: 'none',
    cuts: 'clean',
    movement: 'subtle',
    timing: 'balanced'
  },
  [MotionStyleType.TECH]: {
    acceleration: 'crisp',
    easing: 'step or sharply_eased',
    shake: 'glitch/micro',
    cuts: 'instant',
    movement: 'geometric',
    timing: 'syncopated'
  },
  [MotionStyleType.CINEMATIC]: {
    acceleration: 'variable',
    easing: 'dramatic',
    shake: 'camera_rumble',
    cuts: 'match_action',
    movement: 'sweeping',
    timing: 'narrative_driven'
  }
};
