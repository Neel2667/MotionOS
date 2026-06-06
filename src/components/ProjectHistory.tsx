import React, { useState, useEffect } from 'react';
import { Clock, Undo, Redo, AlertCircle, RefreshCw } from 'lucide-react';
import { globalHistoryManager, HistoryItem } from '../engine/versioning/HistoryManager';
import { globalProjectManager } from '../engine/project/ProjectManager';

export function ProjectHistory({ onActionTriggered }: { onActionTriggered?: () => void }) {
  const [undoStack, setUndoStack] = useState<HistoryItem[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryItem[]>([]);

  const updateStacks = () => {
    setUndoStack(globalHistoryManager.getUndoStack());
    setRedoStack(globalHistoryManager.getRedoStack());
  };

  useEffect(() => {
    updateStacks();
    // Register project modification listeners to sync undo indices
    const unsub = globalProjectManager.registerListener(() => {
      updateStacks();
    });
    return () => unsub();
  }, []);

  const handleUndo = () => {
    const current = globalProjectManager.getActiveProject();
    const restored = globalHistoryManager.undo(current);
    if (restored) {
      globalProjectManager.saveActive();
      updateStacks();
      if (onActionTriggered) onActionTriggered();
    }
  };

  const handleRedo = () => {
    const current = globalProjectManager.getActiveProject();
    const restored = globalHistoryManager.redo(current);
    if (restored) {
      globalProjectManager.saveActive();
      updateStacks();
      if (onActionTriggered) onActionTriggered();
    }
  };

  const formatTime = (ms: number) => {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div id="project_history_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex justify-between items-center bg-[#0d0d0f] -mx-5 -mt-5 p-3 px-5 border-b border-neutral-850 rounded-t-xl shrink-0">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-indigo-400" />
          <h4 className="text-xs font-black uppercase tracking-widest text-neutral-200">Undo / Redo Timeline</h4>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`p-1.5 rounded border text-xs font-bold transition flex items-center gap-1 ${
              undoStack.length > 0 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 cursor-pointer' 
                : 'border-neutral-900 text-neutral-600 cursor-not-allowed'
            }`}
            title="Undo Last Action"
          >
            <Undo size={11} />
            <span>Undo</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`p-1.5 rounded border text-xs font-bold transition flex items-center gap-1 ${
              redoStack.length > 0 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 cursor-pointer' 
                : 'border-neutral-900 text-neutral-600 cursor-not-allowed'
            }`}
            title="Redo Next Action"
          >
            <Redo size={11} />
            <span>Redo</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-[10px] text-neutral-500 uppercase font-black tracking-wider">
          <span>Action Sequence</span>
          <span>Time Snapshot</span>
        </div>

        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
          {undoStack.length === 0 && (
            <div className="text-center py-6 text-neutral-600 text-[10px] space-y-2 border border-dashed border-neutral-850 rounded-lg bg-black/10">
              <AlertCircle size={16} className="mx-auto text-neutral-700" />
              <div>
                <p>Undo/Redo stacks are currently empty.</p>
                <p className="text-[8px] text-neutral-600 mt-0.5">Tweak speed modifiers or drop keyframes to record undo nodes.</p>
              </div>
            </div>
          )}

          {undoStack.map((item, idx) => {
            const isLatest = idx === undoStack.length - 1;
            return (
              <div 
                key={item.id} 
                className={`p-2 rounded border text-[10px] flex justify-between items-center transition ${
                  isLatest 
                    ? 'bg-indigo-950/20 border-indigo-850 ring-1 ring-indigo-505/10' 
                    : 'bg-black/40 border-neutral-855'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-indigo-400 animate-pulse' : 'bg-neutral-700'}`} />
                  <p className="font-semibold text-neutral-200 truncate pr-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-neutral-500 font-mono text-[9px]">
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
