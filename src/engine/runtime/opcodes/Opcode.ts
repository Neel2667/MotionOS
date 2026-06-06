import { ExecutionContext } from '../vm/RuntimeState';
import { v4 as uuidv4 } from 'uuid';

export enum OpcodeCategory {
  CORE = 'CORE',
  MATH = 'MATH',
  VECTOR = 'VECTOR',
  MATRIX = 'MATRIX',
  TRIGONOMETRY = 'TRIGONOMETRY',
  NOISE = 'NOISE',
  TRANSFORM = 'TRANSFORM',
  CURVE = 'CURVE',
  CUSTOM = 'CUSTOM'
}

export abstract class Opcode {
  public id: string;
  public name: string;
  public category: OpcodeCategory = OpcodeCategory.CUSTOM;
  public version: number = 1;
  public metadata: Record<string, any> = {};

  constructor(id: string, name: string = id) {
    this.id = id;
    this.name = name;
  }
  
  abstract execute(context: ExecutionContext, args: any[]): void;
  
  validate(args: any[]): boolean { return true; }
  estimateCost(): number { return 1; }
  estimateMemory(): number { return 0; }
  canCache(): boolean { return true; }
  canVectorize(): boolean { return false; }
  canParallelize(): boolean { return false; }
  
  serialize(): any { 
    return { 
      id: this.id, 
      name: this.name,
      category: this.category,
      version: this.version
    }; 
  }
  
  deserialize(data: any): void {
    if (data.version) this.version = data.version;
    if (data.metadata) this.metadata = data.metadata;
  }
}

export class OpcodeRegistry {
  private opcodes: Map<string, Opcode> = new Map();
  
  register(opcode: Opcode) { 
    this.opcodes.set(opcode.name, opcode); 
    this.opcodes.set(opcode.id, opcode);
  }
  
  get(nameOrId: string): Opcode | undefined { 
    return this.opcodes.get(nameOrId); 
  }
  
  getAll(): Opcode[] {
    // Return unique opcodes
    return Array.from(new Set(this.opcodes.values()));
  }
}
