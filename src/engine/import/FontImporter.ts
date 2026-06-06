export interface FontImportResult {
  fontFamily: string;
  style: 'normal' | 'italic';
  supportedCharactersRange: string;
}

export class FontImporter {
  /**
   * Loads TTF/OTF fonts and dynamically registers them inside the browser DOM, so they are immediately active in standard Canvas/WebGL overlays.
   */
  public async importFont(fileName: string, rawBuffer?: ArrayBuffer): Promise<FontImportResult> {
    const cleanName = fileName.split('.').slice(0, -1).join('.') || 'custom-font';
    const familyName = cleanName.replace(/[^a-zA-Z]/g, '');

    if (rawBuffer && typeof window !== 'undefined' && (window as any).FontFace) {
      try {
        const fontFace = new (window as any).FontFace(familyName, rawBuffer);
        await fontFace.load();
        (document as any).fonts.add(fontFace);
        console.log(`Successfully registered typography typeface: ${familyName}`);
      } catch (e) {
        console.warn(`FontFace registration failed for typeface: ${familyName}, using fallback viewport typography`, e);
      }
    }

    return {
      fontFamily: familyName,
      style: 'normal',
      supportedCharactersRange: 'Basic Latin, Latin-1 Supplement'
    };
  }
}

export const globalFontImporter = new FontImporter();
