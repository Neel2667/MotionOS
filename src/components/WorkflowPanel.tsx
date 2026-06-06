import React from 'react';
import { ChevronRight, ChevronLeft, Check, Compass, HelpCircle, FastForward } from 'lucide-react';
import { WORKFLOW_STEPS, globalWorkflowManager } from '../engine/studio/WorkflowManager';
import { globalStudioSession, StudioSessionState } from '../engine/studio/StudioSession';

export function WorkflowPanel({ session, onStepChange }: { session: StudioSessionState; onStepChange?: () => void }) {
  const currentStep = WORKFLOW_STEPS[session.currentStepIndex] || WORKFLOW_STEPS[0];

  const handleStepClick = (index: number) => {
    globalWorkflowManager.jumpToStep(index);
    if (onStepChange) onStepChange();
  };

  const handleNext = () => {
    const ok = globalWorkflowManager.advance();
    if (ok && onStepChange) onStepChange();
  };

  const handleBack = () => {
    const ok = globalWorkflowManager.regress();
    if (ok && onStepChange) onStepChange();
  };

  return (
    <div id="workflow_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="text-amber-400" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ececee]">Workflow Progress Pipeline</h4>
        </div>
        <span className="text-[7.5px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded font-black uppercase">
          11 Core Checkpoints
        </span>
      </div>

      {/* Steps visualization track */}
      <div className="space-y-4">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = session.currentStepIndex > idx;
            const isActive = session.currentStepIndex === idx;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`flex-1 text-left md:text-center p-2 rounded-lg border transition ${
                  isActive 
                    ? 'border-amber-500 bg-amber-500/5 text-amber-300 font-extrabold ring-1 ring-amber-500/20' 
                    : isCompleted 
                      ? 'border-emerald-500/20 bg-emerald-950/5 text-emerald-400' 
                      : 'border-neutral-850 hover:border-neutral-700 text-neutral-500 bg-neutral-900/10'
                }`}
              >
                <div className="flex md:flex-col items-center justify-between gap-1">
                  <span className="text-[8px] uppercase tracking-normal text-neutral-500 block">Step {idx + 1}</span>
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <Check size={9} className="text-emerald-400" strokeWidth={3} />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
                    )}
                    <span className="text-[10px] truncate max-w-[80px] md:max-w-none">{step.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Active Step description */}
        <div className="p-3 bg-black/40 border border-neutral-850 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[8px] text-neutral-500 font-bold block uppercase">CURRENT PHASE</span>
            <p className="text-[11.5px] font-bold text-neutral-200 mt-0.5">{currentStep.label}</p>
            <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">{currentStep.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBack}
              disabled={session.currentStepIndex === 0}
              className={`p-1.5 rounded border transition flex items-center gap-1 text-[9.5px] ${
                session.currentStepIndex === 0 
                  ? 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed' 
                  : 'bg-black border-neutral-800 hover:border-neutral-700 text-neutral-300 cursor-pointer'
              }`}
            >
              <ChevronLeft size={10} /> Prev
            </button>

            <button
              onClick={handleNext}
              disabled={!globalWorkflowManager.canAdvance()}
              className={`p-1.5 rounded border transition flex items-center gap-1 text-[9.5px] ${
                globalWorkflowManager.canAdvance()
                  ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-505 cursor-pointer font-bold' 
                  : 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed'
              }`}
            >
              Advance <ChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WorkflowPanel;
