export interface RecentProjectRecord {
  id: string;
  name: string;
  description: string;
  brandStyle: string;
  lastModifiedAt: number;
}

export class RecentProjects {
  private STORAGE_KEY = 'mOS_Recent_Projects_List';

  public getRecents(): RecentProjectRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read recent projects list:', e);
    }

    // Default template items on fresh startup to demonstrate opening a project
    const defaults: RecentProjectRecord[] = [
      {
        id: 'proj_LUX_01',
        name: 'Mercedes Concept Reveal',
        description: 'Elite cinematic gold motion transitions with particle assemblies.',
        brandStyle: 'LUXURY',
        lastModifiedAt: Date.now() - 3600000 * 2 // 2 hours ago
      },
      {
        id: 'proj_TEC_02',
        name: 'Cyberpunk CyberDeck HUD',
        description: 'High frequency neon grids and cybernetic geometric rotations.',
        brandStyle: 'TECH',
        lastModifiedAt: Date.now() - 3600000 * 18 // 18 hours ago
      },
      {
        id: 'proj_CHRM_03',
        name: 'Nike Liquid Chrome Stream',
        description: 'Metallic chrome fluids with high gloss reflection profiles.',
        brandStyle: 'BOLD',
        lastModifiedAt: Date.now() - 3600000 * 48 // 2 days ago
      }
    ];
    this.saveRecents(defaults);
    return defaults;
  }

  public saveRecents(list: RecentProjectRecord[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list.slice(0, 10)));
    } catch (e) {
      console.warn('Could not save recent projects list:', e);
    }
  }

  public addRecording(id: string, name: string, description: string, brandStyle: string) {
    const list = this.getRecents();
    const filtered = list.filter(p => p.id !== id);
    const updated = [
      { id, name, description, brandStyle, lastModifiedAt: Date.now() },
      ...filtered
    ];
    this.saveRecents(updated);
  }

  public removeRecording(id: string) {
    const list = this.getRecents();
    const updated = list.filter(p => p.id !== id);
    this.saveRecents(updated);
  }
}
