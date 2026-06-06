export type AssetType = 
  | 'PNG' 
  | 'JPEG' 
  | 'WEBP' 
  | 'GIF' 
  | 'SVG' 
  | 'PDF' 
  | 'MP4' 
  | 'WEBM' 
  | 'TTF' 
  | 'OTF' 
  | 'JSON_DNA' 
  | 'PROJECT_JSON';

export interface AssetMetadata {
  dimensions?: { width: number; height: number };
  durationSec?: number; // for videos / audios
  fileSizeEstimateBytes: number;
  hashSignature: string; // for duplicate detection
  mimeType: string;
  tags: string[];
  usageCount: number;
  isFavorite: boolean;
  uploadedAt: number;
  folderPath: string; // support foldering system
  fontFamily?: string; // for fonts
  checksum: string;
}

export interface LibraryAsset {
  id: string;
  name: string;
  type: AssetType;
  path: string; // storage blob url or path mockup
  thumbnailUrl: string;
  metadata: AssetMetadata;
}
