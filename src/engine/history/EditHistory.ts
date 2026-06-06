import { Project } from '../project/Project';

export interface HistoryChange {
  id: string;
  timestamp: number;
  description: string;
  projectStateBackup: string; // Serialized string of Project
  category: 'CREATION' | 'MANUAL_EDIT' | 'SMART_STUDIO' | 'TEMPLATE_APPLY' | 'RESET';
}

export class EditHistory {
  private changes: HistoryChange[] = [];
  private listeners: Set<(changes: HistoryChange[]) => void> = new Set();

  registerListener(cb: (changes: HistoryChange[]) => void): () => void {
    this.listeners.add(cb);
    cb([...this.changes]);
    return () => {
      this.listeners.delete(cb);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb([...this.changes]));
  }

  getChanges(): HistoryChange[] {
    return [...this.changes];
  }

  addChange(description: string, project: Project, category: HistoryChange['category'] = 'MANUAL_EDIT'): HistoryChange {
    const backup = JSON.stringify(project);
    const item: HistoryChange = {
      id: `hist_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
      description,
      projectStateBackup: backup,
      category
    };

    this.changes.unshift(item);
    if (this.changes.length > 50) {
      this.changes.pop(); // Keep limit to prevent memory bloating
    }
    this.notify();
    return item;
  }

  clear() {
    this.changes = [];
    this.notify();
  }

  removeChange(id: string) {
    this.changes = this.changes.filter(c => c.id !== id);
    this.notify();
  }
}

export const globalEditHistory = new EditHistory();
export default globalEditHistory;
