export interface ColorSwatch {
  hex: string;
  name: string;
  role: 'PRIMARY' | 'SECONDARY' | 'ACCENT' | 'BACKGROUND' | 'HIGHLIGHT';
  ratio: number; // Percentage of usage (0.0 to 1.0)
}

export interface TextMetric {
  fontFamily: string;
  weight: 'LIGHT' | 'REGULAR' | 'MEDIUM' | 'BOLD' | 'BLACK';
  contrast: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedPairings: string[];
  vibe: string;
}

export interface ShapeMetric {
  symmetry: number;       // 0.0 to 1.0
  balance: number;        // 0.0 to 1.0
  complexity: number;     // 0.0 to 1.0
  geometryType: 'ANGULAR' | 'CURVED' | 'MIXED';
}

export enum BrandStyleArchetype {
  LUXURY = 'Luxury',
  TECHNOLOGY = 'Technology',
  CORPORATE = 'Corporate',
  MINIMAL = 'Minimal',
  SPORTS = 'Sports',
  GAMING = 'Gaming',
  FASHION = 'Fashion',
  MEDICAL = 'Medical',
  EDUCATION = 'Education'
}

export interface BrandProfile {
  id: string;
  name: string;
  style: BrandStyleArchetype;
  confidenceScore: number; // 0.0 to 1.0
  colors: {
    primary: ColorSwatch;
    secondary: ColorSwatch;
    accent: ColorSwatch;
    background: ColorSwatch;
    highlight: ColorSwatch;
    palette: ColorSwatch[];
  };
  typography: TextMetric;
  shape: ShapeMetric;
  motionSuggestions: {
    motionStyle: string; // e.g. "Elite cinematic kinetic sweeping ease", "High frequency strobe snaps"
    cameraStyle: string; // e.g. "Low sweeping orbital tracking with shallow DOF"
    suggestedFX: string[]; // e.g. ["BLOOM", "GLITCH", "VOLUMETRIC_LIGHTS"]
    suggestedMaterials: string[]; // e.g. ["LIQUID_CHROME", "GLASS", "BRUSHED_STEEL"]
  };
  analyzedAt: number;
}
