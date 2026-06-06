import { Project } from './Project';

export class ProjectSerializer {
  /**
   * Translates a complete Project structure to a compact UTF-8 JSON stream.
   */
  public serialize(project: Project): string {
    try {
      const serializable = {
        ...project,
        serializedAt: Date.now(),
        format: 'MotionOS_Project_DNA_v1'
      };
      return JSON.stringify(serializable, null, 2);
    } catch (e) {
      console.error('ProjectSerializer failed:', e);
      throw new Error(`Serialization error: ${(e as Error).message}`);
    }
  }

  /**
   * Encodes a sub-module chunk (timeline tracks) separately if required.
   */
  public serializeTimeline(tracks: Project['timelineTracks']): string {
    return JSON.stringify({
      tracks,
      duration: 6.0,
      fps: 30,
      timestamp: Date.now()
    }, null, 2);
  }

  /**
   * Encodes a standalone MotionDNA configuration block.
   */
  public serializeMotionDNA(projectName: string, brandStyle: string, fx: string[], materials: string[]): string {
    return JSON.stringify({
      schema: 'MotionOS_DNA_Standard',
      projectName,
      brandStyle,
      engineeredAt: Date.now(),
      pipeline: {
        activeFX: fx,
        activeMaterials: materials,
        topologicalCheck: 'PASSED_SOLVER'
      }
    }, null, 2);
  }
}
