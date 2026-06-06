import { BrandStyle } from '../analyzer/BrandAnalyzer';

export class ScenePlanner {
  plan(style: BrandStyle) {
    return {
      background: style === BrandStyle.LUXURY ? 'DARK_VOID' : 'LIGHT_STUDIO',
      composition: 'CENTERED',
      spacing: 'GENEROUS',
      depth: 'SHALLOW',
      objectHierarchy: ['BACKGROUND', 'PARTICLES', 'FX_BACK', 'SUBJECT', 'FX_FRONT']
    };
  }
}
