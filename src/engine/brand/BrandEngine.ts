import { BrandProfile, BrandStyleArchetype, ColorSwatch } from './BrandProfile';
import { ColorAnalyzer } from './ColorAnalyzer';
import { TypographyAnalyzer } from './TypographyAnalyzer';
import { ShapeAnalyzer } from './ShapeAnalyzer';
import { PaletteGenerator } from './PaletteGenerator';

export class BrandEngine {
  private colors = new ColorAnalyzer();
  private typography = new TypographyAnalyzer();
  private shape = new ShapeAnalyzer();
  private palette = new PaletteGenerator();

  /**
   * Generates a fully integrated BrandProfile after assessing the name and metadata of an uploaded asset.
   */
  public analyzeBrandAsset(assetName: string, fileSize: number = 245000): BrandProfile {
    const cleanName = assetName.toLowerCase();
    
    // 1. Determine Brand Style Archetype and Confidence
    let style = BrandStyleArchetype.MINIMAL;
    let confidenceScore = 0.75;

    if (cleanName.includes('mercedes') || cleanName.includes('luxury') || cleanName.includes('gold') || cleanName.includes('rolex') || cleanName.includes('elite')) {
      style = BrandStyleArchetype.LUXURY;
      confidenceScore = 0.96;
    } else if (cleanName.includes('cyber') || cleanName.includes('tech') || cleanName.includes('network') || cleanName.includes('silicon')) {
      style = BrandStyleArchetype.TECHNOLOGY;
      confidenceScore = 0.94;
    } else if (cleanName.includes('corporate') || cleanName.includes('inc') || cleanName.includes('capital') || cleanName.includes('finance')) {
      style = BrandStyleArchetype.CORPORATE;
      confidenceScore = 0.90;
    } else if (cleanName.includes('nike') || cleanName.includes('sports') || cleanName.includes('run') || cleanName.includes('stadium')) {
      style = BrandStyleArchetype.SPORTS;
      confidenceScore = 0.92;
    } else if (cleanName.includes('game') || cleanName.includes('play') || cleanName.includes('xbox') || cleanName.includes('strobe')) {
      style = BrandStyleArchetype.GAMING;
      confidenceScore = 0.95;
    } else if (cleanName.includes('fashion') || cleanName.includes('vogue') || cleanName.includes('gq') || cleanName.includes('design')) {
      style = BrandStyleArchetype.FASHION;
      confidenceScore = 0.88;
    } else if (cleanName.includes('medical') || cleanName.includes('health') || cleanName.includes('doctor') || cleanName.includes('care')) {
      style = BrandStyleArchetype.MEDICAL;
      confidenceScore = 0.89;
    } else if (cleanName.includes('school') || cleanName.includes('learn') || cleanName.includes('education') || cleanName.includes('university')) {
      style = BrandStyleArchetype.EDUCATION;
      confidenceScore = 0.86;
    } else if (cleanName.includes('minimal') || cleanName.includes('clean') || cleanName.includes('pure')) {
      style = BrandStyleArchetype.MINIMAL;
      confidenceScore = 0.93;
    }

    // 2. Perform component analyses
    const detectedColors = this.colors.analyze(assetName);
    const primaryHex = detectedColors[0]?.hex || '#ffd700';
    const completePalette = this.palette.generateFromStyle(primaryHex, style);
    const fontMetric = this.typography.analyze(assetName);
    const shapeMetric = this.shape.analyze(assetName, fileSize);

    // 3. Formulate motion suggestions tailored to the style archetype
    let motionStyle = 'Clean linear keyframe fades';
    let cameraStyle = 'Fixed center coordinate perspective';
    let suggestedFX = ['BLOOM'];
    let suggestedMaterials = ['MATTE_PLASTIC'];

    switch (style) {
      case BrandStyleArchetype.LUXURY:
        motionStyle = 'Elite cinematic kinetic sweeping ease';
        cameraStyle = 'Low sweeping orbital tracking with shallow DOF';
        suggestedFX = ['BLOOM', 'DEPTH_OF_FIELD', 'AMBIENT_OCCLUSION'];
        suggestedMaterials = ['LIQUID_GOLD', 'CLEAR_GLASS', 'PLATINUM'];
        break;
      case BrandStyleArchetype.TECHNOLOGY:
        motionStyle = 'High frequency step sequencer triggers';
        cameraStyle = 'Fast isometric crane sweeps and focal cuts';
        suggestedFX = ['GLITCH_CHANNELS', 'NEON_GLOW', 'GRID_SHADERS'];
        suggestedMaterials = ['SILICON_CIRCUIT', 'CARBON_FIBER', 'MATTE_DARK'];
        break;
      case BrandStyleArchetype.CORPORATE:
        motionStyle = 'Balanced proportional layout grids transitions';
        cameraStyle = 'Conservative slow Dolly-In path zoom';
        suggestedFX = ['MINIMAL_SHADOWS', 'AMBIENT_OCCLUSION'];
        suggestedMaterials = ['BRUSHED_ALUMINUM', 'BLUE_POLYMER'];
        break;
      case BrandStyleArchetype.MINIMAL:
        motionStyle = 'Ultra smooth organic curve easing deceleration';
        cameraStyle = 'Zen-axial centered linear push with orthographic view';
        suggestedFX = ['SOFT_AMBIENT_LIGHT', 'GRAIN_FILTER'];
        suggestedMaterials = ['MATTE_CERAMIC', 'SANDBLAST_POLYMER'];
        break;
      case BrandStyleArchetype.SPORTS:
        motionStyle = 'Apex explosive snaps and whipping velocity steps';
        cameraStyle = 'Dynamic high velocity rotational chase pans';
        suggestedFX = ['SPEED_PARTICLES', 'STREAK_LINES', 'MOTION_BLUR'];
        suggestedMaterials = ['LIQUID_CHROME', 'VIBRANT_TREAD', 'FIBERGLAS_GOLD'];
        break;
      case BrandStyleArchetype.GAMING:
        motionStyle = 'Aggressive RGB color strobe steps with snap resets';
        cameraStyle = 'Extreme close-up glitch zoom tracking profiles';
        suggestedFX = ['COLOR_FRINGING', 'ENERGY_BARS', 'CHROMA_BLOOM'];
        suggestedMaterials = ['GLOW_EMISSIVE', 'POLISHED_RUBY', 'DARK_MESH'];
        break;
      case BrandStyleArchetype.FASHION:
        motionStyle = 'Soft flowing rhythmic loop-cycles with organic cadence';
        cameraStyle = 'Asymmetric off-center pan sweeps with tilt curves';
        suggestedFX = ['PRISM_REFLECTION', 'SOFT_GLOW', 'LENS_FLARE'];
        suggestedMaterials = ['LIQUID_ROSEGOLD', 'DIPPED_COPPER', 'FROSTED_GLASS'];
        break;
      case BrandStyleArchetype.MEDICAL:
        motionStyle = 'Rhythmic systolic pulse steps with constant timeline velocity';
        cameraStyle = 'Stabilized floating micro track movements';
        suggestedFX = ['STERILE_GRID', 'VOLUME_EMISSION'];
        suggestedMaterials = ['PULSE_GLASS', 'WHITE_ABS_PLASTIC'];
        break;
      case BrandStyleArchetype.EDUCATION:
        motionStyle = 'Symmetric grid-snapped blocks steps';
        cameraStyle = 'Direct Orthographic top view dolly path';
        suggestedFX = ['GRID_INTERACTIVE', 'HIGHLIGHT_MARKERS'];
        suggestedMaterials = ['MATTE_TEAL', 'POLISHED_MAPLE'];
        break;
    }

    // Assemble and return Brand Profile
    return {
      id: `profile_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      name: assetName.split('.').slice(0, -1).join('.') || 'Design Assembly Profile',
      style,
      confidenceScore,
      colors: {
        primary: completePalette.find(s => s.role === 'PRIMARY') || completePalette[0],
        secondary: completePalette.find(s => s.role === 'SECONDARY') || completePalette[2],
        accent: completePalette.find(s => s.role === 'ACCENT') || completePalette[3],
        background: completePalette.find(s => s.role === 'BACKGROUND') || completePalette[1],
        highlight: completePalette.find(s => s.role === 'HIGHLIGHT') || completePalette[4],
        palette: completePalette
      },
      typography: fontMetric,
      shape: shapeMetric,
      motionSuggestions: {
        motionStyle,
        cameraStyle,
        suggestedFX,
        suggestedMaterials
      },
      analyzedAt: Date.now()
    };
  }
}

// Global active instance of BrandEngine
export const globalBrandEngine = new BrandEngine();
export { BrandStyleArchetype };
export type { BrandProfile };
