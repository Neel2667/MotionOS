import { ShapeMetric } from './BrandProfile';

export class ShapeAnalyzer {
  /**
   * Analyzes geometric profile properties of an uploaded asset file.
   */
  public analyze(fileName: string, fileSize?: number): ShapeMetric {
    const clean = fileName.toLowerCase();
    
    // Angular / Tech geometry
    if (clean.includes('tech') || clean.includes('cyber') || clean.includes('grid') || clean.includes('angular') || clean.includes('shatters')) {
      return {
        symmetry: 0.95,
        balance: 0.98,
        complexity: 0.85,
        geometryType: 'ANGULAR'
      };
    }

    // Curved / Organic design language
    if (clean.includes('organic') || clean.includes('soft') || clean.includes('circle') || clean.includes('nike') || clean.includes('fluid')) {
      return {
        symmetry: 0.65,
        balance: 0.82,
        complexity: 0.45,
        geometryType: 'CURVED'
      };
    }

    // Default Balanced combination
    return {
      symmetry: 0.80,
      balance: 0.85,
      complexity: 0.60,
      geometryType: 'MIXED'
    };
  }
}
