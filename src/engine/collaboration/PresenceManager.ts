import { globalSession, Collaborator } from './Session';

export interface CursorPresence {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  activeElementId?: string;
  lastActiveAt: number;
}

type PresenceListener = (presence: CursorPresence[]) => void;

export class PresenceManager {
  private presences: Map<string, CursorPresence> = new Map();
  private listeners: Set<PresenceListener> = new Set();
  private intervalId: any = null;

  constructor() {
    this.startSimulation();
  }

  public registerListener(listener: PresenceListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllPresences());
    return () => this.listeners.delete(listener);
  }

  public getAllPresences(): CursorPresence[] {
    return Array.from(this.presences.values());
  }

  public updateLocale(userId: string, x: number, y: number, elemId?: string) {
    const collaborator = globalSession.getCollaborators().find(c => c.id === userId);
    if (!collaborator) return;

    this.presences.set(userId, {
      userId,
      userName: collaborator.name,
      color: collaborator.color,
      x,
      y,
      activeElementId: elemId,
      lastActiveAt: Date.now()
    });
    this.notify();
  }

  private notify() {
    const arr = this.getAllPresences();
    this.listeners.forEach(cb => cb(arr));
  }

  private startSimulation() {
    // Periodically update teammates' cursors to simulate activity!
    this.intervalId = setInterval(() => {
      const peers = globalSession.getCollaborators().filter(c => c.id !== 'user_1' && c.status === 'ONLINE');
      
      peers.forEach(p => {
        // Generate continuous random path walk on-the-fly
        const base = this.presences.get(p.id) || { x: 300, y: 200 };
        const dx = (Math.random() - 0.5) * 80;
        const dy = (Math.random() - 0.5) * 60;
        
        const newX = Math.max(50, Math.min(800, base.x + dx));
        const newY = Math.max(50, Math.min(500, base.y + dy));

        const elements = ['track_1', 'track_2', 'property_fov', 'property_zoom', 'timeline_clip_1', 'layer_logo'];
        const selectedId = Math.random() > 0.7 ? elements[Math.floor(Math.random() * elements.length)] : undefined;

        this.presences.set(p.id, {
          userId: p.id,
          userName: p.name,
          color: p.color,
          x: Math.round(newX),
          y: Math.round(newY),
          activeElementId: selectedId,
          lastActiveAt: Date.now()
        });
      });

      this.notify();
    }, 1500);
  }

  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const globalPresenceManager = new PresenceManager();
