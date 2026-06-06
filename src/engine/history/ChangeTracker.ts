import { Project } from '../project/Project';

export interface DeltaChange {
  field: string;
  before: any;
  after: any;
}

export class ChangeTracker {
  detectDeltas(before: Project, after: Project): DeltaChange[] {
    const deltas: DeltaChange[] = [];

    // Analyze style
    if (before.sceneState.brandStyle !== after.sceneState.brandStyle) {
      deltas.push({
        field: 'Brand Archetype Style',
        before: before.sceneState.brandStyle,
        after: after.sceneState.brandStyle
      });
    }

    // Analyze parameters
    if (before.sceneState.cameraSettings.fov !== after.sceneState.cameraSettings.fov) {
      deltas.push({
        field: 'Camera Lens FOV',
        before: before.sceneState.cameraSettings.fov,
        after: after.sceneState.cameraSettings.fov
      });
    }

    if (before.sceneState.lightingRig !== after.sceneState.lightingRig) {
      deltas.push({
        field: 'Studio Lighting Rig',
        before: before.sceneState.lightingRig,
        after: after.sceneState.lightingRig
      });
    }

    // Analyze tracks lengths
    if (before.timelineTracks.length !== after.timelineTracks.length) {
      deltas.push({
        field: 'Timeline Track Channels Count',
        before: before.timelineTracks.length,
        after: after.timelineTracks.length
      });
    }

    // Analyze assets checklist
    if (before.assets.length !== after.assets.length) {
      deltas.push({
        field: 'Asset Resource Links Count',
        before: before.assets.length,
        after: after.assets.length
      });
    }

    return deltas;
  }
}

export const globalChangeTracker = new ChangeTracker();
export default globalChangeTracker;
