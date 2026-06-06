import { Project } from '../project/Project';
import { globalEditHistory } from './EditHistory';

export class UndoManager {
  private undoStack: string[] = []; // JSON strings of project backups
  private listeners: Set<() => void> = new Set();

  registerListener(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  pushState(project: Project) {
    this.undoStack.push(JSON.stringify(project));
    if (this.undoStack.length > 30) {
      this.undoStack.shift(); // Bound memory utilization
    }
    this.notify();
  }

  popState(): Project | null {
    if (this.undoStack.length === 0) return null;
    const projectStr = this.undoStack.pop();
    this.notify();
    return projectStr ? JSON.parse(projectStr) : null;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  getStackSize(): number {
    return this.undoStack.length;
  }

  clear() {
    this.undoStack = [];
    this.notify();
  }
}

export const globalUndoManager = new UndoManager();
export default globalUndoManager;
