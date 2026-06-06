export enum MotionStyle {
  LUXURY_REVEAL = 'Luxury Reveal',
  TECH_REVEAL = 'Tech Reveal',
  SPORTS_REVEAL = 'Sports Reveal',
  EPIC_REVEAL = 'Epic Reveal',
  MINIMAL_REVEAL = 'Minimal Reveal',
  ABSTRACT_REVEAL = 'Abstract Reveal',
  PREMIUM_REVEAL = 'Premium Reveal',
  CORPORATE_REVEAL = 'Corporate Reveal'
}

export class StyleLibrary {
  static getStyleDefinition(style: MotionStyle) {
    return {
       camera: 'ORBIT',
       lighting: 'STUDIO',
       materials: ['GOLD', 'GLASS'],
       effects: ['BLOOM', 'PARTICLES'],
       timeline: '3_BEAT_REVEAL'
    };
  }
}
