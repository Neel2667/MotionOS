import { AssetType, LibraryAsset } from '../assets/AssetMetadata';
import { globalAssetRegistry } from '../assets/AssetRegistry';
import { globalAssetDatabase } from '../assets/AssetDatabase';
import { globalAssetCache } from '../assets/AssetCache';
import { globalImageImporter } from './ImageImporter';
import { globalSVGImporter } from './SVGImporter';
import { globalFontImporter } from './FontImporter';
import { globalVideoImporter } from './VideoImporter';
import { globalAudioImporter } from './AudioImporter';

export interface ImportTransaction {
  assetId: string;
  name: string;
  type: AssetType;
  sizeBytes: number;
  warnings: string[];
  suggestions: string[];
  durationSec?: number;
  isDuplicate: boolean;
}

export class AssetImporter {
  /**
   * Main pipeline entry point to import files (images, vectors, fonts, PDFs, motion templates).
   */
  public async importFile(file: File, folder: string = '/Root'): Promise<LibraryAsset> {
    const type = globalAssetRegistry.resolveFromFile(file.name, file.type);
    if (!type) {
      throw new Error(`Unsupported asset format file: ${file.name}`);
    }

    // 1. Generate local WebGL/DOM block URL
    const localBlobUrl = URL.createObjectURL(file);
    globalAssetCache.storeObjectUrl(file.name, localBlobUrl);

    // 2. Perform raw buffer store inside the offline cache
    const arrayBuffer = await file.arrayBuffer();
    
    // 3. Extract metadata according to specific formats
    let dimensions: { width: number; height: number } | undefined = undefined;
    let durationSec: number | undefined = undefined;
    let fontName: string | undefined = undefined;

    if (type === 'PNG' || type === 'JPEG' || type === 'WEBP' || type === 'GIF') {
      const imgRes = await globalImageImporter.importImage(file);
      dimensions = { width: imgRes.width, height: imgRes.height };
    } else if (type === 'SVG') {
      const text = await file.text();
      const svgRes = await globalSVGImporter.importSVG(text);
      dimensions = { width: 1000, height: 1000 }; // Standard vector canvas scale
    } else if (type === 'MP4' || type === 'WEBM') {
      const vidRes = await globalVideoImporter.importVideo(file.name, file.size);
      durationSec = vidRes.durationSec;
    } else if (type === 'TTF' || type === 'OTF') {
      const fontRes = await globalFontImporter.importFont(file.name, arrayBuffer);
      fontName = fontRes.fontFamily;
    }

    // 4. Inject into the master persistent Database
    const asset = await globalAssetDatabase.addAsset(
      file.name,
      type,
      file.size,
      localBlobUrl,
      folder
    );

    // Store raw in-memory buffer
    globalAssetCache.storeRaw(asset.id, arrayBuffer);

    return asset;
  }

  /**
   * Directly import mock text content as an SVG, useful for template loading.
   */
  public async importSVGString(name: string, svgContent: string, folder: string = '/Brand'): Promise<LibraryAsset> {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const file = new File([blob], name, { type: 'image/svg+xml' });
    return this.importFile(file, folder);
  }
}

export const globalAssetImporter = new AssetImporter();
export { globalAssetRegistry };
export type { LibraryAsset };
export type { AssetType };
export { globalAssetDatabase };
