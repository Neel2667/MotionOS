import { AssetType, AssetMetadata } from './AssetMetadata';

export interface OptimizationResult {
  optimizedSizeEstimatedBytes: number;
  reductionPercentage: number;
  warnings: string[];
  suggestions: string[];
  hasSubstantialOptimizationPossible: boolean;
}

export class AssetOptimizer {
  /**
   * Evaluates if an asset has duplicate parameters or requires compression constraints.
   */
  public evaluate(name: string, type: AssetType, dimensions?: { width: number; height: number }, initialBytes: number = 500000): OptimizationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let targetSize = initialBytes;
    
    // Evaluate based on asset standard profiles
    if (type === 'PNG' || type === 'JPEG') {
      if (initialBytes > 2 * 1024 * 1024) {
        warnings.push('Asset file size exceeds standard web assets constraints (> 2MB)');
        suggestions.push('Compress image to 80% lossier WebP stream');
        targetSize = Math.floor(initialBytes * 0.15); // WebP gives massive reductions
      } else if (initialBytes > 500 * 1024) {
        suggestions.push('Optimizable using lossless quantization passing techniques');
        targetSize = Math.floor(initialBytes * 0.45);
      } else {
        targetSize = Math.floor(initialBytes * 0.7);
      }

      if (dimensions && (dimensions.width > 3840 || dimensions.height > 2160)) {
        warnings.push('Fidelity resolution is ultra-high (4K+), which may cause minor layout frame drops during real-time compilation');
        suggestions.push('Scale bounds to maximum 2K Cine dimension limits (2048 x 1080)');
      }
    }

    if (type === 'SVG') {
      if (initialBytes > 120 * 1024) {
        warnings.push('Complex path nodes detected. High layer nested tree nodes in vector file');
        suggestions.push('Simplify coordinates to 2 decimals using standard SVG Clean optimizer channels');
        targetSize = Math.floor(initialBytes * 0.4);
      } else {
        targetSize = Math.floor(initialBytes * 0.95);
      }
    }

    if (type === 'PDF') {
      warnings.push('PDF carries redundant container headers');
      suggestions.push('Extract path primitives and convert directly to clean, editable SVGs');
      targetSize = Math.floor(initialBytes * 0.35);
    }

    if (type === 'MP4' || type === 'WEBM') {
      if (initialBytes > 10 * 1024 * 1024) {
        warnings.push('Video assets exceeds 10MB limit (performance bottleneck during background render tasks)');
        suggestions.push('Transcode to highly compressed WEBM VP9 codecs');
        targetSize = Math.floor(initialBytes * 0.5);
      }
    }

    const reductionBytes = initialBytes - targetSize;
    const reductionPercentage = initialBytes > 0 ? Math.floor((reductionBytes / initialBytes) * 100) : 0;

    return {
      optimizedSizeEstimatedBytes: targetSize,
      reductionPercentage,
      warnings,
      suggestions,
      hasSubstantialOptimizationPossible: reductionPercentage > 15
    };
  }
}

export const globalAssetOptimizer = new AssetOptimizer();
