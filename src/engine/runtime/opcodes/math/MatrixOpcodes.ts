import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class MatrixOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.MATRIX;
    this.canVectorize = () => true;
  }
  estimateCost() { return 4; }
}

export class OpMatMul extends MatrixOpcode {
  constructor() { super('MAT_MUL', 'MAT_MUL'); }
  estimateCost() { return 16; }
  execute(ctx: ExecutionContext, args: number[]) {
    // 4x4 matrix multiplication args[0] = args[1] * args[2]
    // Matrices stored column-major, 16 floats
    const out = args[0]; const a = args[1]; const b = args[2];
    const r = ctx.registers;
    
    const a00 = r[a], a01 = r[a+4], a02 = r[a+8], a03 = r[a+12];
    const a10 = r[a+1], a11 = r[a+5], a12 = r[a+9], a13 = r[a+13];
    const a20 = r[a+2], a21 = r[a+6], a22 = r[a+10], a23 = r[a+14];
    const a30 = r[a+3], a31 = r[a+7], a32 = r[a+11], a33 = r[a+15];

    let b0 = r[b], b1 = r[b+1], b2 = r[b+2], b3 = r[b+3];
    r[out] = b0*a00 + b1*a01 + b2*a02 + b3*a03;
    r[out+1] = b0*a10 + b1*a11 + b2*a12 + b3*a13;
    r[out+2] = b0*a20 + b1*a21 + b2*a22 + b3*a23;
    r[out+3] = b0*a30 + b1*a31 + b2*a32 + b3*a33;

    b0 = r[b+4]; b1 = r[b+5]; b2 = r[b+6]; b3 = r[b+7];
    r[out+4] = b0*a00 + b1*a01 + b2*a02 + b3*a03;
    r[out+5] = b0*a10 + b1*a11 + b2*a12 + b3*a13;
    r[out+6] = b0*a20 + b1*a21 + b2*a22 + b3*a23;
    r[out+7] = b0*a30 + b1*a31 + b2*a32 + b3*a33;

    b0 = r[b+8]; b1 = r[b+9]; b2 = r[b+10]; b3 = r[b+11];
    r[out+8] = b0*a00 + b1*a01 + b2*a02 + b3*a03;
    r[out+9] = b0*a10 + b1*a11 + b2*a12 + b3*a13;
    r[out+10] = b0*a20 + b1*a21 + b2*a22 + b3*a23;
    r[out+11] = b0*a30 + b1*a31 + b2*a32 + b3*a33;

    b0 = r[b+12]; b1 = r[b+13]; b2 = r[b+14]; b3 = r[b+15];
    r[out+12] = b0*a00 + b1*a01 + b2*a02 + b3*a03;
    r[out+13] = b0*a10 + b1*a11 + b2*a12 + b3*a13;
    r[out+14] = b0*a20 + b1*a21 + b2*a22 + b3*a23;
    r[out+15] = b0*a30 + b1*a31 + b2*a32 + b3*a33;
  }
}

export class OpMatInv extends MatrixOpcode {
  constructor() { super('MAT_INV', 'MAT_INV'); }
  estimateCost() { return 32; }
  execute(ctx: ExecutionContext, args: number[]) {
    // Stub for 4x4 inverse
  }
}

export class OpMatTranspose extends MatrixOpcode {
  constructor() { super('MAT_TRANSPOSE', 'MAT_TRANSPOSE'); }
  estimateCost() { return 4; }
  execute(ctx: ExecutionContext, args: number[]) {
    // Stub
  }
}

export class OpMatScale extends MatrixOpcode {
  constructor() { super('MAT_SCALE', 'MAT_SCALE'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpMatRotate extends MatrixOpcode {
  constructor() { super('MAT_ROTATE', 'MAT_ROTATE'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpMatTranslate extends MatrixOpcode {
  constructor() { super('MAT_TRANSLATE', 'MAT_TRANSLATE'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpTransformPoint extends MatrixOpcode {
  constructor() { super('TRANSFORM_POINT', 'TRANSFORM_POINT'); }
  estimateCost() { return 4; }
  execute(ctx: ExecutionContext, args: number[]) {
    // Multiply 4x4 mat by vec3 (w=1)
  }
}

export class OpTransformVector extends MatrixOpcode {
  constructor() { super('TRANSFORM_VECTOR', 'TRANSFORM_VECTOR'); }
  estimateCost() { return 4; }
  execute(ctx: ExecutionContext, args: number[]) {
    // Multiply 4x4 mat by vec3 (w=0)
  }
}
