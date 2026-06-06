import { BrandStyle } from '../analyzer/BrandAnalyzer';

export class FXPlanner {
  plan(style: BrandStyle) {
    const fx = ['BLOOM', 'LENS_FLARE'];
    if (style === BrandStyle.LUXURY) fx.push('PARTICLES', 'GLOW');
    if (style === BrandStyle.SPORTS) fx.push('SHOCKWAVE', 'MOTION_STREAKS');
    if (style === BrandStyle.TECHNOLOGY) fx.push('LIGHT_RAYS', 'ELECTRIC_ARC');
    return fx;
  }
}
