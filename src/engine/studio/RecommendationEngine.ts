import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';

export interface SmartRecommendation {
  type: 'Motion' | 'Camera' | 'Lighting' | 'FX' | 'Material' | 'Timeline' | 'Typography' | 'Color';
  suggestion: string;
  description: string;
  confidenceScore: number; // 0 to 100
  recommendedParameters: Record<string, any>;
}

export class RecommendationEngine {
  getRecommendationsForBrand(style: BrandStyle | null): SmartRecommendation[] {
    const activeStyle = style || BrandStyle.LUXURY;

    switch (activeStyle) {
      case BrandStyle.LUXURY:
        return [
          {
            type: 'Motion',
            suggestion: 'Subtle Fluid Sines',
            description: 'Slow velvet acceleration curves to radiate luxury and ease.',
            confidenceScore: 98,
            recommendedParameters: { speedMultiplier: 0.4, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }
          },
          {
            type: 'Camera',
            suggestion: 'Narrow Portrait Dolly',
            description: 'Low fov (28deg-35deg) with heavy focus distance bokeh matching golden targets.',
            confidenceScore: 94,
            recommendedParameters: { fov: 32, enableDof: true, focusDistance: 13.5 }
          },
          {
            type: 'Lighting',
            suggestion: 'Chamber of Warm Refraction',
            description: 'Golden rims paired with a soft primary white light keyset.',
            confidenceScore: 96,
            recommendedParameters: { rigName: 'LUXURY_WARM_STUDIO', ambientIntensity: 0.45 }
          },
          {
            type: 'FX',
            suggestion: 'High Bloom Velvet Shimmer',
            description: 'Slow golden floating dust emitters and glowing microparticles.',
            confidenceScore: 92,
            recommendedParameters: { bloomIntensity: 2.5, particles: 60 }
          },
          {
            type: 'Material',
            suggestion: 'Polished Amber Metal',
            description: 'Mirror reflections with zero roughness and maximum metallic factors.',
            confidenceScore: 97,
            recommendedParameters: { metalness: 0.98, roughness: 0.02 }
          },
          {
            type: 'Timeline',
            suggestion: '8.0 Second Steady Loop',
            description: 'Generous time buffers allowing motion structures to settle fully.',
            confidenceScore: 90,
            recommendedParameters: { durationSec: 8.0, totalTicks: 400 }
          },
          {
            type: 'Typography',
            suggestion: 'High tracking serif font',
            description: 'E.g. Playfair Display or Bodoni MT to maximize brand stature.',
            confidenceScore: 95,
            recommendedParameters: { letterSpacing: '0.25em', uppercase: true }
          },
          {
            type: 'Color',
            suggestion: 'Gilded Onyx Slate',
            description: 'Dominant absolute blacks paired with #D4AF37 golden flakes and beige accents.',
            confidenceScore: 99,
            recommendedParameters: { palette: ['#121215', '#D4AF37', '#FFF4E0'] }
          }
        ];

      case BrandStyle.TECHNOLOGY:
        return [
          {
            type: 'Motion',
            suggestion: 'Silicon Vector Step',
            description: 'Snappy ease-in-out transformations matched to grid lines.',
            confidenceScore: 95,
            recommendedParameters: { speedMultiplier: 1.3, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          },
          {
            type: 'Camera',
            suggestion: 'Isometric Concentric Orbit',
            description: 'Concentric circular panning to reveal multi-dimensional vector shapes.',
            confidenceScore: 92,
            recommendedParameters: { fov: 45, enableDof: false }
          },
          {
            type: 'Lighting',
            suggestion: 'Neon Grid Illumination',
            description: 'Cyan and deep magenta area lights casting soft blue secondary tones.',
            confidenceScore: 94,
            recommendedParameters: { rigName: 'NEON_GRID_RIG', ambientIntensity: 0.25 }
          },
          {
            type: 'FX',
            suggestion: 'Analog Chromatic Glow',
            description: 'Scanlines, mild aberration edges, and cybernetic spark emitters.',
            confidenceScore: 96,
            recommendedParameters: { bloomIntensity: 3.5, particles: 300 }
          },
          {
            type: 'Material',
            suggestion: 'Frosted Emissive Plexiglass',
            description: 'High roughness refraction maps alongside custom digital matrix screens.',
            confidenceScore: 91,
            recommendedParameters: { metalness: 0.8, roughness: 0.1 }
          },
          {
            type: 'Timeline',
            suggestion: '5.5 Second Dynamic Pulse',
            description: 'Rapid speed cycles to match technical complexity.',
            confidenceScore: 89,
            recommendedParameters: { durationSec: 5.5, totalKeys: 3 }
          },
          {
            type: 'Typography',
            suggestion: 'JetBrains Mono / Fira Code',
            description: 'Clean space-proportioned developer monospaced families.',
            confidenceScore: 97,
            recommendedParameters: { letterSpacing: '0.12em', uppercase: false }
          },
          {
            type: 'Color',
            suggestion: 'Silicon Cyan Grid',
            description: 'Neon teal #00F0FF, violet and deep space carbon #050508.',
            confidenceScore: 98,
            recommendedParameters: { palette: ['#050508', '#00F0FF', '#7000FF'] }
          }
        ];

      case BrandStyle.GAMING:
        return [
          {
            type: 'Motion',
            suggestion: 'Hyper Energy Shockwave',
            description: 'Explosive scale offsets and rapid decelerations.',
            confidenceScore: 96,
            recommendedParameters: { speedMultiplier: 1.6, easing: 'cubic-bezier(0.8, 0, 0.2, 1)' }
          },
          {
            type: 'Camera',
            suggestion: 'Low-Angle Action Dolly',
            description: 'Wide field-of-view perspective emphasizing visual depths.',
            confidenceScore: 90,
            recommendedParameters: { fov: 52, position: [-4, 6, 6] }
          },
          {
            type: 'Lighting',
            suggestion: 'RGB Arena Floods',
            description: 'Opposing neon key lights casting stark, contrasting shadows.',
            confidenceScore: 93,
            recommendedParameters: { rigName: 'RGB_ARENA_RIG', shadows: true }
          },
          {
            type: 'FX',
            suggestion: 'Glitch Jitter Flare',
            description: 'Extreme bloom parameters combined with lightning fast sparks.',
            confidenceScore: 95,
            recommendedParameters: { bloomIntensity: 5.0, particles: 500 }
          },
          {
            type: 'Material',
            suggestion: 'Woven Carbon Fiber',
            description: 'Iridescence specular offsets combined with high metal textures.',
            confidenceScore: 91,
            recommendedParameters: { roughness: 0.2, metallic: 0.95 }
          },
          {
            type: 'Timeline',
            suggestion: '4.5 Second Aggressive Loop',
            description: 'Fast, looping bursts with instant response feedback.',
            confidenceScore: 88,
            recommendedParameters: { durationSec: 4.5 }
          },
          {
            type: 'Typography',
            suggestion: '900 Extra Black Oblique',
            description: 'Bold sloped designs denoting speed and energy.',
            confidenceScore: 94,
            recommendedParameters: { letterSpacing: '0.01em', uppercase: true }
          },
          {
            type: 'Color',
            suggestion: 'Cyberpunk Cyber-Neon',
            description: 'Vibrant hot magenta #FF0055 and glowing acid #00FF66.',
            confidenceScore: 96,
            recommendedParameters: { palette: ['#FF0055', '#00FF66', '#000000'] }
          }
        ];

      default:
        // Generic fallback
        return [
          {
            type: 'Motion',
            suggestion: 'Symmetrical Standard Ease',
            description: 'Standard cubic transition loops matching typical brand channels.',
            confidenceScore: 85,
            recommendedParameters: { speedMultiplier: 1.0, easing: 'ease-out' }
          },
          {
            type: 'Camera',
            suggestion: 'Classic Dolly Wide',
            description: 'Stable zoom track positioned front and center.',
            confidenceScore: 88,
            recommendedParameters: { fov: 42, positions: [0, 2, 11] }
          },
          {
            type: 'Lighting',
            suggestion: 'Neutral Corporate Accent',
            description: 'Stark white illumination and low secondary contrast.',
            confidenceScore: 84,
            recommendedParameters: { rigName: 'CLASSIC_THREE_POINT', shadows: true }
          },
          {
            type: 'FX',
            suggestion: 'Standard Soft Bloom',
            description: 'Clean focus fields with zero chromatic aberration distortion.',
            confidenceScore: 86,
            recommendedParameters: { bloomIntensity: 1.2 }
          },
          {
            type: 'Material',
            suggestion: 'Metallic Slate Brushed',
            description: 'Balanced steel metallic and mild roughness mapping.',
            confidenceScore: 87,
            recommendedParameters: { metalness: 0.6, roughness: 0.3 }
          },
          {
            type: 'Timeline',
            suggestion: '6.0 Second Balanced Sweep',
            description: 'Default duration for multi-screen social channels.',
            confidenceScore: 82,
            recommendedParameters: { durationSec: 6.0 }
          },
          {
            type: 'Typography',
            suggestion: 'Inter Sans-serif Stack',
            description: 'Versatile corporate neutral font family styling.',
            confidenceScore: 89,
            recommendedParameters: { letterSpacing: '0.05em', uppercase: false }
          },
          {
            type: 'Color',
            suggestion: 'Oceanic Corporate Gradient',
            description: 'Solid navy base #1E3A8A backed by polar grays.',
            confidenceScore: 90,
            recommendedParameters: { palette: ['#1E3A8A', '#F3F4F6', '#0B132B'] }
          }
        ];
    }
  }
}

export const globalRecommendationEngine = new RecommendationEngine();
export default globalRecommendationEngine;
