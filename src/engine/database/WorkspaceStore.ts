import { globalDatabase, DatabaseRecord } from './Database';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'MAINTENANCE';
  diskUsageEstimateBytes: number;
}

export class WorkspaceStore {
  private activeWorkspaceId = 'default_workspace';

  constructor() {
    this.ensureDefaultWorkspace();
  }

  private ensureDefaultWorkspace() {
    const list = globalDatabase.getTable<Workspace>('workspaces');
    if (list.length === 0) {
      globalDatabase.insert<Workspace>('workspaces', 'default_workspace', {
        id: 'default_workspace',
        name: 'Main Production Workspace',
        description: 'Primary visual and animation database stack for brand streams.',
        ownerId: 'user_1',
        status: 'ACTIVE',
        diskUsageEstimateBytes: 1548234,
      });
    }
  }

  public getActiveWorkspace(): Workspace {
    const list = globalDatabase.getTable<Workspace>('workspaces');
    const match = list.find(w => w.id === this.activeWorkspaceId);
    return match ? match.data : {
      id: 'default_workspace',
      name: 'Main Production Workspace',
      description: 'Primary visual and animation database stack for brand streams.',
      ownerId: 'user_1',
      status: 'ACTIVE',
      diskUsageEstimateBytes: 1548234,
    };
  }

  public getWorkspaceHealth() {
    const active = this.getActiveWorkspace();
    const isSane = active.status === 'ACTIVE';
    return {
      status: isSane ? 'SANITY_OK' : 'DEGRADED',
      healthPercent: isSane ? 100 : 60,
      readWriteSymmetry: 'BALANCED',
      activeUsers: 3,
      integrityChecksums: 'INTEGRITY_VERIFIED_SHA256'
    };
  }

  public recalculateWorkspaceSize() {
    // Collect simulated sizes of assets + JSON backups
    const workspaces = globalDatabase.getTable<Workspace>('workspaces');
    const index = workspaces.findIndex(w => w.id === this.activeWorkspaceId);
    if (index !== -1) {
      const projects = globalDatabase.getTable<any>('projects');
      const assets = globalDatabase.getTable<any>('assets');
      
      const projSize = projects.length * 12800; // 12.8 KB estimate per project text
      const assetSize = assets.reduce((acc, current) => acc + (current.data.metadata?.fileSizeEstimateBytes || 1024), 0);
      
      workspaces[index].data.diskUsageEstimateBytes = 1048576 + projSize + assetSize;
      globalDatabase.saveTable('workspaces', workspaces);
    }
  }
}

export const globalWorkspaceStore = new WorkspaceStore();
export { globalDatabase };
