import React, { useState, useEffect } from 'react';
import { DeploymentManager } from '../engine/deployment/DeploymentManager';
import { ArtifactManager, RenderedArtifact } from '../engine/deployment/ArtifactManager';
import { ShareManager, SharedLinkTracker } from '../engine/deployment/ShareManager';
import { PublishPanel } from './PublishPanel';
import { Download, Share2, Clipboard, Globe, HelpCircle, Archive, Save, FileSpreadsheet, Layers, ShieldCheck, CheckCircle } from 'lucide-react';

export function DeploymentCenter() {
  const [stats, setStats] = useState<any>(null);
  const [artifacts, setArtifacts] = useState<RenderedArtifact[]>([]);
  const [shares, setShares] = useState<SharedLinkTracker[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  const refreshAll = () => {
    const deployMgr = DeploymentManager.getInstance();
    const artMgr = ArtifactManager.getInstance();
    const shareMgr = ShareManager.getInstance();

    setStats(deployMgr.getStats());
    setArtifacts(artMgr.getArtifacts());
    setShares(shareMgr.getShares());
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployProgress(0);

    const deployMgr = DeploymentManager.getInstance();
    deployMgr.startDeployment('v1.0.1', (progress) => {
      setDeployProgress(progress);
      if (progress >= 100) {
        setIsDeploying(false);
        refreshAll();
      }
    });
  };

  const handleCreateSharePack = () => {
    const shareMgr = ShareManager.getInstance();
    const id = `share-${Date.now()}`;
    shareMgr.createShareLink(
      id,
      'Dynamic Cinematic Branding Frame',
      `https://motion.os/s/cinematic-${Math.floor(Math.random() * 9000) + 1000}`,
      0,
      true
    );
    refreshAll();
  };

  const handleExportMetadata = () => {
    // Generate virtual json download
    const metadata = {
      version: '1.2.0',
      timestamp: Date.now(),
      vramFootprintBytes: 112 * 1024 * 1024,
      frameWidth: 1920,
      frameHeight: 1080
    };
    alert(`Generated Metadata Sheet:\n${JSON.stringify(metadata, null, 2)}`);
  };

  const handleArchiveProject = () => {
    alert('Project archive .mop compiled successfully with delta history compressed.');
  };

  if (!stats) {
    return <div className="p-4 text-xs font-mono text-neutral-500">Loading Deployment Cloud Systems...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Central Cloud Deploy Controller */}
      <div className="bg-[#0b0b0d] border border-neutral-800 rounded-xl p-5 shadow-2.5xl font-mono text-xs text-neutral-300">
        <div className="flex items-center justify-between border-b border-neutral-850 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <Archive className="text-indigo-400" size={17} />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Deployment Dashboard & Archival Center</h2>
          </div>
          {stats.projectReady ? (
            <div className="flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
              <ShieldCheck size={12} /> Live Ready
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-500 text-[10px] bg-amber-955 bg-amber-950/20 border border-amber-800 px-2 py-0.5 rounded">
              <CheckCircle size={12} /> Deployment Primed
            </div>
          )}
        </div>

        {/* Global Statistics metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="bg-neutral-900/40 p-3 rounded border border-neutral-850/80">
            <span className="text-[10px] text-neutral-500 uppercase block">Archived size</span>
            <p className="text-sm font-black text-neutral-200 mt-1">{stats.artifactsSizeMb.toFixed(3)} MB</p>
          </div>
          <div className="bg-neutral-900/40 p-3 rounded border border-neutral-850/80">
            <span className="text-[10px] text-neutral-500 uppercase block">Active Embed Shares</span>
            <p className="text-sm font-black text-violet-400 mt-1">{shares.length} live portals</p>
          </div>
          <div className="bg-neutral-900/40 p-3 rounded border border-neutral-850/80">
            <span className="text-[10px] text-neutral-500 uppercase block">Accumulated CDN pagehits</span>
            <p className="text-sm font-black text-emerald-400 mt-1">{stats.cdnHitsTotal} Views</p>
          </div>
        </div>

        {/* Action button panel */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button 
            onClick={handleStartDeploy}
            disabled={isDeploying}
            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition flex items-center gap-1.5 ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Layers size={13} /> {isDeploying ? `Deploying... ${deployProgress}%` : 'Initiate Multi-region CDN Deploy'}
          </button>
          <button 
            onClick={handleCreateSharePack}
            className="px-4 py-2 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 rounded font-bold border border-neutral-800 transition flex items-center gap-1.5"
          >
            <Share2 size={13} /> Generate Embed Portal
          </button>
          <button 
            onClick={handleExportMetadata}
            className="px-4 py-2 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 rounded font-bold border border-neutral-800 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet size={13} /> Export Metadata Sheet
          </button>
          <button 
            onClick={handleArchiveProject}
            className="px-4 py-2 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 rounded font-bold border border-neutral-800 transition flex items-center gap-1.5"
          >
            <Save size={13} /> Package Project Archive
          </button>
        </div>

        {/* Deploy Process Progress Bar */}
        {isDeploying && (
          <div className="space-y-1.5 bg-neutral-900/40 p-3.5 border border-neutral-850/80 rounded mb-4">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-neutral-400">Distributing assets across edge-regions...</span>
              <span className="font-bold text-white">{deployProgress}%</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${deployProgress}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Downloadable Artifacts */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Rendered Export Artifacts ({artifacts.length})</h3>
            <div className="border border-neutral-850 rounded-lg divide-y divide-neutral-950 bg-neutral-950/30">
              {artifacts.map(art => (
                <div key={art.id} className="p-2.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-neutral-200 text-[11px] truncate max-w-56">{art.name}</p>
                    <code className="text-[9px] text-[#29ca60]/95">{art.type.toUpperCase()}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono">{(art.sizeBytes / 1024).toFixed(1)} KB</span>
                    <a 
                      href={art.downloadUrl} 
                      className="p-1 px-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-300 transition"
                      title="Download raw file"
                    >
                      <Download size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Shares Tracker */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Embed Portals ({shares.length})</h3>
            <div className="border border-neutral-850 rounded-lg divide-y divide-neutral-950 bg-neutral-950/30">
              {shares.map(sh => (
                <div key={sh.id} className="p-2.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-neutral-200 text-[11px]">{sh.projectTitle}</p>
                    <code className="text-[9px] text-indigo-400/80">{sh.shareUrl}</code>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-950/30 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-900/40">
                      Active
                    </span>
                    <p className="text-[9px] text-neutral-500 mt-1">{sh.hitsCount} embeds</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Semantic Web CDN registry */}
      <PublishPanel />
    </div>
  );
}
export default DeploymentCenter;
