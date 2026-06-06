import { AssetType } from './AssetMetadata';

export class ThumbnailGenerator {
  /**
   * Generates a high-performance, crisp Base64 canvas thumbnail matching the file type context.
   */
  public async generate(name: string, type: AssetType, contentBlobUrl?: string): Promise<string> {
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Paint clean brand dark background
    ctx.fillStyle = '#141417';
    ctx.fillRect(0, 0, 120, 120);

    // Decorative target grid
    ctx.strokeStyle = '#1d1d23';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 20; i < 120; i += 20) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 120);
      ctx.moveTo(0, i);
      ctx.lineTo(120, i);
    }
    ctx.stroke();

    ctx.save();

    switch (type) {
      case 'PNG':
      case 'JPEG':
      case 'WEBP':
      case 'GIF':
        if (contentBlobUrl) {
          // If a blob exists, asynchronously attempt to draw it onto canvas, otherwise return fallback placeholder
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 15, 15, 90, 90);
              resolve(canvas.toDataURL());
            };
            img.onerror = () => {
              this.drawFallbackIcon(ctx, name, '#3b82f6');
              resolve(canvas.toDataURL());
            };
            img.src = contentBlobUrl;
          });
        }
        this.drawFallbackIcon(ctx, name, '#3b82f6');
        break;

      case 'SVG':
        // Standard geometric vector drawing
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(60, 60, 30, 0, Math.PI * 2);
        ctx.moveTo(40, 40);
        ctx.lineTo(80, 80);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(234, 179, 8, 0.1)';
        ctx.fill();
        
        this.drawLabel(ctx, 'VECTOR');
        break;

      case 'TTF':
      case 'OTF':
        // Specimen text
        ctx.fillStyle = '#d946ef';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Aa', 60, 55);

        ctx.fillStyle = '#a21caf';
        ctx.font = '7px monospace';
        ctx.fillText('TYPO DESIGN', 60, 90);
        break;

      case 'MP4':
      case 'WEBM':
        // Film roll pattern
        ctx.fillStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(30, 30, 60, 60);
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.lineTo(45, 70);
        ctx.lineTo(65, 60);
        ctx.closePath();
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        this.drawLabel(ctx, 'VIDEO');
        break;

      case 'PDF':
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PDF', 60, 60);
        this.drawLabel(ctx, 'VECTOR LOGO');
        break;

      case 'JSON_DNA':
        ctx.fillStyle = '#4ade80';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('{ DNA }', 60, 60);
        this.drawLabel(ctx, 'DNA STRAND');
        break;

      case 'PROJECT_JSON':
        ctx.fillStyle = '#6366f1';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PROJECT', 60, 60);
        this.drawLabel(ctx, 'MOTION OS');
        break;

      default:
        this.drawFallbackIcon(ctx, name, '#64748b');
    }

    ctx.restore();
    return canvas.toDataURL();
  }

  private drawFallbackIcon(ctx: CanvasRenderingContext2D, text: string, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(60, 50, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px bold sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((text[0] || 'A').toUpperCase(), 60, 50);

    ctx.fillStyle = '#475569';
    ctx.font = '7px monospace';
    ctx.fillText('MEDIA FILE', 60, 85);
  }

  private drawLabel(ctx: CanvasRenderingContext2D, label: string) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 60, 110);
  }
}

export const globalThumbnailGenerator = new ThumbnailGenerator();
