export interface RenderedArtifact {
  id: string;
  name: string;
  type: 'vector-svg' | 'video-mp4' | 'json-motion-dna' | 'packaged-zip';
  sizeBytes: number;
  downloadUrl: string;
  createdTimestamp: number;
}

export class ArtifactManager {
  private static instance: ArtifactManager | null = null;
  private artifacts = new Map<string, RenderedArtifact>();

  public static getInstance(): ArtifactManager {
    if (!ArtifactManager.instance) {
      ArtifactManager.instance = new ArtifactManager();
      ArtifactManager.instance.initializeMockArtifacts();
    }
    return ArtifactManager.instance;
  }

  private constructor() {}

  private initializeMockArtifacts() {
    this.createArtifact(
      'art-svg',
      'Oyster Crown Signature Logo - Vector Sequence',
      'vector-svg',
      450 * 1024,
      '#/downloads/oyster_crown_raw.svg'
    );
    this.createArtifact(
      'art-dna',
      'Motion DNA Hermite Curve Spec Parameters',
      'json-motion-dna',
      12 * 1024,
      '#/downloads/motion_dna_specs.json'
    );
  }

  public createArtifact(
    id: string,
    name: string,
    type: RenderedArtifact['type'],
    sizeBytes: number,
    url: string
  ): RenderedArtifact {
    const art: RenderedArtifact = {
      id,
      name,
      type,
      sizeBytes,
      downloadUrl: url,
      createdTimestamp: Date.now()
    };
    this.artifacts.set(id, art);
    return art;
  }

  public getArtifacts(): RenderedArtifact[] {
    return Array.from(this.artifacts.values());
  }

  public removeArtifact(id: string) {
    this.artifacts.delete(id);
  }
}
