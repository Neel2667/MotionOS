import { Opcode } from './Opcode';
import { ExecutionContext } from '../vm/RuntimeState';

export class OpSetObject extends Opcode {
  constructor() { super('OBJ_SET', 'SET_OBJECT'); }
  execute(ctx: ExecutionContext, args: any[]) {
    // args: [objHandle, property, value]
  }
}

export class OpTranslate extends Opcode {
  constructor() { super('TRANS', 'TRANSLATE'); }
  estimateCost() { return 2; }
  execute(ctx: ExecutionContext, args: any[]) {
    // Math logic using Float buffers if possible
  }
}

export class OpRotate extends Opcode {
  constructor() { super('ROT', 'ROTATE'); }
  estimateCost() { return 2; }
  execute(ctx: ExecutionContext, args: any[]) {
    // args setup
  }
}

export class OpScale extends Opcode {
  constructor() { super('SCL', 'SCALE'); }
  estimateCost() { return 2; }
  execute(ctx: ExecutionContext, args: any[]) {}
}

export class OpLoadObject extends Opcode {
  constructor() { super('LDOBJ', 'LOAD_OBJECT'); }
  execute(ctx: ExecutionContext, args: any[]) {}
}

export class OpBeginScope extends Opcode {
  constructor() { super('BSCOPE', 'BEGIN_SCOPE'); }
  execute(ctx: ExecutionContext, args: any[]) {}
}

export class OpEndScope extends Opcode {
  constructor() { super('ESCOPE', 'END_SCOPE'); }
  execute(ctx: ExecutionContext, args: any[]) {}
}

export class OpNop extends Opcode {
  constructor() { super('NOP', 'NOP'); }
  estimateCost() { return 0; }
  execute(ctx: ExecutionContext, args: any[]) {}
}
