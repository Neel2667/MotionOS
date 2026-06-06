import { Project } from './Project';
import { ProjectSerializer } from './ProjectSerializer';

export class AutosaveManager {
  private intervalId: any = null;
  private serializer = new ProjectSerializer();
  private onAutosaveCallback: (() => void) | null = null;
  private isSavable = true;
  private lastSavedTime: number = Date.now();

  public start(
    getActiveProject: () => Project | null,
    onAutosave: (serialized: string) => void,
    intervalMs: number = 20000 // Autosave every 20 seconds
  ) {
    this.stop();
    this.onAutosaveCallback = () => {
      const proj = getActiveProject();
      if (proj && this.isSavable) {
        proj.metadata.lastModifiedAt = Date.now();
        const serialized = this.serializer.serialize(proj);
        onAutosave(serialized);
        this.lastSavedTime = Date.now();
        localStorage.setItem(`mOS_Autosave_${proj.metadata.id}`, serialized);
      }
    };

    this.intervalId = setInterval(this.onAutosaveCallback, intervalMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setSavable(savable: boolean) {
    this.isSavable = savable;
  }

  public forceTrigger() {
    if (this.onAutosaveCallback) {
      this.onAutosaveCallback();
    }
  }

  public getSecondsSinceLastSave(): number {
    return Math.floor((Date.now() - this.lastSavedTime) / 1000);
  }
}
