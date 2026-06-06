import { ExecutionPlan } from '../../motion/compiler/ExecutionPlan';
import { MemoryAllocator } from '../memory/MemoryAllocator';

export class ExecutionContext {
  public allocator: MemoryAllocator;
  public registers: Float32Array; // High-speed registers for instruction outputs
  public variables: Map<string, any>; // Object references, strings, complex data
  
  constructor() {
    this.allocator = new MemoryAllocator(1024 * 1024); // 1M floats
    this.registers = new Float32Array(1024); // 1024 generic float registers
    this.variables = new Map<string, any>();
  }
}

export class RuntimeState {
  public currentFrame: number = 0;
  public isRunning: boolean = false;
  public lastExecutionTimeMs: number = 0;
}

export class RuntimeStack {
  private stack: any[] = [];
  push(val: any) { this.stack.push(val); }
  pop(): any { return this.stack.pop(); }
  peek(): any { return this.stack[this.stack.length - 1]; }
}
