export interface CameraPreset {
  id: string;
  name: string;
  description: string;
  fov: number;
  enableDof: boolean;
  focusDistance: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  stabilizationFactor: number;
}

export const cameraPresets: CameraPreset[] = [
  {
    id: 'cine_macro',
    name: '8K Cinematic Macro Focal',
    description: 'Deep background blur with low field-of-view, focused on close-ups.',
    fov: 28,
    enableDof: true,
    focusDistance: 8.5,
    position: [0, 1.2, 8.5],
    lookAt: [0, 0, 0],
    stabilizationFactor: 0.98
  },
  {
    id: 'orbit_wide',
    name: '360° Infinite Orbit Wide',
    description: 'High visibility landscape layout traversing concentric pathways.',
    fov: 55,
    enableDof: false,
    focusDistance: 12.0,
    position: [6, 4, 10],
    lookAt: [0, 1.0, 0],
    stabilizationFactor: 0.9
  },
  {
    id: 'dolly_rise',
    name: 'Vertigo Dolly Rise Zoom',
    description: 'Low-angle ascent accompanied by progressive lenses.',
    fov: 40,
    enableDof: true,
    focusDistance: 10.0,
    position: [0, -3, 11],
    lookAt: [0, 1.5, 0],
    stabilizationFactor: 0.95
  },
  {
    id: 'action_shaky',
    name: 'Sports Action Handheld Jitter',
    description: 'Energetic manual camera frame tracking sports trajectories.',
    fov: 48,
    enableDof: false,
    focusDistance: 7.5,
    position: [-2, 3, 9],
    lookAt: [0, 0.5, 0],
    stabilizationFactor: 0.65
  }
];
