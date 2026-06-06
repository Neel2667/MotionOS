import { RenderSettings } from '../export/RenderSettings';
import { EncodedOutput } from '../export/Encoder';

export enum JobStatus {
  STANDBY = 'STANDBY',
  WORKING = 'WORKING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED'
}

export interface Job {
  id: string;
  name: string;
  projectName: string;
  settings: RenderSettings;
  status: JobStatus;
  progressPercent: number;
  currentFrame: number;
  totalFrames: number;
  timeElapsedMs: number;
  timeEstimatedMs: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  output?: EncodedOutput;
  error?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export function createRenderJob(
  projectName: string,
  settings: RenderSettings,
  priority: Job['priority'] = 'NORMAL'
): Job {
  const totalFrames = Math.max(1, settings.endFrame - settings.startFrame);
  let multiplier = 50; // Milliseconds per frame base
  
  if (settings.preset === 'HIGH') multiplier = 100;
  else if (settings.preset === 'ULTRA') multiplier = 250;
  else if (settings.preset === 'PRODUCTION') multiplier = 500;
  else if (settings.preset === 'DRAFT') multiplier = 20;

  return {
    id: `job_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    name: `Render [${settings.exportType}] - ${settings.resolutionPreset}`,
    projectName,
    settings: { ...settings },
    status: JobStatus.STANDBY,
    progressPercent: 0,
    currentFrame: 0,
    totalFrames,
    timeElapsedMs: 0,
    timeEstimatedMs: totalFrames * multiplier,
    createdAt: Date.now(),
    priority
  };
}
