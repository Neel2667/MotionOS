import { v4 as uuidv4 } from 'uuid';

export class Instruction {
  public id: string = uuidv4();
  public opcode: string;
  public inputs: string[] = []; // Pin IDs
  public outputs: string[] = []; // Pin IDs
  public dependencies: string[] = []; // Instruction IDs
  public estimatedCost: number = 1;
  public nodeId: string; // The motion node this instruction maps to

  constructor(opcode: string, nodeId: string) {
    this.opcode = opcode;
    this.nodeId = nodeId;
  }
}

export class InstructionBuffer {
  public instructions: Instruction[] = [];
  
  add(instruction: Instruction) {
    this.instructions.push(instruction);
  }
}

export class ExecutionPlan {
  public id: string = uuidv4();
  public buffer: InstructionBuffer = new InstructionBuffer();
  public compiledAt: number = Date.now();
  public estimatedTotalCost: number = 0;
  
  serialize(): any {
    return {
      id: this.id,
      compiledAt: this.compiledAt,
      estimatedTotalCost: this.estimatedTotalCost,
      instructions: this.buffer.instructions.map(i => ({...i}))
    };
  }
}

export class CompilationCache {
  public plan: ExecutionPlan | null = null;
  public graphHash: string = '';

  isValid(currentHash: string): boolean {
    return this.plan !== null && this.graphHash === currentHash;
  }
}
