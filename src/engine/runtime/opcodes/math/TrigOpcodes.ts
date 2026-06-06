import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class TrigOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.TRIGONOMETRY;
  }
  estimateCost() { return 2; }
}

export class OpSin extends TrigOpcode {
  constructor() { super('TRIG_SIN', 'SIN'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.sin(ctx.registers[args[1]]);
  }
}

export class OpCos extends TrigOpcode {
  constructor() { super('TRIG_COS', 'COS'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.cos(ctx.registers[args[1]]);
  }
}

export class OpTan extends TrigOpcode {
  constructor() { super('TRIG_TAN', 'TAN'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.tan(ctx.registers[args[1]]);
  }
}

export class OpAsin extends TrigOpcode {
  constructor() { super('TRIG_ASIN', 'ASIN'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.asin(ctx.registers[args[1]]);
  }
}

export class OpAcos extends TrigOpcode {
  constructor() { super('TRIG_ACOS', 'ACOS'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.acos(ctx.registers[args[1]]);
  }
}

export class OpAtan extends TrigOpcode {
  constructor() { super('TRIG_ATAN', 'ATAN'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.atan(ctx.registers[args[1]]);
  }
}

export class OpAtan2 extends TrigOpcode {
  constructor() { super('TRIG_ATAN2', 'ATAN2'); }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = Math.atan2(ctx.registers[args[1]], ctx.registers[args[2]]);
  }
}

export class OpRadians extends TrigOpcode {
  constructor() { super('TRIG_RADIANS', 'RADIANS'); }
  estimateCost() { return 1; }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] * (Math.PI / 180);
  }
}

export class OpDegrees extends TrigOpcode {
  constructor() { super('TRIG_DEGREES', 'DEGREES'); }
  estimateCost() { return 1; }
  execute(ctx: ExecutionContext, args: number[]) {
    ctx.registers[args[0]] = ctx.registers[args[1]] * (180 / Math.PI);
  }
}
