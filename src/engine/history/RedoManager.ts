import { Project } from '../project/Project';

export class RedoManager {
  private redoStack: string[] = []; // JSON strings of project backups
  private listeners: Set<() => void> = new Set();

  registerListener(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  pushState(project: Project) {
    this.redoStack.push(JSON.stringify(project));
    if (this.redoStack.length > 30) {
      this.redoStack.shift();
    }
    this.notify();
  }

  popState(): Project | null {
    if (this.redoStack.length === 0) return null;
    const projectStr = this.redoStack.pop();
    this.notify();
    return projectStr ? JSON.parse(projectStr) : null;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getStackSize(): number {
    return this.redoStack.length;
  }

  clear() {
    this.redoStack = [];
    this.notify();
  }
}

export const globalRedoManager = new RedoManager();
export default globalRedoManager;
