import { MotionStyleType } from '../../ai/style/MotionStyle';

export interface AICompositionRule {
  layout: string;
  spacing: string;
  cameraMovement: string;
  clutterLevel: string;
  transitions: string;
}

export const AICompositionRulesRegistry: Record<string, AICompositionRule> = {
  [MotionStyleType.LUXURY]: {
    layout: 'centered/symmetric',
    spacing: 'elegant/high_margin',
    cameraMovement: 'slow_pan/subtle_dolly',
    clutterLevel: 'minimal',
    transitions: 'smooth_crossfade'
  },
  [MotionStyleType.SPORTS]: {
    layout: 'asymmetric/dynamic_angles',
    spacing: 'tight/overlapping',
    cameraMovement: 'aggressive/handheld_shake',
    clutterLevel: 'high_energy_particles',
    transitions: 'hard_cut/whip_pan'
  },
  [MotionStyleType.CORPORATE]: {
    layout: 'balanced/rule_of_thirds',
    spacing: 'clean/geometric',
    cameraMovement: 'straight/linear_slide',
    clutterLevel: 'structured_accents',
    transitions: 'fade/clean_wipe'
  },
  [MotionStyleType.TECH]: {
    layout: 'layered_depth/grid_based',
    spacing: 'precise/hud_like',
    cameraMovement: 'snap_zoom/orbit',
    clutterLevel: 'glowing_nodes_data_streams',
    transitions: 'glitch/digital_distortion'
  },
  [MotionStyleType.MINIMAL]: {
    layout: 'whitespace/center',
    spacing: 'expansive',
    cameraMovement: 'static/micro_drift',
    clutterLevel: 'none',
    transitions: 'soft_fade'
  }
};
