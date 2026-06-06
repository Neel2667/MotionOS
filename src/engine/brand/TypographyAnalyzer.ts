import { TextMetric } from './BrandProfile';

export class TypographyAnalyzer {
  /**
   * Evaluates typographic properties of an uploaded brand asset (e.g. font family from OTF/TTF metadata or logo text strings).
   */
  public analyze(sourceName: string, textSample?: string): TextMetric {
    const cleanName = sourceName.toLowerCase();
    
    // Luxury Font Characteristics
    if (cleanName.includes('serif') || cleanName.includes('didot') || cleanName.includes('garamond') || cleanName.includes('luxury') || cleanName.includes('mercedes')) {
      return {
        fontFamily: 'Playfair Display',
        weight: 'REGULAR',
        contrast: 'HIGH',
        suggestedPairings: ['Montserrat Light', 'Inter Thin'],
        vibe: 'Editorial Refined Elegance'
      };
    }

    // Technology Font Characteristics
    if (cleanName.includes('mono') || cleanName.includes('code') || cleanName.includes('tech') || cleanName.includes('futura') || cleanName.includes('cyber')) {
      return {
        fontFamily: 'Space Grotesk',
        weight: 'BOLD',
        contrast: 'HIGH',
        suggestedPairings: ['JetBrains Mono', 'Fira Code'],
        vibe: 'Modern High Frequency Technical'
      };
    }

    // Corporate / Neutral Font Characteristics
    if (cleanName.includes('helvetica') || cleanName.includes('inter') || cleanName.includes('corporate') || cleanName.includes('logo')) {
      return {
        fontFamily: 'Inter',
        weight: 'MEDIUM',
        contrast: 'MEDIUM',
        suggestedPairings: ['Inter Light', 'Space Mono'],
        vibe: 'Balanced Swiss System'
      };
    }

    // Default Fallback
    return {
      fontFamily: 'Outfit',
      weight: 'BOLD',
      contrast: 'HIGH',
      suggestedPairings: ['Inter Light', 'JetBrains Mono'],
      vibe: 'Contemporary Geometric Branding'
    };
  }
}
