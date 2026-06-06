export type ProjectRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface UserPermission {
  userId: string;
  role: ProjectRole;
}

export class PermissionManager {
  private activeUserId = 'user_1'; // Active local user Alexander
  private projectRoles: Map<string, ProjectRole> = new Map();

  constructor() {
    this.projectRoles.set('user_1', 'OWNER');
    this.projectRoles.set('user_2', 'EDITOR');
    this.projectRoles.set('user_3', 'VIEWER');
  }

  public getActiveUserRole(): ProjectRole {
    return this.projectRoles.get(this.activeUserId) || 'VIEWER';
  }

  public setActiveUserRole(role: ProjectRole) {
    this.projectRoles.set(this.activeUserId, role);
  }

  public canModifyKeyframes(): boolean {
    const r = this.getActiveUserRole();
    return r === 'OWNER' || r === 'EDITOR';
  }

  public canEditParameters(): boolean {
    const r = this.getActiveUserRole();
    return r === 'OWNER' || r === 'EDITOR';
  }

  public canManageSnapshots(): boolean {
    const r = this.getActiveUserRole();
    return r === 'OWNER';
  }

  public isOwner(): boolean {
    return this.getActiveUserRole() === 'OWNER';
  }

  public getRoleLabel(role: ProjectRole): string {
    switch (role) {
      case 'OWNER': return 'Workspace Owner';
      case 'EDITOR': return 'Cooperative Editor';
      case 'VIEWER': return 'ReadOnly Viewer';
      default: return 'No Role';
    }
  }
}

export const globalPermissionManager = new PermissionManager();
