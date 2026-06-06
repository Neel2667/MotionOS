import { ArtifactManager } from './ArtifactManager';
import { ShareManager } from './ShareManager';
import { PublishManager } from './PublishManager';

export interface DeploymentStats {
  projectReady: boolean;
  deploymentUrl: string;
  completionPercentage: number;
  overallHealth: 'healthy' | 'degraded' | 'syncing';
  cdnHitsTotal: number;
  artifactsSizeMb: number;
}

export class DeploymentManager {
  private static instance: DeploymentManager | null = null;
  private isDeploying = false;
  private deployProgress = 0;
  private isPreppedForDeploy = false;

  public static getInstance(): DeploymentManager {
    if (!DeploymentManager.instance) {
      DeploymentManager.instance = new DeploymentManager();
    }
    return DeploymentManager.instance;
  }

  private constructor() {}

  public prepProjectForDeployment() {
    this.isPreppedForDeploy = true;
  }

  public isPrepped(): boolean {
    return this.isPreppedForDeploy;
  }

  public startDeployment(version = 'v1.0.0', callbackProgress?: (p: number) => void) {
    if (this.isDeploying) return;
    this.isDeploying = true;
    this.deployProgress = 0;

    const interval = setInterval(() => {
      this.deployProgress += 10;
      if (callbackProgress) callbackProgress(this.deployProgress);

      if (this.deployProgress >= 100) {
        clearInterval(interval);
        this.isDeploying = false;
        
        // publish to cdn
        PublishManager.getInstance().publishRelease(
          version,
          'production',
          `https://cdn.motion.os/active-project/${version}/index.js`
        );
        
        // generate shared link
        ShareManager.getInstance().createShareLink(
          `share-${Date.now()}`,
          'Active Cinematic Composition',
          `https://motion.os/s/deploy-${version}-${Math.floor(Math.random() * 1000)}`
        );
      }
    }, 400);
  }

  public getStats(): DeploymentStats {
    const artMgr = ArtifactManager.getInstance();
    const shareMgr = ShareManager.getInstance();
    const pubMgr = PublishManager.getInstance();

    const totalArtSize = artMgr.getArtifacts().reduce((sum, item) => sum + item.sizeBytes, 0);
    const totalHits = shareMgr.getShares().reduce((sum, item) => sum + item.hitsCount, 0);
    const activeReleases = pubMgr.getReleases().filter(r => r.status === 'healthy');

    return {
      projectReady: this.isPreppedForDeploy,
      deploymentUrl: shareMgr.getShares()[0]?.shareUrl || 'None Active',
      completionPercentage: this.deployProgress,
      overallHealth: activeReleases.length > 0 ? 'healthy' : 'syncing',
      cdnHitsTotal: totalHits,
      artifactsSizeMb: parseFloat((totalArtSize / (1024 * 1024)).toFixed(3))
    };
  }
}
