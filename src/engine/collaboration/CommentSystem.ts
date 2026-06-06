import { globalDatabase } from '../database/Database';
import { globalActivityLog } from './ActivityLog';

export interface CollaborationComment {
  id: string;
  projectId: string;
  author: string;
  avatar: string;
  message: string;
  timestamp: number;
  timelineTimeSec: number; // attached timeline position
  stagePosition?: { x: number; y: number }; // attached coordinate
  resolved: boolean;
}

type CommentListener = (comments: CollaborationComment[]) => void;

export class CommentSystem {
  private listeners: Set<CommentListener> = new Set();

  public getCommentsForProject(projectId: string): CollaborationComment[] {
    const table = globalDatabase.getTable<CollaborationComment>('comments');
    return table
      .map(r => r.data)
      .filter(c => c.projectId === projectId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  public addComment(params: {
    projectId: string;
    author: string;
    avatar: string;
    message: string;
    timelineTimeSec: number;
    stagePosition?: { x: number; y: number };
  }): CollaborationComment {
    const now = Date.now();
    const comment: CollaborationComment = {
      id: `comm_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      projectId: params.projectId,
      author: params.author,
      avatar: params.avatar,
      message: params.message,
      timestamp: now,
      timelineTimeSec: params.timelineTimeSec,
      stagePosition: params.stagePosition,
      resolved: false,
    };

    globalDatabase.insert<CollaborationComment>('comments', comment.id, comment);
    
    // Log activity
    globalActivityLog.log({
      type: 'COMMENT_ADD',
      projectName: 'Active Deck',
      details: `Dropped feedback: "${comment.message.substring(0, 40)}"`,
      author: params.author
    });

    this.notify(params.projectId);
    return comment;
  }

  public resolveComment(id: string, projectId: string): boolean {
    const success = globalDatabase.update<CollaborationComment>('comments', id, { resolved: true });
    if (success) {
      this.notify(projectId);
    }
    return success;
  }

  public deleteComment(id: string, projectId: string): boolean {
    const success = globalDatabase.delete('comments', id);
    if (success) {
      this.notify(projectId);
    }
    return success;
  }

  public registerListener(projectId: string, listener: CommentListener): () => void {
    this.listeners.add(listener);
    listener(this.getCommentsForProject(projectId));
    return () => this.listeners.delete(listener);
  }

  private notify(projectId: string) {
    const copy = this.getCommentsForProject(projectId);
    this.listeners.forEach(cb => cb(copy));
  }
}

export const globalCommentSystem = new CommentSystem();
