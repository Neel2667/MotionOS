import { MotionDNA } from '../dna/MotionDNA';

export class MotionValidator {
  public validate(dna: MotionDNA): boolean {
    if (!dna.id || !dna.version) return false;
    if (!dna.motion_blocks) return false;
    if (!dna.timing || typeof dna.timing.duration !== 'number') return false;
    if (dna.timing.duration <= 0) return false;

    // Validate blocks
    for (const block of dna.motion_blocks) {
      if (!block.id || !block.type) return false;
      if (typeof block.duration !== 'number' || block.duration < 0) return false;
      // Dependency cycle check would go here logically
    }

    // Validate Camera
    if (dna.camera && typeof dna.camera !== 'object') return false;

    return true;
  }
}
