import { Project } from '../project/Project';

export interface Snapshot {
  id: string;
  projectId: string;
  versionCode: string; // e.g. "v1.2.0"
  timestamp: number;
  author: string;
  changeSummary: string; // Describe what was modified
  projectBackup: string; // Serialized string representation of Project
  type: 'AUTO' | 'MANUAL';
  timelineTrackCount: number;
  keyframeCount: number;
}
