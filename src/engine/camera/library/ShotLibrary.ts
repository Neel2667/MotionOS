export enum ShotPreset {
  HERO_REVEAL = 'HERO_REVEAL',
  LUXURY_REVEAL = 'LUXURY_REVEAL',
  PRODUCT_REVEAL = 'PRODUCT_REVEAL',
  MINIMAL_REVEAL = 'MINIMAL_REVEAL',
  SPORTS_REVEAL = 'SPORTS_REVEAL',
  TECH_REVEAL = 'TECH_REVEAL',
  EPIC_REVEAL = 'EPIC_REVEAL',
  ABSTRACT_REVEAL = 'ABSTRACT_REVEAL'
}

export class ShotLibrary {
  static getSequence(preset: ShotPreset): any[] {
    switch (preset) {
      case ShotPreset.LUXURY_REVEAL:
        return [
          { type: 'PEDESTAL', duration: 3.0, params: { speed: 0.1, easing: 'smooth' } },
          { type: 'ORBIT', duration: 4.0, params: { radius: 5, easing: 'slow' } },
          { type: 'DOLLY', duration: 3.0, params: { zoom: 1.2, easing: 'linear' } }
        ];
      case ShotPreset.SPORTS_REVEAL:
         return [
          { type: 'CRANE', duration: 1.0, params: { height: 10, speed: 2.0 } },
          { type: 'PAN', duration: 0.5, params: { angle: 90, speed: 5.0 } },
          { type: 'LOOK_AT', duration: 2.0, params: { target: 'HERO', jitter: 0.1 } }
         ];
      default:
        return [{ type: 'PAN', duration: 5.0, params: {} }];
    }
  }
}
