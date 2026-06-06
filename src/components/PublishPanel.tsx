import React, { useState, useEffect } from 'react';
import { PublishManager, CDNReleaseTracker } from '../engine/deployment/PublishManager';
import { Cloud, Globe, RotateCcw, Plus, CheckCircle, ExternalLink, RefreshCcw } from 'lucide-react';

export function PublishPanel() {
  const [releases, setReleases] = useState<CDNReleaseTracker[]>([]);
  const [versionInput, setVersionInput] = useState('v1.2.0');
  const [envInput, setEnvInput] = useState<'production' | 'staging' | 'canary'>('production');

  const updateReleases = () => {
    setReleases(PublishManager.getInstance().getReleases());
  };

  useEffect(() => {
    updateReleases();
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const pub = PublishManager.getInstance();
    pub.publishRelease(
      versionInput,
      envInput,
      `https://cdn.motion.os/active-compilation/${envInput}/${versionInput}/index.js`
    );
    updateReleases();
    setVersionInput(`v1.${parseInt(versionInput.split('.')[1]) + 1}.0`);
  };

  const handleRollback = (env: string, ver: string) => {
    PublishManager.getInstance().triggerRollback(env, ver);
    updateReleases();
  };

  return (
    <div className="bg-[#0b0b0d] border border-neutral-850 rounded-xl p-5 shadow-2xl font-mono text-xs text-neutral-300">
      <div className="flex items-center gap-2 border-b border-neutral-850 pb-3 mb-4">
        <Cloud className="text-sky-400" size={17} />
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Semantic Cloud Publisher & CDN Registry</h2>
      </div>

      {/* Deploy Form */}
      <form onSubmit={handlePublish} className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-lg mb-5 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-32">
          <label className="text-[10px] text-neutral-500 uppercase block mb-1">Semantic Release Target</label>
          <input 
            type="text" 
            value={versionInput} 
            onChange={e => setVersionInput(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 outline-none focus:border-indigo-500/80 text-[11px]"
            placeholder="e.g. v1.2.0"
            required
          />
        </div>
        <div className="flex-1 min-w-32">
          <label className="text-[10px] text-neutral-500 uppercase block mb-1">Target Cluster Env</label>
          <select 
            value={envInput} 
            onChange={e => setEnvInput(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 outline-none focus:border-indigo-500/80 text-[11px]"
          >
            <option value="production">Production Global Edge</option>
            <option value="staging">Staging Canary Testbed</option>
            <option value="canary">Dynamic Beta Node Cluster</option>
          </select>
        </div>
        <button 
          type="submit"
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition flex items-center gap-1.5 text-[11px]"
        >
          <Plus size={12} /> Ship To Live App
        </button>
      </form>

      {/* CDN list */}
      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">Active CDN Releases</h3>
      <div className="border border-neutral-850 rounded-lg bg-neutral-950/40 divide-y divide-neutral-950">
        {releases.map(rel => (
          <div key={`${rel.environment}-${rel.version}`} className="p-3 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-200 text-sm">{rel.version}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest ${rel.environment === 'production' ? 'bg-indigo-950/50 text-indigo-400' : 'bg-neutral-850 text-neutral-400'}`}>
                  {rel.environment}
                </span>
                <span className={`w-2 h-2 rounded-full ${rel.status === 'healthy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              </div>
              <code className="text-[9px] text-[#29ca60]/95 block break-all font-mono">
                {rel.deployedEndpointUrl}
              </code>
              <p className="text-[9px] text-neutral-600">
                CDN Multi-regions: {rel.regionsCount} | Shipped: {new Date(rel.lastDeployedTimestamp).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {rel.status === 'healthy' && (
                <button 
                  onClick={() => handleRollback(rel.environment, rel.version)}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded hover:text-red-400 transition flex items-center gap-1 font-bold font-mono text-[9px] border border-neutral-800"
                >
                  <RotateCcw size={10} /> Rollback Release
                </button>
              )}
              <a 
                href={rel.deployedEndpointUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-1 rounded hover:bg-neutral-800 transition text-neutral-500 hover:text-neutral-300"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
