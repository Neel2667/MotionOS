import { MotionBlockType, MotionBlockConfig } from '../../ai/dna/MotionBlocks';

export class MotionAssembler {
  // Converts high level block assemblies into discrete sequences
  public static assemble(assemblyPreset: string): MotionBlockConfig[] {
    switch (assemblyPreset) {
      case 'LUXURY_REVEAL':
        return [
          { id: '1', type: MotionBlockType.FADE, duration: 2.0, delay: 0.0, parameters: { to: 1.0 } },
          { id: '2', type: MotionBlockType.SCALE, duration: 3.0, delay: 0.0, parameters: { from: 0.9, to: 1.0 }, dependencies: ['1'] },
          { id: '3', type: MotionBlockType.ORBIT, duration: 4.0, delay: 1.0, parameters: { radius: 5 } },
          { id: '4', type: MotionBlockType.GLOW, duration: 2.0, delay: 2.0, parameters: { intensity: 1.5 } },
          { id: '5', type: MotionBlockType.HOLD, duration: 2.0, delay: 4.0, parameters: {} },
          { id: '6', type: MotionBlockType.FADE, duration: 1.5, delay: 6.0, parameters: { to: 0.0 } }
        ];
      case 'SPORTS_REVEAL':
        return [
          { id: '1', type: MotionBlockType.EXPLODE, duration: 0.5, delay: 0.0, parameters: { intensity: 10 } },
          { id: '2', type: MotionBlockType.ASSEMBLE, duration: 0.5, delay: 0.5, parameters: {} },
          { id: '3', type: MotionBlockType.FLASH, duration: 0.1, delay: 1.0, parameters: { color: '#ffffff' } },
          { id: '4', type: MotionBlockType.HOLD, duration: 1.0, delay: 1.1, parameters: {} },
          { id: '5', type: MotionBlockType.EXIT, duration: 0.3, delay: 2.1, parameters: { direction: 'LEFT' } }
        ];
      default:
        return [];
    }
  }
}
