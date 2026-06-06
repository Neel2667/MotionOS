import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';
import { Project, createNewProject } from '../project/Project';
import { globalProjectManager } from '../project/ProjectManager';
import { globalStudioSession } from './StudioSession';
import { globalTemplateLibrary } from '../templates/TemplateLibrary';
import { globalEditHistory } from '../history/EditHistory';

export class GenerationEngine {
  generateDNA(style: BrandStyle): string {
    const formulas: Record<BrandStyle, string> = {
      [BrandStyle.LUXURY]: 'DNA_SLO_GOLD_SINE_CURVES_V3',
      [BrandStyle.TECHNOLOGY]: 'DNA_FAST_GLITCH_GRID_MATRIX_V9',
      [BrandStyle.SPORTS]: 'DNA_HYPER_SPEED_ANGULAR_SPLAY_V5',
      [BrandStyle.GAMING]: 'DNA_NEON_HYPERDRIVE_SPARKS_V7',
      [BrandStyle.FINANCE]: 'DNA_STEADY_BLUE_GROWTH_V2',
      [BrandStyle.FASHION]: 'DNA_FLOWING_SILK_EASE_V4',
      [BrandStyle.MINIMAL]: 'DNA_MONOCHROMATIC_ZEN_VOID_V1',
      [BrandStyle.CORPORATE]: 'DNA_SOLID_RELIABLE_MIGRATION_V6',
      [BrandStyle.CREATIVE]: 'DNA_EXPLOSIVE_VIBRANT_POLYMER_V8',
      [BrandStyle.ENTERTAINMENT]: 'DNA_SPLASH_STAGE_FLOODS_V10'
    };

    const dna = formulas[style] || 'DNA_GENERIC_PROCEDURAL_V1';
    globalStudioSession.updateState({ generatedMotionDNA: dna });
    return dna;
  }

  generateScene(project: Project, style: BrandStyle, aspect: string): Project {
    const updated = { ...project };
    
    // Custom configurations matching Brand Style
    if (style === BrandStyle.LUXURY) {
      updated.sceneState.activeMaterials = ['POLISHED_GOLD', 'WHITE_VEINED_MARBLE'];
      updated.sceneState.lightingRig = 'LUXURY_WARM_STUDIO';
      updated.sceneState.environmentName = 'CHAMBER_OF_REFLECTIONS';
    } else if (style === BrandStyle.TECHNOLOGY) {
      updated.sceneState.activeMaterials = ['FROSTED_GLASS', 'BLUE_EMISSIVE_CARBON'];
      updated.sceneState.lightingRig = 'CYBERPUNK_GRID_RIG';
      updated.sceneState.environmentName = 'INFINITE_GRID_VOID';
    } else if (style === BrandStyle.GAMING) {
      updated.sceneState.activeMaterials = ['SPLATTER_ACRYLIC', 'NEON_ORANGE'];
      updated.sceneState.lightingRig = 'RGB_ARENA_RIG';
      updated.sceneState.environmentName = 'GLOWING_STADIUM';
    } else {
      updated.sceneState.activeMaterials = ['MATTE_STEEL', 'ROUGH_CEMENT'];
      updated.sceneState.lightingRig = 'DUAL_OFFICE_LAMPS';
      updated.sceneState.environmentName = 'REFLECTIVE_SQUARE';
    }

    updated.sceneState.brandStyle = style;
    globalStudioSession.updateState({ sceneName: `Atmosphere: ${updated.sceneState.environmentName}` });
    return updated;
  }

  generateCamera(project: Project, style: BrandStyle): Project {
    const updated = { ...project };
    
    if (style === BrandStyle.LUXURY || style === BrandStyle.FASHION) {
      updated.sceneState.cameraSettings = {
        fov: 32,
        near: 0.1,
        far: 1000,
        position: [0, 2, 14],
        lookAt: [0, 0, 0],
        enableDof: true,
        focusDistance: 13.8
      };
    } else if (style === BrandStyle.TECHNOLOGY || style === BrandStyle.GAMING) {
      updated.sceneState.cameraSettings = {
        fov: 46,
        near: 0.2,
        far: 800,
        position: [5, 4, 9],
        lookAt: [0, 1.0, 0],
        enableDof: false,
        focusDistance: 8.0
      };
    } else {
      updated.sceneState.cameraSettings = {
        fov: 40,
        near: 0.1,
        far: 1000,
        position: [0, 3, 11],
        lookAt: [0, 0, 0],
        enableDof: true,
        focusDistance: 10.5
      };
    }

    globalStudioSession.updateState({ cameraSettingApplied: true });
    return updated;
  }

  generateFX(project: Project, style: BrandStyle): Project {
    const updated = { ...project };

    if (style === BrandStyle.LUXURY) {
      updated.sceneState.activeFX = ['BLOOM', 'DEPTH_OF_FIELD', 'SLOW_GOLD_DUST'];
    } else if (style === BrandStyle.TECHNOLOGY) {
      updated.sceneState.activeFX = ['GLOW', 'SCAN_LINES', 'CYAN_PARTICLES'];
    } else if (style === BrandStyle.GAMING || style === BrandStyle.SPORTS) {
      updated.sceneState.activeFX = ['GLOW', 'LENS_FLARE', 'FAST_SPARKS_EMITTER'];
    } else {
      updated.sceneState.activeFX = ['BLOOM', 'DOF'];
    }

    globalStudioSession.updateState({ fxApplied: true });
    return updated;
  }

  generateTimeline(project: Project, style: BrandStyle, durationSec: number): Project {
    const updated = { ...project };

    // Set timeline keyframes matched to duration and brand energy
    const frequency = style === BrandStyle.LUXURY || style === BrandStyle.MINIMAL ? 0.5 : 1.4;
    const rotationEnd = 360 * frequency;

    updated.timelineTracks = [
      {
        id: 'track_1',
        name: 'Synthesized Brand Pivot',
        type: 'TRANSFORM',
        muted: false,
        locked: false,
        keyframes: [
          { id: 'kf_g1', time: 0, value: { scale: 0.2, rotation: 0, speed: frequency } },
          { id: 'kf_g2', time: durationSec * 0.4, value: { scale: 1.15, rotation: rotationEnd * 0.6, speed: frequency * 1.5 } },
          { id: 'kf_g3', time: durationSec, value: { scale: 1.0, rotation: rotationEnd, speed: frequency } }
        ]
      },
      {
        id: 'track_2',
        name: 'Synthesized Atmospheric Dust',
        type: 'FX_PULSE',
        muted: false,
        locked: false,
        keyframes: [
          { id: 'kf_g4', time: 0, value: { count: 50, bloom: 1.5 } },
          { id: 'kf_g5', time: durationSec, value: { count: 250, bloom: 2.8 } }
        ]
      }
    ];

    globalStudioSession.updateState({ timelineSynthesized: true });
    return updated;
  }

  compilePreview(): boolean {
    globalStudioSession.updateState({ previewReady: true });
    return true;
  }

  runEndToEndSynthesis(logoFileName: string, style: BrandStyle, durationSec: number, aspect: string, quality: string): Project {
    const name = `AI Studio Run: ${logoFileName.replace(/\.[^/.]+$/, '')}`;
    
    // 1. Create fresh project conforming to style
    let proj = createNewProject(name, style);

    // 2. Generate DNA
    this.generateDNA(style);

    // 3. Generate Scene elements
    proj = this.generateScene(proj, style, aspect);

    // 4. Generate Camera
    proj = this.generateCamera(proj, style);

    // 5. Generate FX
    proj = this.generateFX(proj, style);

    // 6. Generate Timeline
    proj = this.generateTimeline(proj, style, durationSec);

    // 7. Compile Preview
    this.compilePreview();

    // 8. Update Session variables
    globalStudioSession.updateState({
      logo: {
        fileName: logoFileName,
        fileSizeBytes: 125400,
        dominantColors: style === BrandStyle.LUXURY ? ['#ffd700', '#1a1a1a'] : ['#00f0ff', '#121215'],
        symmetryScore: 0.85
      },
      brandStyle: style,
      durationSec,
      aspectRatio: aspect as any,
      quality: quality as any,
      currentStepIndex: 7 // Jump directly to preview ready!
    });

    // Save project natively so that Editor and Preview reflect this!
    globalProjectManager.loadProject(proj);
    globalProjectManager.saveActive();

    // Ingest into edit history
    globalEditHistory.addChange('End-to-end AI Studio automatic synthesis compiled', proj, 'CREATION');

    return proj;
  }
}

export const globalGenerationEngine = new GenerationEngine();
export default globalGenerationEngine;
