import { LibraryAsset, AssetType } from './AssetMetadata';
import { globalAssetRegistry } from './AssetRegistry';
import { globalThumbnailGenerator } from './ThumbnailGenerator';

export type SortField = 'NAME' | 'SIZE' | 'TYPE' | 'DATE' | 'USAGE';
export type SortOrder = 'ASC' | 'DESC';

type DatabaseListener = (assets: LibraryAsset[]) => void;

export class AssetDatabase {
  private assets: LibraryAsset[] = [];
  private listeners: Set<DatabaseListener> = new Set();
  private storageKey = 'motion_os_asset_db_v1';

  constructor() {
    this.loadFromStorage();
  }

  private async loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const serialized = localStorage.getItem(this.storageKey);
      if (serialized) {
        this.assets = JSON.parse(serialized);
        this.notify();
      } else {
        await this.seedDefaultLibrary();
      }
    } catch (e) {
      console.error('Failed to load asset database, seeding...', e);
      await this.seedDefaultLibrary();
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.assets));
    } catch (e) {
      console.warn('Storage limits warning, failed to save asset state.', e);
    }
  }

  private async seedDefaultLibrary() {
    this.assets = [];
    
    // Seed high-quality luxury, tech, sports, gaming, minimal assets as base demonstration
    const seedMeta = [
      {
        name: 'Mercedes AMG Silverstar',
        type: 'SVG' as AssetType,
        folder: '/Brand/Luxury',
        size: 14500,
        tags: ['logo', 'luxury', 'premium', 'vector'],
        thumbColor: '#ffd700'
      },
      {
        name: 'Cyber Network Core Reactor',
        type: 'PNG' as AssetType,
        folder: '/Brand/Technology',
        size: 2450000,
        tags: ['neon', 'glowing', 'technology', 'core'],
        thumbColor: '#00ffff'
      },
      {
        name: 'Nike Flyknit Momentum Vortex',
        type: 'WEBP' as AssetType,
        folder: '/Brand/Sports',
        size: 890000,
        tags: ['dynamic', 'vortex', 'sports', 'active'],
        thumbColor: '#ff0055'
      },
      {
        name: 'Vortex RGB Chroma Strobe',
        type: 'GIF' as AssetType,
        folder: '/Brand/Gaming',
        size: 1540000,
        tags: ['vibrant', 'game', 'rgb', 'strobe'],
        thumbColor: '#ff003c'
      },
      {
        name: 'Sapient Clinical Medical Shield',
        type: 'PDF' as AssetType,
        folder: '/Brand/Medical',
        size: 450000,
        tags: ['clean', 'health', 'vector', 'logo'],
        thumbColor: '#0088ff'
      },
      {
        name: 'Space Grotesk Variable Specimen',
        type: 'TTF' as AssetType,
        folder: '/Fonts',
        size: 180000,
        tags: ['font', 'display', 'typography', 'sans-serif'],
        thumbColor: '#d946ef'
      },
      {
        name: 'Aeon Corporate Modernist Hex',
        type: 'SVG' as AssetType,
        folder: '/Brand/Corporate',
        size: 8500,
        tags: ['clean', 'corporate', 'geometric'],
        thumbColor: '#3b82f6'
      }
    ];

    for (const item of seedMeta) {
      // Create hash to avoid duplicate detection clashes
      const mockHash = 'seed_hash_' + item.name.replace(/\s+/g, '_').toLowerCase();
      
      // Asynchronously generate thumbnail to make it extremely beautiful!
      const thumb = await globalThumbnailGenerator.generate(item.name, item.type);

      const asset: LibraryAsset = {
        id: `asset_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        name: item.name,
        type: item.type,
        path: `./assets/seeds/${item.name.replace(/\s+/g, '_').toLowerCase()}.${item.type.toLowerCase()}`,
        thumbnailUrl: thumb,
        metadata: {
          fileSizeEstimateBytes: item.size,
          hashSignature: mockHash,
          mimeType: `application/${item.type.toLowerCase()}`,
          tags: item.tags,
          usageCount: item.type === 'SVG' && item.name.includes('Mercedes') ? 2 : 0, // Mark Mercedes as used
          isFavorite: item.name.includes('Mercedes') || item.name.includes('Cyber'),
          uploadedAt: Date.now() - (Math.random() * 10 * 24 * 60 * 60 * 1000), // staged raw upload historic milestones
          folderPath: item.folder,
          fontFamily: item.type === 'TTF' ? 'Space Grotesk' : undefined,
          checksum: mockHash
        }
      };

      this.assets.push(asset);
    }

    this.saveToStorage();
    this.notify();
  }

  // Listener management
  public registerListener(listener: DatabaseListener): () => void {
    this.listeners.add(listener);
    // Instant initial feed
    listener([...this.assets]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const freshList = [...this.assets];
    this.listeners.forEach(cb => cb(freshList));
  }

  // Database operations
  public getAllAssets(): LibraryAsset[] {
    return [...this.assets];
  }

  public async addAsset(name: string, type: AssetType, initialBytes: number, rawDataBlobUrl: string, folder: string = '/Root'): Promise<LibraryAsset> {
    const filenameNoExt = name.split('.').slice(0, -1).join('.') || name;
    const mockHash = 'blob_hash_' + Date.now().toString(36) + '_' + Math.floor(Math.random() * 1000);
    
    // Check for Duplicate detection
    const duplicate = this.assets.find(a => a.metadata.checksum === mockHash || (a.name === filenameNoExt && a.type === type));
    if (duplicate) {
      // Double usage to demonstrate duplicate recognition in logs
      duplicate.metadata.usageCount += 1;
      this.saveToStorage();
      this.notify();
      return duplicate;
    }

    const thumb = await globalThumbnailGenerator.generate(name, type, rawDataBlobUrl);

    const newAsset: LibraryAsset = {
      id: `asset_upload_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      name: filenameNoExt,
      type,
      path: rawDataBlobUrl,
      thumbnailUrl: thumb,
      metadata: {
        dimensions: type === 'PNG' || type === 'JPEG' || type === 'WEBP' ? { width: 1920, height: 1080 } : undefined,
        fileSizeEstimateBytes: initialBytes,
        hashSignature: mockHash,
        mimeType: `application/${type.toLowerCase()}`,
        tags: [type.toLowerCase(), 'upload'],
        usageCount: 0,
        isFavorite: false,
        uploadedAt: Date.now(),
        folderPath: folder,
        fontFamily: type === 'TTF' || type === 'OTF' ? filenameNoExt : undefined,
        checksum: mockHash
      }
    };

    this.assets.push(newAsset);
    this.saveToStorage();
    this.notify();
    return newAsset;
  }

  public removeAsset(id: string) {
    this.assets = this.assets.filter(a => a.id !== id);
    this.saveToStorage();
    this.notify();
  }

  public toggleFavorite(id: string) {
    const asset = this.assets.find(a => a.id === id);
    if (asset) {
      asset.metadata.isFavorite = !asset.metadata.isFavorite;
      this.saveToStorage();
      this.notify();
    }
  }

  public incrementUsage(id: string) {
    const asset = this.assets.find(a => a.id === id);
    if (asset) {
      asset.metadata.usageCount += 1;
      this.saveToStorage();
      this.notify();
    }
  }

  public addTagToAsset(id: string, tag: string) {
    const asset = this.assets.find(a => a.id === id);
    if (asset && tag && !asset.metadata.tags.includes(tag.toLowerCase())) {
      asset.metadata.tags.push(tag.toLowerCase().trim());
      this.saveToStorage();
      this.notify();
    }
  }

  public removeTagFromAsset(id: string, tag: string) {
    const asset = this.assets.find(a => a.id === id);
    if (asset) {
      asset.metadata.tags = asset.metadata.tags.filter(t => t !== tag.toLowerCase());
      this.saveToStorage();
      this.notify();
    }
  }

  public moveAssetFolder(id: string, newFolder: string) {
    const asset = this.assets.find(a => a.id === id);
    if (asset) {
      asset.metadata.folderPath = newFolder;
      this.saveToStorage();
      this.notify();
    }
  }

  // Query engine helpers (Search, filters and sorting calculations)
  public query(params: {
    search?: string;
    typeFilter?: string; // 'ALL', 'IMAGES', 'VECTORS', 'VIDEOS', 'FONTS'
    folderFilter?: string; // e.g. '/Root'
    onlyFavorites?: boolean;
    sortField?: SortField;
    sortOrder?: SortOrder;
  }): LibraryAsset[] {
    let filtered = [...this.assets];

    // 1. Search
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.metadata.tags.some(t => t.includes(q)) || 
        a.type.toLowerCase().includes(q)
      );
    }

    // 2. Type Category Heuristics
    if (params.typeFilter && params.typeFilter !== 'ALL') {
      filtered = filtered.filter(a => {
        const cat = globalAssetRegistry.getCategory(a.type);
        if (params.typeFilter === 'IMAGES') return cat === 'RASTER';
        if (params.typeFilter === 'VECTORS') return cat === 'VECTOR';
        if (params.typeFilter === 'VIDEOS') return cat === 'VIDEO';
        if (params.typeFilter === 'FONTS') return cat === 'FONT';
        return true;
      });
    }

    // 3. Folder Filter
    if (params.folderFilter && params.folderFilter !== 'ALL') {
      filtered = filtered.filter(a => a.metadata.folderPath === params.folderFilter || a.metadata.folderPath.startsWith(params.folderFilter + '/'));
    }

    // 4. Favorites Only
    if (params.onlyFavorites) {
      filtered = filtered.filter(a => a.metadata.isFavorite);
    }

    // 5. Sorting algorithms
    const field = params.sortField || 'DATE';
    const order = params.sortOrder || 'DESC';

    filtered.sort((x, y) => {
      let comparison = 0;
      switch (field) {
        case 'NAME':
          comparison = x.name.localeCompare(y.name);
          break;
        case 'SIZE':
          comparison = x.metadata.fileSizeEstimateBytes - y.metadata.fileSizeEstimateBytes;
          break;
        case 'TYPE':
          comparison = x.type.localeCompare(y.type);
          break;
        case 'USAGE':
          comparison = x.metadata.usageCount - y.metadata.usageCount;
          break;
        case 'DATE':
        default:
          comparison = x.metadata.uploadedAt - y.metadata.uploadedAt;
          break;
      }
      return order === 'ASC' ? comparison : -comparison;
    });

    return filtered;
  }

  // Folder scanning directories helper
  public getUniqueFolders(): string[] {
    const folders = new Set<string>();
    folders.add('/Root');
    this.assets.forEach(a => {
      if (a.metadata.folderPath) {
        folders.add(a.metadata.folderPath);
      }
    });
    return Array.from(folders).sort();
  }
}

export const globalAssetDatabase = new AssetDatabase();
export { globalAssetRegistry };
