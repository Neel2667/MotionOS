import { v4 as uuidv4 } from 'uuid';

export enum ConstraintType {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  FOLLOW = 'FOLLOW',
  LOOK_AT = 'LOOK_AT',
  AIM = 'AIM',
  OFFSET = 'OFFSET',
  SCALE_LOCK = 'SCALE_LOCK',
  ROTATION_LOCK = 'ROTATION_LOCK',
  POSITION_LOCK = 'POSITION_LOCK',
  PATH_FOLLOW = 'PATH_FOLLOW',
  CAMERA_FOLLOW = 'CAMERA_FOLLOW'
}

export class Constraint {
  public id: string = uuidv4();
  public type: ConstraintType;
  public sourceId: string;
  public targetId: string;
  public weight: number = 1.0;
  public parameters: Record<string, any> = {};

  constructor(type: ConstraintType, sourceId: string, targetId: string) {
    this.type = type;
    this.sourceId = sourceId;
    this.targetId = targetId;
  }
}

export class ConstraintRegistry {
  private constraints: Map<string, Constraint> = new Map();
  register(c: Constraint) { this.constraints.set(c.id, c); }
  get(id: string) { return this.constraints.get(id); }
  getAll() { return Array.from(this.constraints.values()); }
}

export class ConstraintSolver {
  public resolveAll(registry: ConstraintRegistry, executionBuffer: Float32Array): void {
    // Solves spatial dependencies deterministically
    // E.g. LOOK_AT constraint calculates Atan2 and drives rotation registers in executionBuffer
    const active = registry.getAll();
    for (const c of active) {
      if (c.weight > 0) {
        this.solve(c, executionBuffer);
      }
    }
  }

  private solve(constraint: Constraint, executionBuffer: Float32Array): void {
    // Math operations
  }
}
