import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastModifiedAt: number;
  author: string;
  version: string;
}

export interface ProjectAsset {
  id: string;
  name: string;
  type: 'LOGO' | 'TEXTURE' | 'FONT' | 'AUDIO';
  path: string;
  sizeBytes: number;
  metadata?: Record<string, any>;
}

export interface ProjectSceneState {
  brandStyle: BrandStyle;
  activeFX: string[];
  activeMaterials: string[];
  cameraSettings: {
    fov: number;
    near: number;
    far: number;
    position: [number, number, number];
    lookAt: [number, number, number];
    enableDof: boolean;
    focusDistance: number;
  };
  lightingRig: string;
  environmentName: string;
}

export interface Project {
  metadata: ProjectMetadata;
  sceneState: ProjectSceneState;
  timelineTracks: Array<{
    id: string;
    name: string;
    type: string;
    muted: boolean;
    locked: boolean;
    keyframes: Array<{ id: string; time: number; value: any; easing?: string }>;
  }>;
  assets: ProjectAsset[];
}

export function createNewProject(name: string, brandStyle: BrandStyle = BrandStyle.LUXURY): Project {
  const timestamp = Date.now();
  return {
    metadata: {
      id: `proj_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      name,
      description: `A brand design stream formulated under ${brandStyle} heuristics design language.`,
      createdAt: timestamp,
      lastModifiedAt: timestamp,
      author: 'MotionOS Lead Designer',
      version: '1.0.0'
    },
    sceneState: {
      brandStyle,
      activeFX: ['PARTICLES', 'BLOOM'],
      activeMaterials: ['GOLD', 'GLASS'],
      cameraSettings: {
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [0, 5, 10],
        lookAt: [0, 0, 0],
        enableDof: true,
        focusDistance: 5.0
      },
      lightingRig: 'LUXURY_STUDIO',
      environmentName: 'REFLECTIVE_GRID'
    },
    timelineTracks: [
      {
        id: 'track_1',
        name: 'Brand Logo Keyframes',
        type: 'TRANSFORM',
        muted: false,
        locked: false,
        keyframes: [
          { id: 'kf_1', time: 0, value: { scale: 0.2, rotation: 0 } },
          { id: 'kf_2', time: 3, value: { scale: 1.0, rotation: 360 } }
        ]
      },
      {
        id: 'track_2',
        name: 'Ambient Particle Emitters',
        type: 'FX_PULSE',
        muted: false,
        locked: false,
        keyframes: [
          { id: 'kf_3', time: 1.5, value: { count: 120, speed: 2.0 } },
          { id: 'kf_4', time: 6.0, value: { count: 350, speed: 0.5 } }
        ]
      }
    ],
    assets: [
      {
        id: 'asset_logo_1',
        name: 'default_brand_vector_logo.svg',
        type: 'LOGO',
        path: '/assets/logo.svg',
        sizeBytes: 45200
      }
    ]
  };
}
