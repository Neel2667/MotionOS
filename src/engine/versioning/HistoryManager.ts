import { Project } from '../project/Project';
import { globalProjectManager } from '../project/ProjectManager';

export interface HistoryItem {
  id: string;
  timestamp: number;
  description: string;
  projectSample: string; // JSON snapshot of Project
}

export class HistoryManager {
  private undoStack: HistoryItem[] = [];
  private redoStack: HistoryItem[] = [];
  private maxDepth = 50;

  public recordState(description: string, project: Project) {
    const item: HistoryItem = {
      id: `hist_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
      description,
      projectSample: JSON.stringify(project)
    };

    // Push state and enforce max capacity depth
    this.undoStack.push(item);
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    // Clear redo stack on manual timeline action
    this.redoStack = [];
  }

  public undo(currentProject: Project): Project | null {
    if (this.undoStack.length === 0) return null;

    // Save active state into Redo stack before rewinding
    const redoItem: HistoryItem = {
      id: `hist_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
      description: 'Pre-Undo state save',
      projectSample: JSON.stringify(currentProject)
    };
    this.redoStack.push(redoItem);

    const prev = this.undoStack.pop()!;
    try {
      const restored: Project = JSON.parse(prev.projectSample);
      return restored;
    } catch {
      return null;
    }
  }

  public redo(currentProject: Project): Project | null {
    if (this.redoStack.length === 0) return null;

    // Push active state back to Undo stack before stepping forward
    const undoItem: HistoryItem = {
      id: `hist_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
      description: 'Pre-Redo state save',
      projectSample: JSON.stringify(currentProject)
    };
    this.undoStack.push(undoItem);

    const next = this.redoStack.pop()!;
    try {
      const restored: Project = JSON.parse(next.projectSample);
      return restored;
    } catch {
      return null;
    }
  }

  public getUndoStack(): HistoryItem[] {
    return [...this.undoStack];
  }

  public getRedoStack(): HistoryItem[] {
    return [...this.redoStack];
  }

  public clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

export const globalHistoryManager = new HistoryManager();
