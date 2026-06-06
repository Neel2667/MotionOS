import { BrandStyle } from '../analyzer/BrandAnalyzer';

export class MaterialPlanner {
  plan(style: BrandStyle) {
    switch(style) {
      case BrandStyle.LUXURY: return ['GOLD', 'GLASS', 'MATTE'];
      case BrandStyle.TECHNOLOGY: return ['CHROME', 'NEON', 'HOLOGRAPHIC'];
      case BrandStyle.SPORTS: return ['CARBON_FIBER', 'PLASTIC'];
      default: return ['MATTE', 'METALLIC'];
    }
  }
}
