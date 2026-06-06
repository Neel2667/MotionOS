export interface CDNReleaseTracker {
  version: string;
  environment: 'production' | 'staging' | 'canary';
  deployedEndpointUrl: string;
  status: 'deploying' | 'healthy' | 'rollback' | 'obsolete';
  regionsCount: number;
  lastDeployedTimestamp: number;
}

export class PublishManager {
  private static instance: PublishManager | null = null;
  private releases = new Map<string, CDNReleaseTracker>();

  public static getInstance(): PublishManager {
    if (!PublishManager.instance) {
      PublishManager.instance = new PublishManager();
      PublishManager.instance.initializePredefinedReleases();
    }
    return PublishManager.instance;
  }

  private constructor() {}

  private initializePredefinedReleases() {
    this.publishRelease('v1.0.0', 'production', 'https://cdn.motion.os/oyster-crown/v100/index.js');
    this.publishRelease('v1.1.0-beta', 'staging', 'https://cdn.motion.os/oyster-crown/v110-beta/index.js');
  }

  public publishRelease(
    version: string,
    environment: CDNReleaseTracker['environment'],
    endpointUrl: string
  ): CDNReleaseTracker {
    const rel: CDNReleaseTracker = {
      version,
      environment,
      deployedEndpointUrl: endpointUrl,
      status: 'healthy',
      regionsCount: 14,
      lastDeployedTimestamp: Date.now()
    };
    this.releases.set(`${environment}-${version}`, rel);
    return rel;
  }

  public getReleases(): CDNReleaseTracker[] {
    return Array.from(this.releases.values()).sort(
      (a, b) => b.lastDeployedTimestamp - a.lastDeployedTimestamp
    );
  }

  public triggerRollback(environment: string, version: string) {
    const rel = this.releases.get(`${environment}-${version}`);
    if (rel) {
      rel.status = 'rollback';
    }
  }
}
