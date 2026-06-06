import { globalProjectIndex, IndexedProject } from './ProjectIndex';
import { globalAssetIndex, IndexedAsset } from './AssetIndex';
import { globalMotionDNAStore } from './MotionDNAStore';
import { MotionDNA } from './Database';

export interface UnifiedSearchResult {
  projects: IndexedProject[];
  assets: IndexedAsset[];
  motionDNAs: MotionDNA[];
  queryTimeMs: number;
  totalCount: number;
}

export class SearchEngine {
  private cache: Map<string, UnifiedSearchResult> = new Map();

  public search(params: {
    query?: string;
    brandStyle?: string;
    tag?: string;
    onlyFavorites?: boolean;
    recentlyModifiedOnly?: boolean;
    type?: string; // 'ALL' | 'PROJECT' | 'ASSET' | 'DNA'
  }): UnifiedSearchResult {
    const startTime = performance.now();
    
    // Check Cache
    const cacheKey = JSON.stringify(params);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let projects = globalProjectIndex.getAll();
    let assets = globalAssetIndex.getIndexedAssets();
    let motionDNAs = globalMotionDNAStore.getAll();

    const q = params.query ? params.query.toLowerCase().trim() : '';
    const styleFilter = params.brandStyle ? params.brandStyle.toLowerCase().trim() : '';
    const tagFilter = params.tag ? params.tag.toLowerCase().trim() : '';

    // 1. Filter Projects
    if (params.type === 'ALL' || params.type === 'PROJECT' || !params.type) {
      if (q) {
        projects = projects.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.brandStyle.toLowerCase().includes(q)
        );
      }
      if (styleFilter) {
        projects = projects.filter(p => p.brandStyle.toLowerCase() === styleFilter);
      }
      if (params.onlyFavorites) {
        projects = projects.filter(p => p.isFavorite);
      }
      if (params.recentlyModifiedOnly) {
        // modified in last 7 days
        const limit = Date.now() - 7 * 24 * 60 * 60 * 1000;
        projects = projects.filter(p => p.lastModifiedAt >= limit);
      }
    } else {
      projects = [];
    }

    // 2. Filter Assets
    if (params.type === 'ALL' || params.type === 'ASSET' || !params.type) {
      if (q) {
        assets = assets.filter(a => 
          a.name.toLowerCase().includes(q) || 
          a.type.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      if (tagFilter) {
        assets = assets.filter(a => a.tags.some(t => t.toLowerCase() === tagFilter));
      }
      if (params.onlyFavorites) {
        assets = assets.filter(a => a.isFavorite);
      }
      if (params.recentlyModifiedOnly) {
        const limit = Date.now() - 7 * 24 * 60 * 60 * 1000;
        assets = assets.filter(a => a.uploadedAt >= limit);
      }
    } else {
      assets = [];
    }

    // 3. Filter MotionDNAs
    if (params.type === 'ALL' || params.type === 'DNA' || !params.type) {
      if (q) {
        motionDNAs = motionDNAs.filter(dna => 
          dna.name.toLowerCase().includes(q) || 
          dna.styleArchetype.toLowerCase().includes(q)
        );
      }
      if (styleFilter) {
        motionDNAs = motionDNAs.filter(dna => dna.styleArchetype.toLowerCase() === styleFilter);
      }
    } else {
      motionDNAs = [];
    }

    const queryTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    const totalCount = projects.length + assets.length + motionDNAs.length;

    const result: UnifiedSearchResult = {
      projects,
      assets,
      motionDNAs,
      queryTimeMs,
      totalCount,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  public clearCache() {
    this.cache.clear();
  }
}

export const globalSearchEngine = new SearchEngine();
