import { AssetType } from './AssetMetadata';

export interface RegistryEntry {
  type: AssetType;
  extensions: string[];
  mimes: string[];
  category: 'VECTOR' | 'RASTER' | 'VIDEO' | 'FONT' | 'DATA';
}

export class AssetRegistry {
  private entries: Record<AssetType, RegistryEntry> = {
    PNG: {
      type: 'PNG',
      extensions: ['.png'],
      mimes: ['image/png'],
      category: 'RASTER'
    },
    JPEG: {
      type: 'JPEG',
      extensions: ['.jpg', '.jpeg'],
      mimes: ['image/jpeg'],
      category: 'RASTER'
    },
    WEBP: {
      type: 'WEBP',
      extensions: ['.webp'],
      mimes: ['image/webp'],
      category: 'RASTER'
    },
    GIF: {
      type: 'GIF',
      extensions: ['.gif'],
      mimes: ['image/gif'],
      category: 'RASTER'
    },
    SVG: {
      type: 'SVG',
      extensions: ['.svg'],
      mimes: ['image/svg+xml'],
      category: 'VECTOR'
    },
    PDF: {
      type: 'PDF',
      extensions: ['.pdf'],
      mimes: ['application/pdf'],
      category: 'VECTOR'
    },
    MP4: {
      type: 'MP4',
      extensions: ['.mp4'],
      mimes: ['video/mp4'],
      category: 'VIDEO'
    },
    WEBM: {
      type: 'WEBM',
      extensions: ['.webm'],
      mimes: ['video/webm'],
      category: 'VIDEO'
    },
    TTF: {
      type: 'TTF',
      extensions: ['.ttf'],
      mimes: ['font/ttf', 'application/x-font-ttf'],
      category: 'FONT'
    },
    OTF: {
      type: 'OTF',
      extensions: ['.otf'],
      mimes: ['font/otf', 'application/x-font-opentype'],
      category: 'FONT'
    },
    JSON_DNA: {
      type: 'JSON_DNA',
      extensions: ['.dna.json'],
      mimes: ['application/json'],
      category: 'DATA'
    },
    PROJECT_JSON: {
      type: 'PROJECT_JSON',
      extensions: ['.motion.json', '.json'],
      mimes: ['application/json'],
      category: 'DATA'
    }
  };

  public resolveFromFile(fileName: string, mime?: string): AssetType | null {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    
    // 1. Check exact extension matching
    for (const type in this.entries) {
      const entry = this.entries[type as AssetType];
      if (entry.extensions.includes(extension)) {
        return entry.type;
      }
    }

    // 2. Check mime-type matching
    if (mime) {
      for (const type in this.entries) {
        const entry = this.entries[type as AssetType];
        if (entry.mimes.includes(mime)) {
          return entry.type;
        }
      }
    }

    return null;
  }

  public getCategory(type: AssetType): string {
    return this.entries[type]?.category || 'DATA';
  }

  public getExtensions(type: AssetType): string[] {
    return this.entries[type]?.extensions || [];
  }
}

export const globalAssetRegistry = new AssetRegistry();
