import { globalDatabase, DatabaseRecord } from './Database';
import { Project, createNewProject } from '../project/Project';
import { globalProjectManager } from '../project/ProjectManager';
import { BrandStyle } from '../ai/analyzer/BrandAnalyzer';

export interface IndexedProject {
  id: string;
  name: string;
  description: string;
  brandStyle: string;
  createdAt: number;
  lastModifiedAt: number;
  author: string;
  isArchived: boolean;
  version: string;
  sizeBytes: number;
  isFavorite: boolean;
  jsonData: string;
}

export class ProjectIndex {
  constructor() {
    this.refreshIndex();
  }

  // Auto-sync ProjectManager contents into database or vice-versa
  public refreshIndex(): void {
    const listInDb = globalDatabase.getTable<IndexedProject>('projects');
    
    // Check if empty, populate with Active Project or Recents info to seed
    if (listInDb.length === 0) {
      const active = globalProjectManager.getActiveProject();
      const recents = globalProjectManager.recents.getRecents();
      
      const seedItems = recents.length > 0 ? recents : [{
        id: active.metadata.id,
        name: active.metadata.name,
        description: active.metadata.description,
        brandStyle: active.sceneState.brandStyle,
      }];

      seedItems.forEach(item => {
        const p = createNewProject(item.name, (item.brandStyle || BrandStyle.LUXURY) as BrandStyle);
        p.metadata.id = item.id;
        
        globalDatabase.insert<IndexedProject>('projects', p.metadata.id, {
          id: p.metadata.id,
          name: p.metadata.name,
          description: p.metadata.description,
          brandStyle: p.sceneState.brandStyle,
          createdAt: p.metadata.createdAt,
          lastModifiedAt: p.metadata.lastModifiedAt,
          author: p.metadata.author,
          isArchived: false,
          version: p.metadata.version,
          sizeBytes: JSON.stringify(p).length,
          isFavorite: false,
          jsonData: JSON.stringify(p),
        });
      });
    }
  }

  public getAll(): IndexedProject[] {
    this.refreshIndex();
    return globalDatabase.getTable<IndexedProject>('projects').map(r => r.data);
  }

  public getById(id: string): IndexedProject | null {
    const records = globalDatabase.getTable<IndexedProject>('projects');
    const match = records.find(r => r.id === id);
    return match ? match.data : null;
  }

  public saveIndexedProject(p: Project): void {
    const records = globalDatabase.getTable<IndexedProject>('projects');
    const index = records.findIndex(r => r.id === p.metadata.id);
    
    const indexedData: IndexedProject = {
      id: p.metadata.id,
      name: p.metadata.name,
      description: p.metadata.description,
      brandStyle: p.sceneState.brandStyle,
      createdAt: p.metadata.createdAt,
      lastModifiedAt: Date.now(),
      author: p.metadata.author,
      isArchived: false,
      version: p.metadata.version,
      sizeBytes: JSON.stringify(p).length,
      isFavorite: this.getById(p.metadata.id)?.isFavorite || false,
      jsonData: JSON.stringify(p),
    };

    if (index !== -1) {
      records[index].data = indexedData;
      records[index].updatedAt = Date.now();
      globalDatabase.saveTable('projects', records);
    } else {
      globalDatabase.insert<IndexedProject>('projects', p.metadata.id, indexedData);
    }
  }

  public duplicateProject(id: string): IndexedProject | null {
    const source = this.getById(id);
    if (!source) return null;

    try {
      const originalProject: Project = JSON.parse(source.jsonData);
      const newId = `proj_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      const duplicatedProject: Project = {
        ...originalProject,
        metadata: {
          ...originalProject.metadata,
          id: newId,
          name: `${originalProject.metadata.name} (Copy)`,
          createdAt: Date.now(),
          lastModifiedAt: Date.now(),
        }
      };

      const indexedData: IndexedProject = {
        id: newId,
        name: duplicatedProject.metadata.name,
        description: duplicatedProject.metadata.description,
        brandStyle: duplicatedProject.sceneState.brandStyle,
        createdAt: duplicatedProject.metadata.createdAt,
        lastModifiedAt: duplicatedProject.metadata.lastModifiedAt,
        author: duplicatedProject.metadata.author,
        isArchived: false,
        version: duplicatedProject.metadata.version,
        sizeBytes: JSON.stringify(duplicatedProject).length,
        isFavorite: false,
        jsonData: JSON.stringify(duplicatedProject),
      };

      globalDatabase.insert<IndexedProject>('projects', newId, indexedData);
      
      // Save duplicate to ProjectManager localStorage backing so ProjectLoader can find it
      localStorage.setItem(`mOS_Project_${newId}`, JSON.stringify(duplicatedProject));
      globalProjectManager.recents.addRecording(
        newId,
        duplicatedProject.metadata.name,
        duplicatedProject.metadata.description,
        duplicatedProject.sceneState.brandStyle as BrandStyle
      );

      return indexedData;
    } catch {
      return null;
    }
  }

  public toggleArchive(id: string): void {
    const item = this.getById(id);
    if (item) {
      globalDatabase.update<IndexedProject>('projects', id, { isArchived: !item.isArchived });
    }
  }

  public toggleFavorite(id: string): void {
    const item = this.getById(id);
    if (item) {
      globalDatabase.update<IndexedProject>('projects', id, { isFavorite: !item.isFavorite });
    }
  }
}

export const globalProjectIndex = new ProjectIndex();
