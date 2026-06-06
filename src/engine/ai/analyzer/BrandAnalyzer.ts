import { LogoAnalysis } from './LogoAnalyzer';

export enum BrandStyle {
  LUXURY = 'Luxury',
  TECHNOLOGY = 'Technology',
  SPORTS = 'Sports',
  GAMING = 'Gaming',
  FINANCE = 'Finance',
  FASHION = 'Fashion',
  MINIMAL = 'Minimal',
  CORPORATE = 'Corporate',
  CREATIVE = 'Creative',
  ENTERTAINMENT = 'Entertainment'
}

export class BrandAnalyzer {
  analyze(logo: LogoAnalysis): BrandStyle {
    if (logo.dominantColors.includes('#ffd700') && logo.symmetry > 0.7) {
      return BrandStyle.LUXURY;
    }
    if (logo.geometryType === 'angular') return BrandStyle.TECHNOLOGY;
    return BrandStyle.MINIMAL;
  }
}
