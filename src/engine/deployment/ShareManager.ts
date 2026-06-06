export interface SharedLinkTracker {
  id: string;
  projectTitle: string;
  shareUrl: string;
  hitsCount: number;
  active: boolean;
  allowDownload: boolean;
}

export class ShareManager {
  private static instance: ShareManager | null = null;
  private sharedLinks = new Map<string, SharedLinkTracker>();

  public static getInstance(): ShareManager {
    if (!ShareManager.instance) {
      ShareManager.instance = new ShareManager();
      ShareManager.instance.initializePredefinedShares();
    }
    return ShareManager.instance;
  }

  private constructor() {}

  private initializePredefinedShares() {
    this.createShareLink(
      'share-1',
      'Oyster Crown luxury sequence',
      'https://motion.os/s/oyster-crown-premium',
      142,
      true
    );
  }

  public createShareLink(
    id: string,
    projectTitle: string,
    customUrl: string,
    initialHits = 0,
    downloadAllowed = true
  ): SharedLinkTracker {
    const link: SharedLinkTracker = {
      id,
      projectTitle,
      shareUrl: customUrl,
      hitsCount: initialHits,
      active: true,
      allowDownload: downloadAllowed
    };
    this.sharedLinks.set(id, link);
    return link;
  }

  public getShares(): SharedLinkTracker[] {
    return Array.from(this.sharedLinks.values());
  }

  public toggleShareState(id: string) {
    const link = this.sharedLinks.get(id);
    if (link) {
      link.active = !link.active;
    }
  }
}
