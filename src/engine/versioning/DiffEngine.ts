import { Project } from '../project/Project';

export interface PropertyDiff {
  path: string;
  original: any;
  modified: any;
}

export interface ProjectDiffReport {
  isIdentical: boolean;
  similarityScore: number; // 0 to 100%
  modifiedFields: string[];
  trackMutedSaves: string[];
  timelineTrackCountDelta: number;
  keyframesAdded: string[];
  keyframesRemoved: string[];
  assetListChanges: string[];
  propDiffs: PropertyDiff[];
}

export class DiffEngine {
  public compareProjects(prev: Project, next: Project): ProjectDiffReport {
    const modifications: string[] = [];
    const propDiffs: PropertyDiff[] = [];
    const keysAdded: string[] = [];
    const keysRemoved: string[] = [];
    const assetChanges: string[] = [];

    // Names
    if (prev.metadata.name !== next.metadata.name) {
      modifications.push('Project Title');
      propDiffs.push({
        path: 'metadata.name',
        original: prev.metadata.name,
        modified: next.metadata.name
      });
    }

    // Styles
    if (prev.sceneState.brandStyle !== next.sceneState.brandStyle) {
      modifications.push('Brand Design Archetype');
      propDiffs.push({
        path: 'sceneState.brandStyle',
        original: prev.sceneState.brandStyle,
        modified: next.sceneState.brandStyle
      });
    }

    // Light
    if (prev.sceneState.lightingRig !== next.sceneState.lightingRig) {
      modifications.push('Lighting Rig Setup');
      propDiffs.push({
        path: 'sceneState.lightingRig',
        original: prev.sceneState.lightingRig,
        modified: next.sceneState.lightingRig
      });
    }

    // Tracks comparison
    const prevTrackIds = prev.timelineTracks.map(t => t.id);
    const nextTrackIds = next.timelineTracks.map(t => t.id);
    const timelineTrackCountDelta = next.timelineTracks.length - prev.timelineTracks.length;

    prev.timelineTracks.forEach(prevTrack => {
      const nextTrack = next.timelineTracks.find(t => t.id === prevTrack.id);
      if (!nextTrack) {
        modifications.push(`Removed Track: ${prevTrack.name}`);
      } else {
        // Compare track keyframes
        const prevKfs = prevTrack.keyframes;
        const nextKfs = nextTrack.keyframes;

        if (prevTrack.locked !== nextTrack.locked) {
          propDiffs.push({
            path: `tracks.${prevTrack.id}.locked`,
            original: prevTrack.locked,
            modified: nextTrack.locked
          });
        }

        if (prevTrack.muted !== nextTrack.muted) {
          propDiffs.push({
            path: `tracks.${prevTrack.id}.muted`,
            original: prevTrack.muted,
            modified: nextTrack.muted
          });
        }

        // Keyframe changes
        prevKfs.forEach(kf => {
          const match = nextKfs.find(n => n.id === kf.id);
          if (!match) {
            keysRemoved.push(`Track "${prevTrack.name}" Frame ${kf.time || (kf as any).frame}`);
          } else if (JSON.stringify(kf.value) !== JSON.stringify(match.value)) {
            propDiffs.push({
              path: `tracks.${prevTrack.id}.keyframe.${kf.id}.value`,
              original: kf.value,
              modified: match.value
            });
          }
        });

        nextKfs.forEach(kf => {
          const match = prevKfs.find(p => p.id === kf.id);
          if (!match) {
            keysAdded.push(`Track "${nextTrack.name}" Frame ${kf.time || (kf as any).frame}`);
          }
        });
      }
    });

    next.timelineTracks.forEach(nextTrack => {
      const prevTrack = prev.timelineTracks.find(t => t.id === nextTrack.id);
      if (!prevTrack) {
        modifications.push(`Added Track: ${nextTrack.name}`);
      }
    });

    // Assets comparison
    const prevAssetIds = prev.assets.map(a => a.id);
    const nextAssetIds = next.assets.map(a => a.id);

    prev.assets.forEach(a => {
      if (!nextAssetIds.includes(a.id)) {
        assetChanges.push(`Removed: ${a.name}`);
      }
    });

    next.assets.forEach(a => {
      if (!prevAssetIds.includes(a.id)) {
        assetChanges.push(`Linked: ${a.name}`);
      }
    });

    const isIdentical = modifications.length === 0 && propDiffs.length === 0 && keysAdded.length === 0 && keysRemoved.length === 0 && assetChanges.length === 0;
    
    // Calculate custom score
    let score = 100;
    score -= modifications.length * 15;
    score -= propDiffs.length * 8;
    score -= keysAdded.length * 10;
    score -= keysRemoved.length * 10;
    score -= assetChanges.length * 12;

    const similarityScore = Math.max(0, Math.min(100, score));

    return {
      isIdentical,
      similarityScore,
      modifiedFields: modifications,
      trackMutedSaves: [],
      timelineTrackCountDelta,
      keyframesAdded: keysAdded,
      keyframesRemoved: keysRemoved,
      assetListChanges: assetChanges,
      propDiffs
    };
  }
}

export const globalDiffEngine = new DiffEngine();
