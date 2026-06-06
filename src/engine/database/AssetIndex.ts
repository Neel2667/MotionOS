import { globalAssetDatabase } from '../assets/AssetDatabase';
import { LibraryAsset } from '../assets/AssetMetadata';

export interface IndexedAsset {
  id: string;
  name: string;
  type: string;
  folder: string;
  tags: string[];
  sizeBytes: number;
  usageCount: number;
  isFavorite: boolean;
  uploadedAt: number;
}

export class AssetIndex {
  public getIndexedAssets(): IndexedAsset[] {
    const assets = globalAssetDatabase.getAllAssets();
    return assets.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      folder: a.metadata.folderPath || '/Root',
      tags: a.metadata.tags || [],
      sizeBytes: a.metadata.fileSizeEstimateBytes || 0,
      usageCount: a.metadata.usageCount || 0,
      isFavorite: a.metadata.isFavorite || false,
      uploadedAt: a.metadata.uploadedAt || Date.now()
    }));
  }

  public getByFolder(folder: string): IndexedAsset[] {
    return this.getIndexedAssets().filter(a => a.folder === folder);
  }

  public getByTag(tag: string): IndexedAsset[] {
    const term = tag.toLowerCase();
    return this.getIndexedAssets().filter(a => a.tags.some(t => t.toLowerCase().includes(term)));
  }

  public getByType(type: string): IndexedAsset[] {
    return this.getIndexedAssets().filter(a => a.type.toLowerCase() === type.toLowerCase());
  }

  public getFavorites(): IndexedAsset[] {
    return this.getIndexedAssets().filter(a => a.isFavorite);
  }
}

export const globalAssetIndex = new AssetIndex();
