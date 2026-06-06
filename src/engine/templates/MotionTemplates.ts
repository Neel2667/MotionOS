export interface MotionPreset {
  id: string;
  name: string;
  description: string;
  easing: string;
  frequency: number;
  amplitude: number;
  speed: number;
  keyframeCurves: Array<{ property: string; frames: Array<{ time: number; value: any }> }>;
}

export const motionPresets: MotionPreset[] = [
  {
    id: 'kinetic_hyper',
    name: 'Kinetic Hyper Jump',
    description: 'High energy speed ramp and crisp timing markers.',
    easing: 'cubic-bezier(0.15, 1, 0.3, 1)',
    frequency: 2.2,
    amplitude: 1.5,
    speed: 1.8,
    keyframeCurves: [
      { property: 'scale', frames: [{ time: 0, value: 0.1 }, { time: 1.5, value: 1.3 }, { time: 3.0, value: 1.0 }] },
      { property: 'rotation', frames: [{ time: 0, value: -90 }, { time: 1.5, value: 410 }, { time: 3.0, value: 360 }] }
    ]
  },
  {
    id: 'velvet_ease',
    name: 'Velvet Soft Arc',
    description: 'Slow visual rise and fall designed for premium aesthetics.',
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    frequency: 0.4,
    amplitude: 0.6,
    speed: 0.4,
    keyframeCurves: [
      { property: 'scale', frames: [{ time: 0, value: 0.5 }, { time: 4.0, value: 1.02 }, { time: 8.0, value: 1.0 }] },
      { property: 'rotation', frames: [{ time: 0, value: 0 }, { time: 4.0, value: 15 }, { time: 8.0, value: 0 }] }
    ]
  },
  {
    id: 'elastic_bounce',
    name: 'Snapback Elastic Snap',
    description: 'Overshooting physics behavior with dynamic settle times.',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    frequency: 1.6,
    amplitude: 1.2,
    speed: 1.1,
    keyframeCurves: [
      { property: 'scale', frames: [{ time: 0, value: 0 }, { time: 1.0, value: 1.2 }, { time: 2.0, value: 1.0 }] },
      { property: 'rotation', frames: [{ time: 0, value: -180 }, { time: 1.2, value: 45 }, { time: 2.2, value: 360 }] }
    ]
  },
  {
    id: 'linear_sweep',
    name: 'Linear Industrial Swarm',
    description: 'Continuous motion without acceleration spikes.',
    easing: 'linear',
    frequency: 1.0,
    amplitude: 1.0,
    speed: 1.0,
    keyframeCurves: [
      { property: 'scale', frames: [{ time: 0, value: 0.8 }, { time: 5.0, value: 1.0 }] },
      { property: 'rotation', frames: [{ time: 0, value: 0 }, { time: 5.0, value: 360 }] }
    ]
  }
];
