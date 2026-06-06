import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class VectorOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.VECTOR;
  }
  estimateCost() { return 2; }
}

export class OpVec2Add extends VectorOpcode {
  constructor() { super('VEC2_ADD', 'VEC2_ADD'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] + ctx.registers[args[3]];
    ctx.registers[args[0] + 1] = ctx.registers[args[1] + 1] + ctx.registers[args[3] + 1];
  }
}

export class OpVec3Add extends VectorOpcode {
  constructor() { super('VEC3_ADD', 'VEC3_ADD'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] + ctx.registers[args[2]];
    ctx.registers[args[0] + 1] = ctx.registers[args[1] + 1] + ctx.registers[args[2] + 1];
    ctx.registers[args[0] + 2] = ctx.registers[args[1] + 2] + ctx.registers[args[2] + 2];
  }
}

export class OpVec4Add extends VectorOpcode {
  constructor() { super('VEC4_ADD', 'VEC4_ADD'); }
  execute(ctx: ExecutionContext, args: number[]) {
    for (let i=0; i<4; i++) ctx.registers[args[0] + i] = ctx.registers[args[1] + i] + ctx.registers[args[2] + i];
  }
}

export class OpVec2Sub extends VectorOpcode {
  constructor() { super('VEC2_SUB', 'VEC2_SUB'); }
  execute(ctx: ExecutionContext, args: number[]) {
    for (let i=0; i<2; i++) ctx.registers[args[0] + i] = ctx.registers[args[1] + i] - ctx.registers[args[2] + i];
  }
}

export class OpVec3Sub extends VectorOpcode {
  constructor() { super('VEC3_SUB', 'VEC3_SUB'); }
  execute(ctx: ExecutionContext, args: number[]) {
    for (let i=0; i<3; i++) ctx.registers[args[0] + i] = ctx.registers[args[1] + i] - ctx.registers[args[2] + i];
  }
}

export class OpVec4Sub extends VectorOpcode {
  constructor() { super('VEC4_SUB', 'VEC4_SUB'); }
  execute(ctx: ExecutionContext, args: number[]) {
    for (let i=0; i<4; i++) ctx.registers[args[0] + i] = ctx.registers[args[1] + i] - ctx.registers[args[2] + i];
  }
}

export class OpDot extends VectorOpcode {
  constructor() { super('VEC_DOT', 'DOT'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const dim = args[3]; 
    let sum = 0;
    for (let i=0; i<dim; i++) sum += ctx.registers[args[1] + i] * ctx.registers[args[2] + i];
    ctx.registers[args[0]] = sum;
  }
}

export class OpCross extends VectorOpcode {
  constructor() { super('VEC3_CROSS', 'CROSS'); } // specialized for vec3
  execute(ctx: ExecutionContext, args: number[]) {
    const ax = ctx.registers[args[1]]; const ay = ctx.registers[args[1]+1]; const az = ctx.registers[args[1]+2];
    const bx = ctx.registers[args[2]]; const by = ctx.registers[args[2]+1]; const bz = ctx.registers[args[2]+2];
    ctx.registers[args[0]] = ay * bz - az * by;
    ctx.registers[args[0]+1] = az * bx - ax * bz;
    ctx.registers[args[0]+2] = ax * by - ay * bx;
  }
}

export class OpNormalize extends VectorOpcode {
  constructor() { super('VEC_NORMALIZE', 'NORMALIZE'); }
  estimateCost() { return 3; }
  execute(ctx: ExecutionContext, args: number[]) {
    const dim = args[2];
    let lenSq = 0;
    for (let i=0; i<dim; i++) lenSq += ctx.registers[args[1] + i] ** 2;
    const len = lenSq > 0 ? Math.sqrt(lenSq) : 1;
    for (let i=0; i<dim; i++) ctx.registers[args[0] + i] = ctx.registers[args[1] + i] / len;
  }
}

export class OpLength extends VectorOpcode {
  constructor() { super('VEC_LENGTH', 'LENGTH'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const dim = args[2];
    let lenSq = 0;
    for (let i=0; i<dim; i++) lenSq += ctx.registers[args[1] + i] ** 2;
    ctx.registers[args[0]] = Math.sqrt(lenSq);
  }
}

export class OpDistance extends VectorOpcode {
  constructor() { super('VEC_DISTANCE', 'DISTANCE'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const dim = args[3];
    let distSq = 0;
    for (let i=0; i<dim; i++) distSq += (ctx.registers[args[1] + i] - ctx.registers[args[2] + i]) ** 2;
    ctx.registers[args[0]] = Math.sqrt(distSq);
  }
}

export class OpProject extends VectorOpcode {
  constructor() { super('VEC_PROJECT', 'PROJECT'); }
  estimateCost() { return 4; }
  execute(ctx: ExecutionContext, args: number[]) {
    // Project vector A (args[1]) onto B (args[2]), dimension args[3]
    const dim = args[3];
    let dotAB = 0;
    let dotBB = 0;
    for(let i=0; i<dim; i++) {
        dotAB += ctx.registers[args[1]+i] * ctx.registers[args[2]+i];
        dotBB += ctx.registers[args[2]+i] * ctx.registers[args[2]+i];
    }
    const scale = dotBB !== 0 ? dotAB / dotBB : 0;
    for(let i=0; i<dim; i++) {
        ctx.registers[args[0]+i] = ctx.registers[args[2]+i] * scale;
    }
  }
}

export class OpReflect extends VectorOpcode {
  constructor() { super('VEC_REFLECT', 'REFLECT'); }
  estimateCost() { return 4; }
  execute(ctx: ExecutionContext, args: number[]) {
    // I (args[1]), N (args[2]), dim args[3]
    // I - 2.0 * dot(N, I) * N
    const dim = args[3];
    let dotNI = 0;
    for(let i=0; i<dim; i++) {
        dotNI += ctx.registers[args[2]+i] * ctx.registers[args[1]+i];
    }
    const scale = 2.0 * dotNI;
    for(let i=0; i<dim; i++) {
        ctx.registers[args[0]+i] = ctx.registers[args[1]+i] - scale * ctx.registers[args[2]+i];
    }
  }
}
