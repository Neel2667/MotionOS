import React, { useState, useEffect } from 'react';
import { History, Undo2, Redo2, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { globalEditHistory, HistoryChange } from '../engine/history/EditHistory';
import { globalUndoManager } from '../engine/history/UndoManager';
import { globalRedoManager } from '../engine/history/RedoManager';
import { globalProjectManager } from '../engine/project/ProjectManager';

export function EditHistoryPanel({ onHistoryAction }: { onHistoryAction?: () => void }) {
  const [historyList, setHistoryList] = useState<HistoryChange[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    // Register change listeners across stack managers
    const unsubHistory = globalEditHistory.registerListener((changes) => {
      setHistoryList(changes);
    });

    const unsubUndo = globalUndoManager.registerListener(() => {
      setCanUndo(globalUndoManager.canUndo());
    });

    const unsubRedo = globalRedoManager.registerListener(() => {
      setCanRedo(globalRedoManager.canRedo());
    });

    setCanUndo(globalUndoManager.canUndo());
    setCanRedo(globalRedoManager.canRedo());

    return () => {
      unsubHistory();
      unsubUndo();
      unsubRedo();
    };
  }, []);

  const handleUndo = () => {
    const backupState = globalUndoManager.popState();
    if (backupState) {
      const activeProj = globalProjectManager.getActiveProject();
      if (activeProj) {
        globalRedoManager.pushState(activeProj);
      }
      globalProjectManager.loadProject(backupState);
      globalProjectManager.saveActive();
      globalEditHistory.addChange('Triggered Undo operation', backupState, 'RESET');
      if (onHistoryAction) onHistoryAction();
    }
  };

  const handleRedo = () => {
    const backupState = globalRedoManager.popState();
    if (backupState) {
      const activeProj = globalProjectManager.getActiveProject();
      if (activeProj) {
        globalUndoManager.pushState(activeProj);
      }
      globalProjectManager.loadProject(backupState);
      globalProjectManager.saveActive();
      globalEditHistory.addChange('Triggered Redo operation', backupState, 'RESET');
      if (onHistoryAction) onHistoryAction();
    }
  };

  return (
    <div id="history_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none text-neutral-300">
      
      {/* Undo/Redo Header triggers */}
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <div className="flex items-center gap-2">
          <History className="text-amber-500" size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Edit Timeline Log</h4>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-1 flex items-center justify-center rounded border transition text-[10px] uppercase font-bold px-2 cursor-pointer ${
              canUndo 
                ? 'bg-neutral-900 border-neutral-800 hover:border-amber-500 text-amber-400' 
                : 'bg-neutral-950 border-neutral-900 text-neutral-600 cursor-not-allowed'
            }`}
          >
            <Undo2 size={10} className="mr-1" /> Undo
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-1 flex items-center justify-center rounded border transition text-[10px] uppercase font-bold px-2 cursor-pointer ${
              canRedo 
                ? 'bg-neutral-900 border-neutral-800 hover:border-amber-500 text-amber-400' 
                : 'bg-neutral-950 border-neutral-900 text-neutral-600 cursor-not-allowed'
            }`}
          >
            Redo <Redo2 size={10} className="ml-1" />
          </button>
        </div>
      </div>

      {/* History log elements */}
      <div className="space-y-2">
        <span className="text-[8px] text-neutral-500 uppercase font-black block">OPERATION STACK TRACE</span>
        
        {historyList.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-[10.5px]">
            <AlertCircle size={14} className="mx-auto mb-1 text-neutral-600" />
            No manual adjustments written to history logs yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
            {historyList.map((item) => (
              <div key={item.id} className="p-3 bg-black/40 border border-neutral-850 rounded-lg flex justify-between items-center text-left text-[11px]">
                <div className="space-y-0.5">
                  <span className={`text-[7.5px] font-black uppercase px-1 py-0.2 rounded border ${
                    item.category === 'CREATION' 
                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' 
                      : item.category === 'TEMPLATE_APPLY' 
                        ? 'bg-indigo-950/20 text-indigo-400 border-indigo-900/30' 
                        : 'bg-neutral-900 border-neutral-850 text-neutral-400'
                  }`}>
                    {item.category}
                  </span>
                  <p className="text-[10.5px] text-neutral-200 font-bold heading-tight pt-1">{item.description}</p>
                </div>
                
                <span className="text-[8.5px] text-neutral-500 shrink-0 select-none">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
export default EditHistoryPanel;
