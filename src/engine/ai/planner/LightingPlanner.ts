import { BrandStyle } from '../analyzer/BrandAnalyzer';

export class LightingPlanner {
  plan(style: BrandStyle) {
    return {
      rig: style === BrandStyle.LUXURY ? 'LUXURY_STUDIO' : 'STANDARD',
      lights: ['KEY', 'RIM', 'FILL'],
      environment: 'HDRI_STUDIO'
    };
  }
}
