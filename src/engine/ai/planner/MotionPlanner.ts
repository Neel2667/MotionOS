import { BrandStyle } from '../analyzer/BrandAnalyzer';

export interface MotionPlan {
  animationSpeed: number;
  energyLevel: number;
  cameraIntensity: number;
  particleAmount: number;
  timing: 'linear' | 'ease' | 'spring';
  revealStrategy: string;
}

export class MotionPlanner {
  plan(style: BrandStyle): MotionPlan {
    switch (style) {
      case BrandStyle.LUXURY:
        return { animationSpeed: 0.5, energyLevel: 0.3, cameraIntensity: 0.4, particleAmount: 500, timing: 'ease', revealStrategy: 'FADE_AND_SCALE' };
      case BrandStyle.SPORTS:
        return { animationSpeed: 1.5, energyLevel: 1.0, cameraIntensity: 0.9, particleAmount: 5000, timing: 'spring', revealStrategy: 'SLAM_IN' };
      default:
        return { animationSpeed: 1.0, energyLevel: 0.5, cameraIntensity: 0.5, particleAmount: 1000, timing: 'ease', revealStrategy: 'SMOOTH_REVEAL' };
    }
  }
}
