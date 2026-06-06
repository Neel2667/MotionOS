import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, RotateCcw, AlertTriangle, ChevronRight, CheckCircle, ListPlus, Trash2, Sliders, Dna, Info } from 'lucide-react';
import { globalVersionManager } from '../engine/versioning/VersionManager';
import { Snapshot } from '../engine/versioning/Snapshot';
import { globalDiffEngine, ProjectDiffReport } from '../engine/versioning/DiffEngine';
import { globalRestoreEngine } from '../engine/versioning/RestoreEngine';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { Project } from '../engine/project/Project';

export function SnapshotViewer({ onRestoreSuccess }: { onRestoreSuccess?: () => void }) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [diffReport, setDiffReport] = useState<ProjectDiffReport | null>(null);
  const [manualNote, setManualNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState<Snapshot | null>(null);

  const activeProject = globalProjectManager.getActiveProject();

  const loadSnapshots = () => {
    const list = globalVersionManager.getSnapshotsForProject(activeProject.metadata.id);
    setSnapshots(list);
    if (list.length > 0 && !selectedSnapshot) {
      setSelectedSnapshot(list[0]);
    }
  };

  useEffect(() => {
    loadSnapshots();
    const unsub = globalProjectManager.registerListener(() => {
      loadSnapshots();
    });
    return () => unsub();
  }, [activeProject.metadata.id]);

  useEffect(() => {
    if (selectedSnapshot) {
      try {
        const snapProj: Project = JSON.parse(selectedSnapshot.projectBackup);
        const report = globalDiffEngine.compareProjects(snapProj, activeProject);
        setDiffReport(report);
      } catch (e) {
        console.warn('Compare parse issues:', e);
      }
    } else {
      setDiffReport(null);
    }
  }, [selectedSnapshot, activeProject]);

  const handleGenerateManualSnapshot = () => {
    if (!manualNote.trim()) return;
    globalVersionManager.createSnapshot(activeProject, manualNote.trim(), 'MANUAL');
    setManualNote('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    loadSnapshots();
  };

  const handleApplyRestore = (snap: Snapshot) => {
    const res = globalRestoreEngine.restoreToSnapshot(snap);
    if (res.success) {
      setShowConfirmRestore(null);
      loadSnapshots();
      if (onRestoreSuccess) onRestoreSuccess();
    }
  };

  const handleDeleteSnap = (id: string) => {
    globalVersionManager.deleteSnapshot(id);
    setSelectedSnapshot(null);
    loadSnapshots();
  };

  return (
    <div id="snapshot_viewer_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex items-center gap-2">
        <Camera className="text-amber-400" size={15} />
        <h4 className="text-xs font-black uppercase tracking-widest text-neutral-200">System Versioning & Snapshots</h4>
      </div>

      {/* Trigger Snapshot form */}
      <div className="space-y-2">
        <span className="text-[9px] text-neutral-500 uppercase font-black block">Take Manual Blueprint Snapshot</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualNote}
            onChange={(e) => setManualNote(e.target.value)}
            placeholder="Describe version changes (e.g. Added Luxury light rig)"
            className="flex-1 bg-[#08080a] border border-neutral-800 rounded-lg px-3 py-1.5 text-[10px] text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            onClick={handleGenerateManualSnapshot}
            disabled={!manualNote.trim()}
            className={`px-3 py-1.5 rounded font-black text-[10px] uppercase border transition shrink-0 ${
              manualNote.trim() 
                ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-500 cursor-pointer' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
        {isSaved && (
          <p className="text-[9px] text-emerald-400 animate-pulse">Snapshot captured with customized metadata successfully!</p>
        )}
      </div>

      {/* Snapshot List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-[9px] text-neutral-500 uppercase font-black block">Version Tree Log ({snapshots.length})</span>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {snapshots.length === 0 && (
              <div className="text-center py-8 text-neutral-600 text-[10px] border border-dashed border-neutral-850 rounded">
                No active versions created yet for this project.
              </div>
            )}
            {snapshots.map(snap => {
              const isSelected = selectedSnapshot?.id === snap.id;
              return (
                <div
                  key={snap.id}
                  onClick={() => setSelectedSnapshot(snap)}
                  className={`p-2.5 rounded border text-[10px] text-left cursor-pointer transition flex flex-col gap-1.5 ${
                    isSelected 
                      ? 'bg-amber-500/5 border-amber-500/50 ring-1 ring-amber-500/20' 
                      : 'bg-black/40 border-neutral-855 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400">{snap.versionCode}</span>
                    <span className="text-[7.5px] px-1 bg-neutral-900 text-neutral-500 rounded uppercase font-mono">{snap.type}</span>
                  </div>
                  <p className="text-neutral-300 line-clamp-2 leading-relaxed">{snap.changeSummary}</p>
                  <div className="flex justify-between text-[7.5px] text-neutral-500">
                    <span>{new Date(snap.timestamp).toLocaleTimeString()}</span>
                    <span>Tracks: {snap.timelineTrackCount} • Kfs: {snap.keyframeCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Diff Panel */}
        <div className="space-y-2">
          <span className="text-[9px] text-neutral-500 uppercase font-black block">Snapshot Delta & Parameters</span>
          
          {selectedSnapshot ? (
            <div className="p-3 bg-black/40 border border-neutral-850 rounded text-[9.5px] font-mono space-y-3">
              <div className="flex justify-between items-start border-b border-neutral-850 pb-2">
                <div>
                  <span className="text-[8px] text-neutral-500 font-bold block">COMPARE WITH CURRENT:</span>
                  <p className="text-[10px] text-neutral-200 font-bold">Selected Version: {selectedSnapshot.versionCode}</p>
                </div>
                <button
                  onClick={() => setShowConfirmRestore(selectedSnapshot)}
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[8.5px] font-bold flex items-center gap-1 border border-indigo-505 transition shadow-lg shrink-0"
                >
                  <RotateCcw size={9} />
                  <span>ROLLBACK</span>
                </button>
              </div>

              {diffReport ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Blueprint Match Score:</span>
                    <span className={`font-black text-xs px-1.5 py-0.5 rounded ${
                      diffReport.similarityScore > 85 ? 'text-emerald-400 bg-emerald-950/20' : 'text-amber-400 bg-amber-950/20'
                    }`}>
                      {diffReport.similarityScore}%
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {diffReport.isIdentical ? (
                      <p className="text-emerald-400 text-[9px] leading-relaxed flex items-center gap-1">
                        <CheckCircle size={10} /> Active engine configuration is visually identical to this checkpoint.
                      </p>
                    ) : (
                      <>
                        {diffReport.modifiedFields.map(f => (
                          <div key={f} className="text-amber-400 flex items-center gap-1.5 text-[8.5px]">
                            <Info size={9} /> Update: Modified {f}
                          </div>
                        ))}
                        {diffReport.keyframesAdded.map(f => (
                          <div key={f} className="text-indigo-400 flex items-center gap-1.5 text-[8.5px]">
                            <ListPlus size={9} /> Ingest: Keyframes added on {f}
                          </div>
                        ))}
                        {diffReport.keyframesRemoved.map(f => (
                          <div key={f} className="text-red-400 flex items-center gap-1.5 text-[8.5px]">
                            <Trash2 size={9} /> Erase: Removed {f}
                          </div>
                        ))}
                        {diffReport.assetListChanges.map(f => (
                          <div key={f} className="text-teal-400 flex items-center gap-1.5 text-[8.5px]">
                            <Info size={9} /> Link: {f}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 text-[9px]">Analyzing delta records...</p>
              )}
            </div>
          ) : (
            <div className="h-[220px] bg-[#0d0d0f] border border-neutral-850 rounded flex items-center justify-center text-neutral-600 text-[10px]">
              Select a version checkpoint from the tree log.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation dialogue overlay simulation */}
      {showConfirmRestore && (
        <div className="border border-red-500/30 bg-red-950/10 p-3 rounded-lg flex flex-col gap-2 animate-pulse text-[9.5px]">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={15} />
            <span className="font-extrabold uppercase tracking-wide">Confirm Rollback & Cache Override?</span>
          </div>
          <p className="text-neutral-400 leading-normal">
            This action will copy the serialized parameters of snapshot **{showConfirmRestore.versionCode}** directly into your active canvas. Any unsaved keyframes will be overwritten.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirmRestore(null)}
              className="px-2.5 py-1 text-neutral-400 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleApplyRestore(showConfirmRestore)}
              className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-500 font-bold transition shadow-md shadow-red-950/30"
            >
              Confirm Rollback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
