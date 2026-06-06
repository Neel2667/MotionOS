import { BrandStyle } from '../analyzer/BrandAnalyzer';

export class TimelinePlanner {
  plan(style: BrandStyle) {
     return { cuts: 3, duration: 6.0, beatSync: true };
  }
}
