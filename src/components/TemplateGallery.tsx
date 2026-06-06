import React, { useState } from 'react';
import { Layers, Bookmark, Check, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { industryTemplates, IndustryTemplate } from '../engine/templates/IndustryTemplates';
import { globalTemplateLibrary } from '../engine/templates/TemplateLibrary';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalEditHistory } from '../engine/history/EditHistory';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';

export function TemplateGallery({ session, onApply }: { session: StudioSessionState, onApply?: () => void }) {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('');

  const handleApplyTemplate = (id: string, name: string) => {
    const currentProject = globalProjectManager.getActiveProject();
    if (!currentProject) return;

    const modified = globalTemplateLibrary.applyIndustryTemplate(currentProject, id);
    globalProjectManager.loadProject(modified);
    globalProjectManager.saveActive();

    setActiveTemplateId(id);
    globalEditHistory.addChange(`Applied layout template: ${name} onto workspace`, modified, 'TEMPLATE_APPLY');

    // Sync session details so preview knows
    globalStudioSession.updateState({
      brandStyle: modified.sceneState.brandStyle,
      sceneName: `Atmosphere: ${modified.sceneState.environmentName}`,
      cameraSettingApplied: true,
      fxApplied: true,
      timelineSynthesized: true,
      previewReady: true
    });

    if (onApply) onApply();
  };

  return (
    <div id="template_gallery_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-400" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ececee]">Industry Design Templates</h4>
        </div>
        <span className="text-[8px] text-amber-500 font-extrabold flex items-center gap-0.5">
          <Sparkles size={10} /> 10 Brand presets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.values(industryTemplates).map((tpl: IndustryTemplate) => {
          const isSelected = activeTemplateId === tpl.id || session.brandStyle === tpl.brandStyle;
          
          return (
            <div 
              key={tpl.id}
              onClick={() => handleApplyTemplate(tpl.id, tpl.name)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between min-h-[160px] transition cursor-pointer group select-none ${
                isSelected 
                  ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-950/20' 
                  : 'border-neutral-850 hover:border-neutral-600 bg-neutral-900/10'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <span className="text-[7.5px] px-1 bg-neutral-950/40 text-neutral-400 border border-neutral-800 rounded">
                  {tpl.id.toUpperCase()}
                </span>
                {isSelected ? (
                  <span className="text-[8px] text-amber-400 flex items-center gap-0.5 font-black uppercase">
                    <Check size={10} strokeWidth={3} /> ACTIVE
                  </span>
                ) : null}
              </div>

              {/* Title / Description */}
              <div className="my-3 space-y-1">
                <h5 className="text-[11.5px] font-extrabold text-neutral-100 group-hover:text-amber-400 transition">
                  {tpl.name}
                </h5>
                <p className="text-[8.5px] text-neutral-500 leading-normal">
                  Lens FOV {tpl.camera.fov}° / Ambient {tpl.lighting.ambientIntensity} / Transition: {tpl.transitions.type}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-neutral-900/60 flex flex-wrap gap-1">
                <span className="text-[8px] px-1 bg-neutral-900 border border-neutral-850 text-neutral-400">
                  {tpl.camera.trackingStyle}
                </span>
                <span className="text-[8px] px-1 bg-neutral-900 border border-neutral-850 text-amber-400">
                  {tpl.lighting.rigName.replace('_GRID_RIG', '').replace('_WARM_STUDIO', '')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default TemplateGallery;
