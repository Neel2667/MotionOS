import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class TransformOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.TRANSFORM;
  }
  estimateCost() { return 8; }
}

export class OpComposeTransform extends TransformOpcode {
  constructor() { super('TRANS_COMPOSE', 'ComposeTransform'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpDecomposeTransform extends TransformOpcode {
  constructor() { super('TRANS_DECOMPOSE', 'DecomposeTransform'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpInterpolateTransform extends TransformOpcode {
  constructor() { super('TRANS_INTERPOLATE', 'InterpolateTransform'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpQuaternionMultiply extends TransformOpcode {
  constructor() { super('QUAT_MUL', 'QuaternionMultiply'); }
  execute(ctx: ExecutionContext, args: number[]) {
    // q1 * q2
    // args: out, q1, q2
    const q1x = ctx.registers[args[1]], q1y = ctx.registers[args[1]+1], q1z = ctx.registers[args[1]+2], q1w = ctx.registers[args[1]+3];
    const q2x = ctx.registers[args[2]], q2y = ctx.registers[args[2]+1], q2z = ctx.registers[args[2]+2], q2w = ctx.registers[args[2]+3];

    ctx.registers[args[0]] = q1x * q2w + q1y * q2z - q1z * q2y + q1w * q2x;
    ctx.registers[args[0]+1] = -q1x * q2z + q1y * q2w + q1z * q2x + q1w * q2y;
    ctx.registers[args[0]+2] = q1x * q2y - q1y * q2x + q1z * q2w + q1w * q2z;
    ctx.registers[args[0]+3] = -q1x * q2x - q1y * q2y - q1z * q2z + q1w * q2w;
  }
}

export class OpQuaternionNormalize extends TransformOpcode {
  constructor() { super('QUAT_NORMALIZE', 'QuaternionNormalize'); }
  estimateCost() { return 4; }
  execute(ctx: ExecutionContext, args: number[]) {
    const x = ctx.registers[args[1]], y = ctx.registers[args[1]+1], z = ctx.registers[args[1]+2], w = ctx.registers[args[1]+3];
    let l = Math.sqrt(x*x + y*y + z*z + w*w);
    if (l === 0) {
        ctx.registers[args[0]] = 0; ctx.registers[args[0]+1] = 0; ctx.registers[args[0]+2] = 0; ctx.registers[args[0]+3] = 1;
    } else {
        l = 1 / l;
        ctx.registers[args[0]] = x * l; ctx.registers[args[0]+1] = y * l; ctx.registers[args[0]+2] = z * l; ctx.registers[args[0]+3] = w * l;
    }
  }
}

export class OpQuaternionSlerp extends TransformOpcode {
  constructor() { super('QUAT_SLERP', 'QuaternionSlerp'); }
  estimateCost() { return 12; }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpEulerToQuaternion extends TransformOpcode {
  constructor() { super('EULER_TO_QUAT', 'EulerToQuaternion'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpQuaternionToEuler extends TransformOpcode {
  constructor() { super('QUAT_TO_EULER', 'QuaternionToEuler'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}
