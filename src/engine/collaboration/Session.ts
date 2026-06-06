export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string; // Tailwind hex or color name
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  lastSeen: number;
}

export class Session {
  private collaborators: Collaborator[] = [];
  private connectionState: 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' = 'CONNECTED';
  private pingMs = 24;

  constructor() {
    this.seedCollaborators();
  }

  private seedCollaborators() {
    this.collaborators = [
      {
        id: 'user_1',
        name: 'Alexander Wright',
        avatar: 'AW',
        color: '#6366f1', // indigo
        role: 'OWNER',
        status: 'ONLINE',
        lastSeen: Date.now()
      },
      {
        id: 'user_2',
        name: 'Sophia Mercer',
        avatar: 'SM',
        color: '#f59e0b', // amber
        role: 'EDITOR',
        status: 'ONLINE',
        lastSeen: Date.now() - 30 * 1000
      },
      {
        id: 'user_3',
        name: 'Marcus K.',
        avatar: 'MK',
        color: '#10b981', // emerald
        role: 'VIEWER',
        status: 'ONLINE',
        lastSeen: Date.now() - 5 * 60 * 1000
      }
    ];
  }

  public getCollaborators(): Collaborator[] {
    return this.collaborators;
  }

  public getSessionStatus() {
    return {
      connectionState: this.connectionState,
      pingMs: this.pingMs,
      activeCount: this.collaborators.filter(c => c.status === 'ONLINE').length
    };
  }

  public updatePresence(userId: string, status: 'ONLINE' | 'AWAY' | 'OFFLINE') {
    const user = this.collaborators.find(c => c.id === userId);
    if (user) {
      user.status = status;
      user.lastSeen = Date.now();
    }
  }

  public addNewUser(user: Omit<Collaborator, 'lastSeen'>) {
    this.collaborators.push({
      ...user,
      lastSeen: Date.now()
    });
  }
}

export const globalSession = new Session();
