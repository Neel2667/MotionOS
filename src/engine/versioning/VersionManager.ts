import { Snapshot } from './Snapshot';
import { globalDatabase } from '../database/Database';
import { Project } from '../project/Project';
import { globalActivityLog } from '../collaboration/ActivityLog';

export class VersionManager {
  public getSnapshotsForProject(projectId: string): Snapshot[] {
    const list = globalDatabase.getTable<Snapshot>('snapshots');
    return list
      .map(r => r.data)
      .filter(s => s.projectId === projectId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  public createSnapshot(
    project: Project,
    summary: string,
    type: 'AUTO' | 'MANUAL',
    author = 'Alexander Wright'
  ): Snapshot {
    const snapshots = this.getSnapshotsForProject(project.metadata.id);
    const major = type === 'MANUAL' ? snapshots.length + 1 : snapshots.length;
    const patch = type === 'AUTO' ? (snapshots.filter(s => s.type === 'AUTO').length + 1) : 0;
    const versionCode = `v1.${major}.${patch}`;

    // Calculate details
    let keyframeCount = 0;
    project.timelineTracks.forEach(t => {
      keyframeCount += t.keyframes.length;
    });

    const snap: Snapshot = {
      id: `snap_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      projectId: project.metadata.id,
      versionCode,
      timestamp: Date.now(),
      author,
      changeSummary: summary,
      projectBackup: JSON.stringify(project),
      type,
      timelineTrackCount: project.timelineTracks.length,
      keyframeCount,
    };

    globalDatabase.insert<Snapshot>('snapshots', snap.id, snap);
    
    // Log Activity
    try {
      globalActivityLog.log({
        type: type === 'MANUAL' ? 'SNAPSHOT_MANUAL' : 'SNAPSHOT_AUTO',
        projectName: project.metadata.name,
        details: `Saved version ${versionCode}: "${summary}" with ${keyframeCount} keyframes.`,
        author
      });
    } catch {
      // Background activity logger robust bypass
    }

    return snap;
  }

  public deleteSnapshot(id: string): boolean {
    return globalDatabase.delete('snapshots', id);
  }
}

export const globalVersionManager = new VersionManager();
