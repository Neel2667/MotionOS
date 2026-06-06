import React, { useMemo } from 'react';
import { Lightbulb, Percent, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import { globalAIStudio } from '../engine/studio/AIStudio';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';

export function RecommendationPanel({ session }: { session: StudioSessionState }) {
  const currentProject = globalProjectManager.getActiveProject();
  
  const recommendations = useMemo(() => {
    if (!currentProject) return [];
    return globalAIStudio.getRecommendations(currentProject);
  }, [currentProject, session.brandStyle]);

  return (
    <div id="recommendation_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-amber-400" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ececee]">Smart AI Recommendations</h4>
        </div>
        <span className="text-[8px] text-amber-500 font-extrabold flex items-center gap-1">
          <Wand2 size={10} /> Model confidence profiles
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-[11px] text-neutral-500">Launch the Brand Ingestion wizard to populate design parameter profiles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 bg-black/45 border border-neutral-850 hover:border-neutral-700 transition rounded-lg space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-amber-400 font-black uppercase tracking-wide">
                  {rec.type} Style
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-0.5">
                  <Percent size={11} className="inline" /> {rec.confidenceScore}% confidence
                </span>
              </div>

              <div>
                <p className="text-[11.5px] font-extrabold text-neutral-200 mt-1">{rec.suggestion}</p>
                <p className="text-[10px] text-neutral-400 mt-1 leading-normal">{rec.description}</p>
              </div>

              <div className="pt-2 border-t border-neutral-900 flex flex-wrap gap-1">
                {Object.entries(rec.recommendedParameters).map(([pKey, pVal]) => (
                  <span key={pKey} className="text-[8.5px] bg-neutral-900/60 border border-neutral-850 px-1.5 py-0.5 rounded text-neutral-400">
                    {pKey}: <span className="text-neutral-200 font-bold">{String(pVal)}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default RecommendationPanel;
