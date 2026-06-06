import { MotionBlock, CustomBlockType, MotionBlockFactory } from './MotionBlock';
import { BrandStyle } from '../../ai/analyzer/BrandAnalyzer';

export interface TimelineSegment {
  name: string; // 'Intro' | 'Build-up' | 'Hero Reveal' | 'Secondary Motion' | 'Accent Motion' | 'Outro'
  startTime: number;
  duration: number;
  blocks: MotionBlock[];
}

export class Sequencer {
  public segments: TimelineSegment[] = [];

  sequence(style: BrandStyle, totalDuration: number = 6.0): TimelineSegment[] {
    this.segments = [];
    
    // Scale block parameters depending on the brand speed & style criteria
    let tempoMultiplier = 1.0; 
    let activityFactor = 1.0;

    if (style === BrandStyle.SPORTS || style === BrandStyle.GAMING) {
      tempoMultiplier = 1.3; // faster transitions
      activityFactor = 1.5; // more active overlay blocks
    } else if (style === BrandStyle.LUXURY || style === BrandStyle.FASHION) {
      tempoMultiplier = 0.7; // slow elegant sweep
      activityFactor = 0.6; // focused high-fidelity pulses
    }

    // Segment 1: Intro (0s -> 1.0s relative)
    const introDuration = 1.0 / tempoMultiplier;
    const introBlocks = [
      MotionBlockFactory.create(CustomBlockType.REVEAL, {
        name: 'Logo Alpha Dawn',
        duration: introDuration,
        delay: 0,
        intensity: 0.9,
        priority: 1
      }),
      MotionBlockFactory.create(CustomBlockType.GLOW, {
        name: 'Intro Spark',
        duration: introDuration * 0.8,
        delay: 0.2,
        intensity: 0.6 * activityFactor,
        priority: 2
      })
    ];
    this.segments.push({
      name: 'Intro',
      startTime: 0,
      duration: introDuration,
      blocks: introBlocks
    });

    // Segment 2: Build-up (1.0s -> 2.2s relative)
    const buildUpStart = introDuration;
    const buildUpDuration = 1.2 / tempoMultiplier;
    const buildUpBlocks = [
      MotionBlockFactory.create(CustomBlockType.ROTATE, {
        name: 'Slow Build Orbit',
        duration: buildUpDuration,
        delay: 0,
        intensity: 0.5 * activityFactor,
        priority: 1,
        parameters: { axis: 'y', speed: 0.8 }
      }),
      MotionBlockFactory.create(CustomBlockType.WAVE, {
        name: 'Energy Ripple',
        duration: buildUpDuration * 0.9,
        delay: 0.1,
        intensity: 0.7,
        priority: 2
      })
    ];
    this.segments.push({
      name: 'Build-up',
      startTime: buildUpStart,
      duration: buildUpDuration,
      blocks: buildUpBlocks
    });

    // Segment 3: Hero Reveal (2.2s -> 3.8s relative)
    const heroStart = buildUpStart + buildUpDuration;
    const heroDuration = 1.6 / tempoMultiplier;
    const heroBlocks = [
      MotionBlockFactory.create(CustomBlockType.SCALE, {
        name: 'Climax Burst Scale',
        duration: heroDuration * 0.7,
        delay: 0,
        intensity: 0.95,
        priority: 1
      }),
      MotionBlockFactory.create(
        style === BrandStyle.SPORTS ? CustomBlockType.EXPLODE : CustomBlockType.ASSEMBLE,
        {
          name: 'Primary Climax FX',
          duration: heroDuration,
          delay: 0.1,
          intensity: 0.85 * activityFactor,
          priority: 2
        }
      )
    ];
    this.segments.push({
      name: 'Hero Reveal',
      startTime: heroStart,
      duration: heroDuration,
      blocks: heroBlocks
    });

    // Segment 4: Secondary Motion (3.8s -> 4.8s relative)
    const secStart = heroStart + heroDuration;
    const secDuration = 1.0 / tempoMultiplier;
    const secBlocks = [
      MotionBlockFactory.create(CustomBlockType.ORBIT, {
        name: 'Stalwart Camera Pivot',
        duration: secDuration,
        delay: 0,
        intensity: 0.4,
        priority: 1
      })
    ];
    this.segments.push({
      name: 'Secondary Motion',
      startTime: secStart,
      duration: secDuration,
      blocks: secBlocks
    });

    // Segment 5: Accent Motion (4.8s -> 5.4s relative)
    const accentStart = secStart + secDuration;
    const accentDuration = 0.6 / tempoMultiplier;
    const accentBlocks = [
      MotionBlockFactory.create(CustomBlockType.PULSE, {
        name: 'Ambient Status Pulse',
        duration: accentDuration,
        delay: 0,
        intensity: 0.5,
        priority: 1
      })
    ];
    this.segments.push({
      name: 'Accent Motion',
      startTime: accentStart,
      duration: accentDuration,
      blocks: accentBlocks
    });

    // Segment 6: Outro (5.4s -> end)
    const outroStart = accentStart + accentDuration;
    const remainingTime = Math.max(0.5, totalDuration - outroStart);
    const outroBlocks = [
      MotionBlockFactory.create(CustomBlockType.DISSOLVE, {
        name: 'Graceful Decay Outro',
        duration: remainingTime,
        delay: 0,
        intensity: 0.8,
        priority: 1
      })
    ];
    this.segments.push({
      name: 'Outro',
      startTime: outroStart,
      duration: remainingTime,
      blocks: outroBlocks
    });

    return this.segments;
  }
}
