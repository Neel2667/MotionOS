import { LibraryAsset } from './AssetMetadata';

export class AssetCache {
  private rawCache: Map<string, ArrayBuffer> = new Map();
  private objectUrlCache: Map<string, string> = new Map();
  private textureHandleCache: Map<string, any> = new Map(); // simulation of WebGL loading handles

  public storeRaw(id: string, buffer: ArrayBuffer) {
    this.rawCache.set(id, buffer);
  }

  public getRaw(id: string): ArrayBuffer | undefined {
    return this.rawCache.get(id);
  }

  public storeObjectUrl(id: string, url: string) {
    this.objectUrlCache.set(id, url);
  }

  public getObjectUrl(id: string): string | undefined {
    return this.objectUrlCache.get(id);
  }

  public storeTexture(id: string, texture: any) {
    this.textureHandleCache.set(id, texture);
  }

  public getTexture(id: string): any {
    return this.textureHandleCache.get(id);
  }

  public clear() {
    this.rawCache.clear();
    // Revoke any custom URLs to prevent memory leaks
    if (typeof window !== 'undefined') {
      this.objectUrlCache.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    }
    this.objectUrlCache.clear();
    this.textureHandleCache.clear();
  }
}

export const globalAssetCache = new AssetCache();
