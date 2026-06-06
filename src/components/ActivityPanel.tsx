import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, FileText, Camera, RefreshCw, MessageSquare } from 'lucide-react';
import { globalActivityLog, ActivityItem } from '../engine/collaboration/ActivityLog';

export function ActivityPanel() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const unsub = globalActivityLog.registerListener((fresh) => {
      setActivities(fresh);
    });
    return () => unsub();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATE': return <FileText size={10} className="text-indigo-400" />;
      case 'ASSET_IMPORT': return <Activity size={10} className="text-teal-400" />;
      case 'SNAPSHOT_MANUAL': 
      case 'SNAPSHOT_AUTO': return <Camera size={10} className="text-amber-400" />;
      case 'COMMENT_ADD': return <MessageSquare size={10} className="text-sky-400" />;
      default: return <RefreshCw size={10} className="text-emerald-400" />;
    }
  };

  const getBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30';
      case 'EDITOR': return 'bg-amber-950/40 text-amber-400 border border-amber-900/30';
      default: return 'bg-neutral-900 text-neutral-400 border border-neutral-805';
    }
  };

  return (
    <div id="activity_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-4 font-mono select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-400 animate-pulse" size={15} />
          <h4 className="text-xs font-black uppercase tracking-widest text-neutral-200">Unified Live Activity Feed</h4>
        </div>
        <span className="text-[7.5px] font-bold px-1.5 py-0.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/20 rounded animate-pulse">
          REAL-TIME TELEMETRY
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {activities.length === 0 && (
          <p className="text-center py-8 text-neutral-600 text-[10px]">No recent telemetry records recorded.</p>
        )}

        {activities.map(act => (
          <div key={act.id} className="p-2 bg-[#0a0a0c]/60 border border-neutral-855 rounded hover:border-neutral-800 transition text-[9.5px] select-none flex gap-2.5 items-start">
            <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(act.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-neutral-200">{act.userName}</span>
                  <span className={`text-[7px] px-1 rounded font-black uppercase ${getBadgeColor(act.userRole)}`}>
                    {act.userRole}
                  </span>
                </div>
                <span className="text-[8px] text-neutral-500 shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[9.5px]">
                {act.details} <span className="text-[8.5px] text-neutral-550">on {act.projectName}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
