import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class CurveOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.CURVE;
  }
  estimateCost() { return 4; }
}

export class OpBezierCurve extends CurveOpcode {
  constructor() { super('CURVE_BEZIER', 'BezierCurve'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpSplineCurve extends CurveOpcode {
  constructor() { super('CURVE_SPLINE', 'SplineCurve'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpCatmullRom extends CurveOpcode {
  constructor() { super('CURVE_CATMULLROM', 'CatmullRom'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpHermite extends CurveOpcode {
  constructor() { super('CURVE_HERMITE', 'Hermite'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpEaseLinear extends CurveOpcode {
  constructor() { super('EASE_LINEAR', 'EaseLinear'); }
  estimateCost() { return 1; }
  execute(ctx: ExecutionContext, args: number[]) { ctx.registers[args[0]] = ctx.registers[args[1]]; }
}

export class OpEaseIn extends CurveOpcode {
  constructor() { super('EASE_IN', 'EaseIn'); }
  estimateCost() { return 1; }
  execute(ctx: ExecutionContext, args: number[]) {
    const t = ctx.registers[args[1]];
    ctx.registers[args[0]] = t * t;
  }
}

export class OpEaseOut extends CurveOpcode {
  constructor() { super('EASE_OUT', 'EaseOut'); }
  estimateCost() { return 1; }
  execute(ctx: ExecutionContext, args: number[]) {
    const t = ctx.registers[args[1]];
    ctx.registers[args[0]] = t * (2 - t);
  }
}

export class OpEaseInOut extends CurveOpcode {
  constructor() { super('EASE_INOUT', 'EaseInOut'); }
  estimateCost() { return 2; }
  execute(ctx: ExecutionContext, args: number[]) {
    let t = ctx.registers[args[1]];
    if ((t *= 2) < 1) {
        ctx.registers[args[0]] = 0.5 * t * t;
    } else {
        ctx.registers[args[0]] = -0.5 * (--t * (t - 2) - 1);
    }
  }
}

export class OpBounce extends CurveOpcode {
  constructor() { super('EASE_BOUNCE', 'Bounce'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpElastic extends CurveOpcode {
  constructor() { super('EASE_ELASTIC', 'Elastic'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpBack extends CurveOpcode {
  constructor() { super('EASE_BACK', 'Back'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpCustomCurve extends CurveOpcode {
  constructor() { super('CURVE_CUSTOM', 'CustomCurve'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}
