import { Project } from '../project/Project';
import { Snapshot } from './Snapshot';
import { globalProjectManager } from '../project/ProjectManager';
import { globalActivityLog } from '../collaboration/ActivityLog';

export class RestoreEngine {
  public restoreToSnapshot(snap: Snapshot): { success: boolean; restoredProject?: Project; error?: string } {
    try {
      const parsedProject: Project = JSON.parse(snap.projectBackup);
      
      // Update ProjectManager state
      const current = globalProjectManager.getActiveProject();
      
      // Keep ID, but restore scene variables, timelines, assets, description
      current.metadata.name = parsedProject.metadata.name;
      current.metadata.description = parsedProject.metadata.description;
      current.metadata.lastModifiedAt = Date.now();
      current.sceneState = { ...parsedProject.sceneState };
      current.timelineTracks = [...parsedProject.timelineTracks];
      current.assets = [...parsedProject.assets];

      // Save project natively to trigger serialization across engine & indexers
      globalProjectManager.saveActive();

      // Log success activity
      globalActivityLog.log({
        type: 'VERSION_RESTORE',
        projectName: current.metadata.name,
        details: `Restored workspace structure to version checkpoint ${snap.versionCode}`,
        author: 'Alexander Wright'
      });

      return {
        success: true,
        restoredProject: current,
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Parsing corruption during system restore'
      };
    }
  }
}

export const globalRestoreEngine = new RestoreEngine();
