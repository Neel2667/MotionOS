import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class MathOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.MATH;
  }
  canVectorize() { return true; }
}

export class OpAdd extends MathOpcode {
  constructor() { super('MATH_ADD', 'ADD'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] + ctx.registers[args[2]];
  }
}

export class OpSub extends MathOpcode {
  constructor() { super('MATH_SUB', 'SUB'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] - ctx.registers[args[2]];
  }
}

export class OpMul extends MathOpcode {
  constructor() { super('MATH_MUL', 'MUL'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] * ctx.registers[args[2]];
  }
}

export class OpDiv extends MathOpcode {
  constructor() { super('MATH_DIV', 'DIV'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] / ctx.registers[args[2]];
  }
}

export class OpMod extends MathOpcode {
  constructor() { super('MATH_MOD', 'MOD'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] % ctx.registers[args[2]];
  }
}

export class OpNeg extends MathOpcode {
  constructor() { super('MATH_NEG', 'NEG'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = -ctx.registers[args[1]];
  }
}

export class OpAbs extends MathOpcode {
  constructor() { super('MATH_ABS', 'ABS'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.abs(ctx.registers[args[1]]);
  }
}

export class OpMin extends MathOpcode {
  constructor() { super('MATH_MIN', 'MIN'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.min(ctx.registers[args[1]], ctx.registers[args[2]]);
  }
}

export class OpMax extends MathOpcode {
  constructor() { super('MATH_MAX', 'MAX'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.max(ctx.registers[args[1]], ctx.registers[args[2]]);
  }
}

export class OpClamp extends MathOpcode {
  constructor() { super('MATH_CLAMP', 'CLAMP'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const val = ctx.registers[args[1]];
    const min = ctx.registers[args[2]];
    const max = ctx.registers[args[3]];
    ctx.registers[args[0]] = Math.max(min, Math.min(max, val));
  }
}

export class OpLerp extends MathOpcode {
  constructor() { super('MATH_LERP', 'LERP'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const a = ctx.registers[args[1]];
    const b = ctx.registers[args[2]];
    const t = ctx.registers[args[3]];
    ctx.registers[args[0]] = a + t * (b - a);
  }
}

export class OpSmoothstep extends MathOpcode {
  constructor() { super('MATH_SMOOTHSTEP', 'SMOOTHSTEP'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const edge0 = ctx.registers[args[1]];
    const edge1 = ctx.registers[args[2]];
    let x = ctx.registers[args[3]];
    x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    ctx.registers[args[0]] = x * x * (3 - 2 * x);
  }
}

export class OpStep extends MathOpcode {
  constructor() { super('MATH_STEP', 'STEP'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const edge = ctx.registers[args[1]];
    const x = ctx.registers[args[2]];
    ctx.registers[args[0]] = x < edge ? 0 : 1;
  }
}

export class OpFloor extends MathOpcode {
  constructor() { super('MATH_FLOOR', 'FLOOR'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.floor(ctx.registers[args[1]]);
  }
}

export class OpCeil extends MathOpcode {
  constructor() { super('MATH_CEIL', 'CEIL'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.ceil(ctx.registers[args[1]]);
  }
}

export class OpRound extends MathOpcode {
  constructor() { super('MATH_ROUND', 'ROUND'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.round(ctx.registers[args[1]]);
  }
}

export class OpFract extends MathOpcode {
  constructor() { super('MATH_FRACT', 'FRACT'); }
  execute(ctx: ExecutionContext, args: number[]) {
    const x = ctx.registers[args[1]];
    ctx.registers[args[0]] = x - Math.floor(x);
  }
}

export class OpSign extends MathOpcode {
  constructor() { super('MATH_SIGN', 'SIGN'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.sign(ctx.registers[args[1]]);
  }
}

export class OpSaturate extends MathOpcode {
  constructor() { super('MATH_SATURATE', 'SATURATE'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.max(0, Math.min(1, ctx.registers[args[1]]));
  }
}
