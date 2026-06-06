import { Project, createNewProject } from './Project';
import { ProjectSerializer } from './ProjectSerializer';
import { ProjectLoader } from './ProjectLoader';
import { RecentProjects } from './RecentProjects';
import { AutosaveManager } from './AutosaveManager';
import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';

export class ProjectManager {
  private activeProject: Project | null = null;
  private serializer = new ProjectSerializer();
  private loader = new ProjectLoader();
  public recents = new RecentProjects();
  public autosave = new AutosaveManager();

  private changeListeners: Array<(project: Project | null) => void> = [];

  constructor() {
    // Automatically load template or first project on startup
    const recentsList = this.recents.getRecents();
    if (recentsList.length > 0) {
      // Create a default project representing first recent
      const first = recentsList[0];
      const style = (first.brandStyle as BrandStyle) || BrandStyle.LUXURY;
      this.activeProject = createNewProject(first.name, style);
      this.activeProject.metadata.id = first.id;
    } else {
      this.activeProject = createNewProject('Untitled Motion Deck', BrandStyle.LUXURY);
    }

    // Bind autosave
    this.autosave.start(
      () => this.activeProject,
      (serialized) => {
        if (this.activeProject) {
          this.recents.addRecording(
            this.activeProject.metadata.id,
            this.activeProject.metadata.name,
            this.activeProject.metadata.description,
            this.activeProject.sceneState.brandStyle
          );
        }
      }
    );
  }

  public getActiveProject(): Project {
    if (!this.activeProject) {
      this.activeProject = createNewProject('Untitled Project', BrandStyle.LUXURY);
    }
    return this.activeProject;
  }

  public registerListener(listener: (proj: Project | null) => void) {
    this.changeListeners.push(listener);
    listener(this.activeProject);
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.changeListeners.forEach(listener => listener(this.activeProject));
  }

  public createNew(name: string, style: BrandStyle): Project {
    const proj = createNewProject(name, style);
    this.activeProject = proj;
    this.recents.addRecording(proj.metadata.id, proj.metadata.name, proj.metadata.description, style);
    this.notify();
    return proj;
  }

  public saveActive(): string {
    if (!this.activeProject) throw new Error('No active project running.');
    this.activeProject.metadata.lastModifiedAt = Date.now();
    const serialized = this.serializer.serialize(this.activeProject);
    localStorage.setItem(`mOS_Project_${this.activeProject.metadata.id}`, serialized);
    this.recents.addRecording(
      this.activeProject.metadata.id,
      this.activeProject.metadata.name,
      this.activeProject.metadata.description,
      this.activeProject.sceneState.brandStyle
    );
    this.notify();
    return serialized;
  }

  public loadProjectById(id: string): Project {
    const saved = localStorage.getItem(`mOS_Project_${id}`);
    if (saved) {
      const { project, report } = this.loader.deserializeAndValidate(saved);
      if (project && report.isValid) {
        this.activeProject = project;
        this.recents.addRecording(project.metadata.id, project.metadata.name, project.metadata.description, project.sceneState.brandStyle);
        this.notify();
        return project;
      }
    }

    // Fallback if local storage key is empty: Build fake database mockup files dynamically
    const recentsList = this.recents.getRecents();
    const match = recentsList.find(p => p.id === id);
    const mockName = match ? match.name : 'Concept Clip';
    const mockStyle = match ? (match.brandStyle as BrandStyle) : BrandStyle.LUXURY;

    const proj = createNewProject(mockName, mockStyle);
    proj.metadata.id = id;
    this.activeProject = proj;
    this.recents.addRecording(id, mockName, proj.metadata.description, mockStyle);
    this.notify();
    return proj;
  }

  public importProjectJSON(jsonString: string): { success: boolean; error?: string } {
    const { project, report } = this.loader.deserializeAndValidate(jsonString);
    if (project && report.isValid) {
      this.activeProject = project;
      this.recents.addRecording(project.metadata.id, project.metadata.name, project.metadata.description, project.sceneState.brandStyle);
      this.notify();
      return { success: true };
    }
    return { success: false, error: report.errors.join(' | ') };
  }

  public exportProjectJSON(): string {
    return this.serializer.serialize(this.getActiveProject());
  }

  public exportMotionDNA(): string {
    const proj = this.getActiveProject();
    return this.serializer.serializeMotionDNA(
      proj.metadata.name,
      proj.sceneState.brandStyle,
      proj.sceneState.activeFX,
      proj.sceneState.activeMaterials
    );
  }

  public importMotionDNA(dnaJson: string): boolean {
    try {
      const parsed = JSON.parse(dnaJson);
      if (parsed.pipeline) {
        const proj = this.getActiveProject();
        proj.sceneState.brandStyle = parsed.brandStyle || proj.sceneState.brandStyle;
        proj.sceneState.activeFX = parsed.pipeline.activeFX || proj.sceneState.activeFX;
        proj.sceneState.activeMaterials = parsed.pipeline.activeMaterials || proj.sceneState.activeMaterials;
        this.notify();
        return true;
      }
    } catch (e) {
      console.warn('Import DNA parsed failure:', e);
    }
    return false;
  }
}

// App wide single project manager instances
export const globalProjectManager = new ProjectManager();
export { createNewProject };
