import { ExecutionPlan, Instruction } from '../../motion/compiler/ExecutionPlan';
import { CoreOpcodeRegistries } from '../opcodes/Registries';
import { ExecutionContext, RuntimeState } from './RuntimeState';

export class InstructionPointer {
  public position: number = 0;
  
  advance() { this.position++; }
  jump(addr: number) { this.position = addr; }
  reset() { this.position = 0; }
}

export class ExecutionBuffer {
  public instructions: any[] = [];
  get length() { return this.instructions.length; }
}

export class InstructionDecoder {
  public registries: CoreOpcodeRegistries = new CoreOpcodeRegistries();

  decode(instruction: Instruction): any {
    const opcode = this.registries.get(instruction.opcode);
    // Decodes generic compiler instruction to VM executable
    return {
      opcode: opcode || null, // fallback logic to be handled by executor or compiler
      args: [...instruction.inputs]
    };
  }
}

export class ExecutionFrame {
  public buffer: ExecutionBuffer = new ExecutionBuffer();
  public ip: InstructionPointer = new InstructionPointer();
  public parent: ExecutionFrame | null = null;
}

export class ExecutionStack {
  private frames: ExecutionFrame[] = [];
  
  push(frame: ExecutionFrame) { this.frames.push(frame); }
  pop(): ExecutionFrame | undefined { return this.frames.pop(); }
  peek(): ExecutionFrame | undefined { return this.frames[this.frames.length - 1]; }
  get isEmpty() { return this.frames.length === 0; }
}

export class ExecutionStatistics {
  public totalInstructionsExecuted: number = 0;
  public totalVMUptimeMs: number = 0;
  public costThisFrame: number = 0;
}

export class ExecutionResult {
  public success: boolean = true;
  public error: Error | null = null;
  public instructionsExecuted: number = 0;
}

export class ExecutionSession {
  public id: string = crypto.randomUUID();
  public startTime: number = performance.now();
}

export class InstructionExecutor {
  public context: ExecutionContext;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  executeNext(frame: ExecutionFrame, stats: ExecutionStatistics): boolean {
    if (frame.ip.position >= frame.buffer.length) return false;
    
    const inst = frame.buffer.instructions[frame.ip.position];
    if (inst.opcode) {
      inst.opcode.execute(this.context, inst.args);
      stats.totalInstructionsExecuted++;
      stats.costThisFrame += inst.opcode.estimateCost ? inst.opcode.estimateCost() : 1;
    }
    
    frame.ip.advance();
    return true;
  }
}

export class RuntimeVM {
  public state: RuntimeState = new RuntimeState();
  public context: ExecutionContext = new ExecutionContext();
  public decoder: InstructionDecoder = new InstructionDecoder();
  public executor: InstructionExecutor;
  public stack: ExecutionStack = new ExecutionStack();
  public stats: ExecutionStatistics = new ExecutionStatistics();
  public session: ExecutionSession | null = null;

  constructor() {
    this.executor = new InstructionExecutor(this.context);
  }

  execute(plan: ExecutionPlan): ExecutionResult {
    const result = new ExecutionResult();
    const start = performance.now();
    this.session = new ExecutionSession();
    
    const frame = new ExecutionFrame();
    
    // Decode
    for (const inst of plan.buffer.instructions) {
      frame.buffer.instructions.push(this.decoder.decode(inst));
    }

    this.stack.push(frame);
    this.stats.costThisFrame = 0;

    // Execute
    try {
      let activeFrame = this.stack.peek();
      while(activeFrame) {
        const canContinue = this.executor.executeNext(activeFrame, this.stats);
        result.instructionsExecuted++;
        if (!canContinue) {
          this.stack.pop();
          activeFrame = this.stack.peek();
        }
      }
    } catch (e: any) {
      result.success = false;
      result.error = e;
    }
    
    this.state.lastExecutionTimeMs = performance.now() - start;
    this.stats.totalVMUptimeMs += this.state.lastExecutionTimeMs;
    return result;
  }
}
