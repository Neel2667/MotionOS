import { Project } from '../project/Project';

export interface ValidationIssue {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  category: 'ASSET' | 'TIMELINE' | 'CAMERA' | 'FX' | 'MATERIAL' | 'EXPORT';
  message: string;
  resolution: string;
}

export interface ProjectHealthReport {
  healthScore: number; // 0 to 100
  performanceScore: number; // 0 to 100
  qualityScore: number; // 0 to 100
  issues: ValidationIssue[];
  exportReady: boolean;
}

export class ValidationEngine {
  validateProject(project: Project): ProjectHealthReport {
    const issues: ValidationIssue[] = [];
    let performanceScore = 100;
    let qualityScore = 90;

    // 1. Check Missing Assets
    if (project.assets.length === 0) {
      issues.push({
        id: 'val_asset_none',
        severity: 'CRITICAL',
        category: 'ASSET',
        message: 'No active assets linked inside the workspace tracker maps.',
        resolution: 'Upload an brand vector logo or import default SVG shapes to anchor calculations.'
      });
      qualityScore -= 30;
    } else {
      project.assets.forEach(asset => {
        if (!asset.path) {
          issues.push({
            id: `val_asset_path_${asset.id}`,
            severity: 'WARNING',
            category: 'ASSET',
            message: `Asset resource "${asset.name}" points to an invalid virtual path.`,
            resolution: 'Re-bind the physical uploaded brand assets using the media library.'
          });
          qualityScore -= 10;
        }
      });
    }

    // 2. Check Timeline Errors
    if (project.timelineTracks.length === 0) {
      issues.push({
        id: 'val_time_notracks',
        severity: 'CRITICAL',
        category: 'TIMELINE',
        message: 'No creative animation tracks found. Stage cannot undergo transitions.',
        resolution: 'Synthesize standard timeline tracks under AI presets or add manually.'
      });
      qualityScore -= 20;
    } else {
      project.timelineTracks.forEach(track => {
        if (track.keyframes.length === 0) {
          issues.push({
            id: `val_time_nokf_${track.id}`,
            severity: 'WARNING',
            category: 'TIMELINE',
            message: `Track "${track.name}" contains zero active keyframes.`,
            resolution: 'Add keyframe coordinates or remove track to avoid stagnant rendering allocations.'
          });
          performanceScore -= 5;
        } else {
          // Check if any keyframe has times less than 0 or out of chronological order
          let lastTime = -1;
          track.keyframes.forEach((kf, idx) => {
            if (kf.time < 0) {
              issues.push({
                id: `val_time_neg_${kf.id}`,
                severity: 'CRITICAL',
                category: 'TIMELINE',
                message: `Keyframe #${idx + 1} on track "${track.name}" has negative timestamp.`,
                resolution: 'Correct time offsets inside the track sequencer.'
              });
              qualityScore -= 15;
            }
            if (kf.time < lastTime) {
              issues.push({
                id: `val_time_chrono_${kf.id}`,
                severity: 'CRITICAL',
                category: 'TIMELINE',
                message: `Chronological violation! Keyframe at ${kf.time}s appears out of sequence.`,
                resolution: 'Reorder keyframes chronologically.'
              });
            }
            lastTime = kf.time;
          });
        }
      });
    }

    // 3. Check Camera Errors
    const cam = project.sceneState.cameraSettings;
    if (cam) {
      if (cam.fov < 10 || cam.fov > 120) {
        issues.push({
          id: 'val_cam_fov',
          severity: 'CRITICAL',
          category: 'CAMERA',
          message: `Field-of-view settings (${cam.fov}°) exceed safe focal lens dimensions.`,
          resolution: 'Restrict FOV between 15° and 100° to prevent camera distortion.'
        });
        qualityScore -= 25;
      }
      if (cam.near < 0.01) {
        issues.push({
          id: 'val_cam_near',
          severity: 'WARNING',
          category: 'CAMERA',
          message: 'Near clipping plane is extremely low. Could cause depth buffering anomalies.',
          resolution: 'Raise camera near plane threshold above 0.05 units.'
        });
        performanceScore -= 8;
      }
      if (cam.enableDof && cam.focusDistance < 0.1) {
        issues.push({
          id: 'val_cam_dof_range',
          severity: 'WARNING',
          category: 'CAMERA',
          message: 'Depth-of-field focus distance points behind the camera bounds.',
          resolution: 'Increase focal target offset parameters.'
        });
      }
    }

    // 4. Check FX Conflicts
    const fxList = project.sceneState.activeFX;
    if (fxList.includes('BLOOM') && fxList.includes('LENS_BLOOM')) {
      issues.push({
        id: 'val_fx_bloom_conflict',
        severity: 'SUGGESTION',
        category: 'FX',
        message: 'Multiple bloom glow modules active in shader pipeline simultaneously.',
        resolution: 'Deactivate either standard BLOOM or LENS_BLOOM to optimize render times.'
      });
      performanceScore -= 10;
    }
    if (fxList.length > 5) {
      issues.push({
        id: 'val_fx_count',
        severity: 'WARNING',
        category: 'FX',
        message: `High active post-processing depth load (${fxList.length} systems enabled).`,
        resolution: 'Keep active filters count under 4 to satisfy 60FPS browser limits.'
      });
      performanceScore -= 15;
    }

    // 5. Check Material Conflicts
    const mats = project.sceneState.activeMaterials;
    if (mats.length === 0) {
      issues.push({
        id: 'val_mat_none',
        severity: 'WARNING',
        category: 'MATERIAL',
        message: 'No reflection materials compiled. Logo shapes will undergo dull default mapping.',
        resolution: 'Activate Gold, Chrome, Glass or Pearl inside materials dashboard.'
      });
      qualityScore -= 10;
    }
    if (mats.includes('GOLD') && mats.includes('CHROME')) {
      issues.push({
        id: 'val_mat_conflict',
        severity: 'SUGGESTION',
        category: 'MATERIAL',
        message: 'Highly metallic materials "Gold" and "Chrome" active at once.',
        resolution: 'Verify style coherence is correct.'
      });
    }

    // 6. Export Readiness Score Calc
    const criticalIssuesCount = issues.filter(i => i.severity === 'CRITICAL').length;
    const exportReady = criticalIssuesCount === 0;

    if (exportReady) {
      qualityScore += 10;
    } else {
      qualityScore -= 15;
    }

    // Bind boundaries
    performanceScore = Math.max(10, Math.min(100, performanceScore));
    qualityScore = Math.max(10, Math.min(100, qualityScore));

    const totalIssuesCost = (issues.filter(i => i.severity === 'CRITICAL').length * 20) +
                           (issues.filter(i => i.severity === 'WARNING').length * 8) +
                           (issues.filter(i => i.severity === 'SUGGESTION').length * 2);

    const healthScore = Math.max(15, Math.min(100, 100 - totalIssuesCost));

    return {
      healthScore,
      performanceScore,
      qualityScore,
      issues,
      exportReady
    };
  }
}

export const globalValidationEngine = new ValidationEngine();
export default globalValidationEngine;
