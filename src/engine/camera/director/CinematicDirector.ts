import { MotionDNA } from '../../ai/dna/MotionDNA';
import { CameraBehaviorType, CameraBehaviorConfig } from '../behavior/CameraBehaviors';

export class SimpleShot {
  public id: string;
  public behavior: CameraBehaviorConfig;
  public duration: number;

  constructor(behavior: CameraBehaviorConfig, duration: number) {
    this.id = Math.random().toString();
    this.behavior = behavior;
    this.duration = duration;
  }
}

export class ShotPlanner {
  planCamera(blockType: string): SimpleShot {
     // Map single block to a shot
     return new SimpleShot({ type: CameraBehaviorType.PAN, parameters: {} }, 2.0);
  }
}

export class SequencePlanner {
  buildSequence(dna: MotionDNA) {
     // Builds sequence of shots based on timeline and beats
  }
}

export class BeatPlanner {
  syncBeats(bpm: number) {}
}

export class CameraPlanner {
  plan(dna: MotionDNA) {}
}

export class CinematicDirector {
  public shotPlanner = new ShotPlanner();
  public sequencePlanner = new SequencePlanner();
  public beatPlanner = new BeatPlanner();
  public cameraPlanner = new CameraPlanner();

  public evaluateDNA(dna: MotionDNA) {
    // Produces a timeline-ready cinematic sequence
    const shots = dna.motion_blocks.map(b => this.shotPlanner.planCamera(b.type));
    return shots;
  }
}
