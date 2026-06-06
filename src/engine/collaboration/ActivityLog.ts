import { globalDatabase } from '../database/Database';

export interface ActivityItem {
  id: string;
  timestamp: number;
  userName: string;
  userRole: string;
  type: string; // 'PROJECT_CREATE' | 'ASSET_IMPORT' | 'SNAPSHOT_MANUAL' | 'SNAPSHOT_AUTO' | 'VERSION_RESTORE' | 'COMMENT_ADD' | 'PERMISSION_CHANGE' | 'TIMELINE_EDIT'
  projectName: string;
  details: string;
}

type LogListener = (activities: ActivityItem[]) => void;

export class ActivityLog {
  private listeners: Set<LogListener> = new Set();

  public log(params: {
    type: string;
    projectName: string;
    details: string;
    author?: string;
    role?: string;
  }) {
    const table = globalDatabase.getTable<any>('activity');
    const now = Date.now();
    const item: ActivityItem = {
      id: `act_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: now,
      userName: params.author || 'Alexander Wright',
      userRole: params.role || 'Owner',
      type: params.type,
      projectName: params.projectName,
      details: params.details,
    };

    table.push({
      id: item.id,
      createdAt: now,
      updatedAt: now,
      data: item,
    });

    globalDatabase.saveTable('activity', table);
    this.notify();
  }

  public getLogs(): ActivityItem[] {
    const list = globalDatabase.getTable<ActivityItem>('activity');
    return list.map(r => r.data).sort((a, b) => b.timestamp - a.timestamp);
  }

  public registerListener(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const logs = this.getLogs();
    this.listeners.forEach(cb => cb(logs));
  }
}

export const globalActivityLog = new ActivityLog();
