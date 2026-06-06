import { ColorSwatch, BrandStyleArchetype } from './BrandProfile';

export class PaletteGenerator {
  /**
   * Expands direct brand primary colors into a complete design palette matching style parameters.
   */
  public generateFromStyle(primaryHex: string, style: BrandStyleArchetype): ColorSwatch[] {
    const p = primaryHex || '#ffd700';

    switch (style) {
      case BrandStyleArchetype.LUXURY:
        return [
          { hex: p, name: 'Liquid Obsidian Gold', role: 'PRIMARY', ratio: 0.5 },
          { hex: '#111112', name: 'Elite Jet Midnight', role: 'BACKGROUND', ratio: 0.35 },
          { hex: '#e5e5e6', name: 'Platinum Silver', role: 'SECONDARY', ratio: 0.1 },
          { hex: '#c5a059', name: 'Deco Bronze', role: 'ACCENT', ratio: 0.04 },
          { hex: '#ffffff', name: 'High Polish Brightness', role: 'HIGHLIGHT', ratio: 0.01 }
        ];

      case BrandStyleArchetype.TECHNOLOGY:
        return [
          { hex: '#00ffff', name: 'Laser Neon Cyan', role: 'PRIMARY', ratio: 0.45 },
          { hex: '#0a0a0f', name: 'Silicon Void Dark', role: 'BACKGROUND', ratio: 0.4 },
          { hex: '#a855f7', name: 'Digital Hyperviolet', role: 'SECONDARY', ratio: 0.1 },
          { hex: '#3b82f6', name: 'Server Blue Track', role: 'ACCENT', ratio: 0.04 },
          { hex: '#00ffc4', name: 'Quantum Green Light', role: 'HIGHLIGHT', ratio: 0.01 }
        ];

      case BrandStyleArchetype.MINIMAL:
        return [
          { hex: '#1c1c1f', name: 'Architect Slate Charcoal', role: 'PRIMARY', ratio: 0.6 },
          { hex: '#fbfbfb', name: 'Matte Gallery White', role: 'BACKGROUND', ratio: 0.3 },
          { hex: '#94a3b8', name: 'Passive Concrete Grey', role: 'SECONDARY', ratio: 0.07 },
          { hex: '#334155', name: 'Steel Accent Shadow', role: 'ACCENT', ratio: 0.02 },
          { hex: '#ef4444', name: 'Signal Warning Dot', role: 'HIGHLIGHT', ratio: 0.01 }
        ];

      case BrandStyleArchetype.SPORTS:
        return [
          { hex: '#ff0055', name: 'Apex Volt Lime', role: 'PRIMARY', ratio: 0.5 },
          { hex: '#050505', name: 'Deep Asphalt Track', role: 'BACKGROUND', ratio: 0.35 },
          { hex: '#facc15', name: 'Fuel Gold Yellow', role: 'SECONDARY', ratio: 0.1 },
          { hex: '#3b82f6', name: 'Stadium Blue Field', role: 'ACCENT', ratio: 0.04 },
          { hex: '#ffffff', name: 'Goal Line Finish', role: 'HIGHLIGHT', ratio: 0.01 }
        ];

      case BrandStyleArchetype.GAMING:
        return [
          { hex: '#ff003c', name: 'Vortex Red Pulse', role: 'PRIMARY', ratio: 0.48 },
          { hex: '#08080c', name: 'Stealth GPU Dark', role: 'BACKGROUND', ratio: 0.38 },
          { hex: '#00ff40', name: 'Liquid Coolant Green', role: 'SECONDARY', ratio: 0.1 },
          { hex: '#7c3aed', name: 'RGB Chroma Light', role: 'ACCENT', ratio: 0.03 },
          { hex: '#00f7ff', name: 'Hyper Photon Stream', role: 'HIGHLIGHT', ratio: 0.01 }
        ];

      default:
        return [
          { hex: p, name: 'Standard Corporate Base', role: 'PRIMARY', ratio: 0.5 },
          { hex: '#121214', name: 'Office Midnight Dark', role: 'BACKGROUND', ratio: 0.35 },
          { hex: '#4b5563', name: 'Branding Cool Grey', role: 'SECONDARY', ratio: 0.1 },
          { hex: '#6366f1', name: 'Aesthetic Royal Purple', role: 'ACCENT', ratio: 0.04 },
          { hex: '#ffffff', name: 'Perfect Contrast Edge', role: 'HIGHLIGHT', ratio: 0.01 }
        ];
    }
  }
}
