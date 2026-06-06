import { Opcode, OpcodeCategory } from '../Opcode';
import { ExecutionContext } from '../../vm/RuntimeState';

export abstract class NoiseOpcode extends Opcode {
  constructor(id: string, name: string) {
    super(id, name);
    this.category = OpcodeCategory.NOISE;
  }
  estimateCost() { return 8; }
}

export class OpValueNoise extends NoiseOpcode {
  constructor() { super('NOISE_VALUE', 'VALUE_NOISE'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpGradientNoise extends NoiseOpcode {
  constructor() { super('NOISE_GRADIENT', 'GRADIENT_NOISE'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpPerlin extends NoiseOpcode {
  constructor() { super('NOISE_PERLIN', 'PERLIN'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpSimplex extends NoiseOpcode {
  constructor() { super('NOISE_SIMPLEX', 'SIMPLEX'); }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpFBM extends NoiseOpcode {
  constructor() { super('NOISE_FBM', 'FBM'); }
  estimateCost() { return 16; }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpTurbulence extends NoiseOpcode {
  constructor() { super('NOISE_TURBULENCE', 'TURBULENCE'); }
  estimateCost() { return 16; }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpRidged extends NoiseOpcode {
  constructor() { super('NOISE_RIDGED', 'RIDGED'); }
  estimateCost() { return 16; }
  execute(ctx: ExecutionContext, args: number[]) {}
}

export class OpHashRandom extends NoiseOpcode {
  constructor() { super('NOISE_HASH_RANDOM', 'HASH_RANDOM'); }
  estimateCost() { return 2; }
  execute(ctx: ExecutionContext, args: number[]) {
    // Basic hash
    let x = ctx.registers[args[1]];
    x = Math.sin(x) * 43758.5453123;
    ctx.registers[args[0]] = x - Math.floor(x);
  }
}

export class OpSeedRandom extends NoiseOpcode {
  constructor() { super('NOISE_SEED_RANDOM', 'SEED_RANDOM'); }
  estimateCost() { return 2; }
  execute(ctx: ExecutionContext, args: number[]) {}
}
