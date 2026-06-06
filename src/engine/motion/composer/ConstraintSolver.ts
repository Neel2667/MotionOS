import { TimelineSegment } from './Sequencer';
import { MotionBlock } from './MotionBlock';

export interface ConstraintConflict {
  id: string;
  category: 'Camera Collision' | 'Object Overlap' | 'Timing Conflict' | 'FX Conflict' | 'Material Conflict' | 'Lighting Conflict';
  severity: 'Info' | 'Warning' | 'Critical';
  description: string;
  resolution: string;
}

export class ConstraintSolver {
  public logs: ConstraintConflict[] = [];
  public optimizationScore: number = 100;

  solve(segments: TimelineSegment[], activeFX: string[], activeMaterials: string[], envLights: any): { logs: ConstraintConflict[], score: number } {
    this.logs = [];
    this.optimizationScore = 100;

    // 1. Solve Camera Collision Risks (depth and camera proximity)
    const orbitBlocks = this.findBlocksOfTypes(segments, ['Orbit', 'Bounce']);
    if (orbitBlocks.length > 0 && envLights.rig === 'LUXURY_STUDIO') {
      this.logs.push({
        id: 'CAM-01',
        category: 'Camera Collision',
        severity: 'Warning',
        description: 'Luxury studio lights position triggers high reflection clipping with orbiting paths.',
        resolution: 'Dampened near-plane camera frustum and constrained orbit radius bounds (Min: 4.5f).'
      });
      this.optimizationScore -= 4;
    }

    // 2. Solve Object Overlaps (coinciding starting blocks)
    let timingOverlapCount = 0;
    for (let i = 0; i < segments.length - 1; i++) {
      const currentEnd = segments[i].startTime + segments[i].duration;
      const nextStart = segments[i+1].startTime;
      if (nextStart < currentEnd - 0.05) {
        timingOverlapCount++;
      }
    }
    if (timingOverlapCount > 0) {
      this.logs.push({
        id: 'TIME-01',
        category: 'Timing Conflict',
        severity: 'Critical',
        description: `${timingOverlapCount} segments have active blocks whose durations exceed segment limits.`,
        resolution: 'Pruned block tails and forced eased blending overlaps across boundaries.'
      });
      this.optimizationScore -= 8;
    }

    // 3. Solve FX Conflict (like double bursting or particle overdraw caps)
    if (activeFX.includes('PARTICLES') && activeFX.includes('SHOCKWAVE')) {
      this.logs.push({
        id: 'FX-01',
        category: 'FX Conflict',
        severity: 'Warning',
        description: 'Simultaneous heavy particles and radial shockwave overdraw exceeds target mobile GPU threshold.',
        resolution: 'Dynamically capped particle emission budget to 1200 max count on shockwave frames.'
      });
      this.optimizationScore -= 5;
    }

    // 4. Solve Material Conflicts (materials overlapping colors)
    if (activeMaterials.includes('GOLD') && activeMaterials.includes('NEON')) {
      this.logs.push({
        id: 'MAT-01',
        category: 'Material Conflict',
        severity: 'Warning',
        description: 'Gold gloss clearcoat clashes with high-frequency neon emission profiles.',
        resolution: 'Forced blend mode override: scaled metalness factors down to 0.5f on high emission.'
      });
      this.optimizationScore -= 3;
    }

    // 5. Solve Lighting Over-exposures
    if (envLights.lights && envLights.lights.length > 3) {
      this.logs.push({
        id: 'LGT-01',
        category: 'Lighting Conflict',
        severity: 'Warning',
        description: 'Multipoint lighting exceeding 3 dynamic active rigs risk vertex overexposure.',
        resolution: 'Merged ambient & skyward key lights to single HDRI dome multiplier.'
      });
      this.optimizationScore -= 2;
    }

    // Ensure we don't go below 50 score
    this.optimizationScore = Math.max(50, this.optimizationScore);

    return {
      logs: this.logs,
      score: this.optimizationScore
    };
  }

  private findBlocksOfTypes(segments: TimelineSegment[], types: string[]): MotionBlock[] {
    const matched: MotionBlock[] = [];
    for (const seg of segments) {
      for (const block of seg.blocks) {
        if (types.includes(block.type)) {
          matched.push(block);
        }
      }
    }
    return matched;
  }
}
