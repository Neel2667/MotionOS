import React, { useState, useEffect } from 'react';
import { Users, Send, CheckCircle, MessageSquare, Trash2, ArrowRightLeft, ShieldAlert, Wifi, MousePointer2 } from 'lucide-react';
import { globalSession, Collaborator } from '../engine/collaboration/Session';
import { globalCommentSystem, CollaborationComment } from '../engine/collaboration/CommentSystem';
import { globalPermissionManager, ProjectRole } from '../engine/collaboration/PermissionManager';
import { globalProjectManager } from '../engine/project/ProjectManager';
import { globalPresenceManager, CursorPresence } from '../engine/collaboration/PresenceManager';

export function CollaborationPanel() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [presences, setPresences] = useState<CursorPresence[]>([]);
  const [comments, setComments] = useState<CollaborationComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeRole, setActiveRole] = useState<ProjectRole>('OWNER');
  
  // Simulated stage coordinates forDropped annotations
  const [coordX, setCoordX] = useState(320);
  const [coordY, setCoordY] = useState(240);

  const activeProject = globalProjectManager.getActiveProject();

  useEffect(() => {
    setCollaborators(globalSession.getCollaborators());
    setActiveRole(globalPermissionManager.getActiveUserRole());

    // Register active commentators listener
    const unsubComments = globalCommentSystem.registerListener(activeProject.metadata.id, (fresh) => {
      setComments(fresh);
    });

    // Register active cursors listener
    const unsubPresence = globalPresenceManager.registerListener((fresh) => {
      setPresences(fresh);
    });

    return () => {
      unsubComments();
      unsubPresence();
    };
  }, [activeProject.metadata.id]);

  const handleRoleSwap = (role: ProjectRole) => {
    globalPermissionManager.setActiveUserRole(role);
    setActiveRole(role);
    
    // Simulate updating Collaborator list on-the-fly
    globalSession.updatePresence('user_1', 'ONLINE');
    setCollaborators([...globalSession.getCollaborators()]);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    
    globalCommentSystem.addComment({
      projectId: activeProject.metadata.id,
      author: 'Alexander Wright',
      avatar: 'AW',
      message: newComment.trim(),
      timelineTimeSec: 2.5,
      stagePosition: { x: coordX, y: coordY }
    });

    setNewComment('');
    // Randomize next comment spawn coordinates slightly for visual excitement!
    setCoordX(Math.floor(100 + Math.random() * 400));
    setCoordY(Math.floor(100 + Math.random() * 300));
  };

  const handleResolveComment = (id: string) => {
    globalCommentSystem.resolveComment(id, activeProject.metadata.id);
  };

  return (
    <div id="collaboration_panel_root" className="bg-[#121215] border border-neutral-800 rounded-xl p-5 space-y-5 font-mono select-none">
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3 -mt-1 shrink-0">
        <div className="flex items-center gap-2">
          <Users className="text-indigo-400" size={15} />
          <h4 className="text-xs font-black uppercase tracking-widest text-neutral-200">Cooperative Channels & Feedback</h4>
        </div>
        <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/20">
          <Wifi size={10} className="animate-pulse" />
          <span>PORT_SYNCHRONIZED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Teammates List & Active Session Cursor Presences */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase font-black block">Active Collaborative Members</span>
            <div className="space-y-2">
              {collaborators.map(c => (
                <div key={c.id} className="p-2 bg-black/40 border border-neutral-850 rounded flex items-center justify-between text-[10.5px]">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-200">{c.name} {c.id === 'user_1' && '(You)'}</p>
                      <p className="text-[8px] text-neutral-500 uppercase font-extrabold">{c.role} • ONLINE</p>
                    </div>
                  </div>
                  
                  {c.id === 'user_1' ? (
                    <div className="flex items-center gap-1 border border-neutral-800 bg-[#08080a] p-1 rounded">
                      <ArrowRightLeft size={10} className="text-neutral-500 mr-0.5" />
                      <select
                        value={activeRole}
                        onChange={(e) => handleRoleSwap(e.target.value as ProjectRole)}
                        className="bg-transparent text-[8.5px] font-bold text-indigo-400 hover:text-white border-none focus:ring-0 p-0 cursor-pointer outline-none"
                      >
                        <option value="OWNER">Owner</option>
                        <option value="EDITOR">Editor</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                    </div>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cursor Presence tracking */}
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase font-black block">Simulated Canvas Peer Presences</span>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {presences.length === 0 && (
                <p className="text-center py-4 text-neutral-600 text-[10px]">No active peer cursors detected.</p>
              )}
              {presences.map(presence => (
                <div key={presence.userId} className="p-2 bg-black/20 border border-neutral-855 rounded flex items-center justify-between text-[9.5px]">
                  <div className="flex items-center gap-2">
                    <MousePointer2 size={10} style={{ color: presence.color }} />
                    <span className="font-bold text-neutral-300">{presence.userName}</span>
                  </div>
                  <span className="text-neutral-500 font-mono">
                    stage: <span className="text-neutral-300">X: {presence.x}, Y: {presence.y}</span>
                    {presence.activeElementId && <span className="text-indigo-400 bg-indigo-950/20 px-1 rounded ml-1 text-[7.5px] font-black uppercase">{presence.activeElementId}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commenting System & Active Reviews */}
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex-1 space-y-2 min-h-[180px]">
            <span className="text-[10px] text-neutral-500 uppercase font-black block">Review Thread & stage Coordinates</span>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {comments.filter(c => !c.resolved).length === 0 && (
                <p className="text-center py-8 text-neutral-600 text-[10px] border border-dashed border-neutral-850 rounded">
                  All annotations resolved. No unresolved team tasks reported.
                </p>
              )}
              {comments.filter(c => !c.resolved).map(comm => (
                <div key={comm.id} className="p-2.5 bg-neutral-900/40 border border-neutral-855 rounded flex justify-between gap-3 text-[10px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-neutral-200">{comm.author}</span>
                      {comm.stagePosition && (
                        <span className="text-[8px] bg-indigo-950/30 text-indigo-400 border border-indigo-900/20 px-1 rounded">
                          stage({comm.stagePosition.x}, {comm.stagePosition.y})
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-400 leading-normal">{comm.message}</p>
                  </div>
                  <button
                    onClick={() => handleResolveComment(comm.id)}
                    className="p-1 text-emerald-500 hover:bg-emerald-950/10 rounded transition shrink-0 self-start"
                    title="Mark task Resolved"
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Drop Form */}
          <div className="bg-[#08080a] border border-neutral-850 p-2.5 rounded-lg space-y-2 shrink-0">
            <span className="text-[9px] text-neutral-500 uppercase block font-bold">Drop feedback marker on active stage</span>
            <div className="flex gap-1 text-[9px] text-neutral-400">
              <span>Attached Coordinates:</span>
              <span className="text-indigo-400 font-bold">X: {coordX}, Y: {coordY}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Message teammate (e.g. Bring keyframe 2 to frame 45)"
                className="flex-grow bg-black border border-neutral-800 rounded px-2.5 py-1.5 text-[10px] text-neutral-205 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                className={`p-1.5 rounded transition ${
                  newComment.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-505 cursor-pointer shadow' 
                    : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                }`}
              >
                <Send size={12} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
