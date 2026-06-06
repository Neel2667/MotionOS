import { v4 as uuidv4 } from 'uuid';

export class MaterialNode {
  public id: string = uuidv4();
  public operation: string;
  public parameters: Record<string, any>;
  constructor(operation: string, parameters: Record<string, any> = {}) {
    this.operation = operation;
    this.parameters = parameters;
  }
}

export class MaterialGraph {
  public id: string = uuidv4();
  public type: string; // GOLD, CHROME, etc.
  public nodes: MaterialNode[] = [];
  
  constructor(type: string) {
    this.type = type;
  }
}

export class MaterialCompiler {
  compile(graph: MaterialGraph) {
    // Returns shader code mapping based on input nodes (Albedo, Roughness, Metallic, etc.)
    return { shaderSource: 'void main() { ... }' };
  }
}

export const MaterialPresets = {
  GOLD: { metalness: 1.0, roughness: 0.1, color: '#ffd700' },
  CHROME: { metalness: 1.0, roughness: 0.02, color: '#ffffff' },
  GLASS: { transmission: 1.0, ior: 1.5, roughness: 0.0, transparent: true },
  LIQUID_METAL: { metalness: 1.0, roughness: 0.1, clearcoat: 1.0, color: '#aaaaaa' },
  NEON: { emissive: '#00ffff', emissiveIntensity: 5.0, color: '#000000' },
  HOLOGRAPHIC: { iridescence: 1.0, iridescenceIOR: 1.3, transparent: true, opacity: 0.8 },
  CARBON_FIBER: { metalness: 0.5, roughness: 0.8, clearcoat: 0.5 },
  MATTE: { metalness: 0.0, roughness: 1.0, color: '#222222' },
  PLASTIC: { metalness: 0.0, roughness: 0.3, color: '#cc0000' },
  EMISSIVE: { emissive: '#ffffff', emissiveIntensity: 2.0 }
};
