export enum MaterialType {
  GLASS = 'GLASS',
  CHROME = 'CHROME',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  PLASTIC = 'PLASTIC',
  MATTE = 'MATTE',
  METAL = 'METAL',
  LIQUID_METAL = 'LIQUID_METAL',
  CARBON_FIBER = 'CARBON_FIBER',
  NEON = 'NEON',
  GRADIENT = 'GRADIENT',
  TRANSPARENT = 'TRANSPARENT',
  REFLECTIVE = 'REFLECTIVE',
  HOLOGRAPHIC = 'HOLOGRAPHIC'
}

export class MaterialLibrary {
  static getDefinition(type: MaterialType): Record<string, any> {
    switch (type) {
      case MaterialType.GLASS: return { transmission: 0.9, roughness: 0.1, ior: 1.5 };
      case MaterialType.CHROME: return { metalness: 1.0, roughness: 0.05, color: '#ffffff' };
      case MaterialType.GOLD: return { metalness: 1.0, roughness: 0.15, color: '#ffd700' };
      case MaterialType.SILVER: return { metalness: 1.0, roughness: 0.2, color: '#c0c0c0' };
      case MaterialType.PLASTIC: return { metalness: 0.0, roughness: 0.4, color: '#ff0000' };
      case MaterialType.MATTE: return { metalness: 0.0, roughness: 0.9, color: '#333333' };
      case MaterialType.METAL: return { metalness: 0.8, roughness: 0.5, color: '#888888' };
      case MaterialType.LIQUID_METAL: return { metalness: 1.0, roughness: 0.0, clearcoat: 1.0, color: '#cccccc' };
      case MaterialType.CARBON_FIBER: return { metalness: 0.6, roughness: 0.7, map: 'carbon_pattern' };
      case MaterialType.NEON: return { emissive: '#00ff00', emissiveIntensity: 2.0, color: '#000000' };
      case MaterialType.GRADIENT: return { type: 'linear', colors: ['#ff0000', '#0000ff'] };
      case MaterialType.TRANSPARENT: return { opacity: 0.5, transparent: true, color: '#ffffff' };
      case MaterialType.REFLECTIVE: return { envMapIntensity: 1.5, roughness: 0.0, metalness: 1.0 };
      case MaterialType.HOLOGRAPHIC: return { iridescence: 1.0, iridescenceIOR: 1.3, transparent: true, opacity: 0.8 };
      default: return { color: '#ffffff' };
    }
  }
}
