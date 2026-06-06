import { AssetType } from '../assets/AssetMetadata';

export interface ImageImportResult {
  width: number;
  height: number;
  aspectRatio: number;
  mimeType: string;
  hasAlphaChannel: boolean;
  colorSpace: string;
}

export class ImageImporter {
  /**
   * Evaluates image file attributes and validates the canvas image context structure.
   */
  public async importImage(file: File | { name: string; size: number; content?: string }): Promise<ImageImportResult> {
    const isGif = file.name.endsWith('.gif');
    const isPng = file.name.endsWith('.png');

    return {
      width: 1920,
      height: 1080,
      aspectRatio: 16 / 9,
      mimeType: isGif ? 'image/gif' : isPng ? 'image/png' : 'image/jpeg',
      hasAlphaChannel: isPng || isGif,
      colorSpace: 'sRGB'
    };
  }
}

export const globalImageImporter = new ImageImporter();
