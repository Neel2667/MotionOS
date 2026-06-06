import { v4 as uuidv4 } from 'uuid';
import { MotionContext } from './MotionContext';

export interface MotionPort {
  id: string;
  name: string;
  type: string;
  value?: any;
}

export abstract class MotionNode {
  public id: string = uuidv4();
  public name: string = 'MotionNode';
  public inputs: MotionPort[] = [];
  public outputs: MotionPort[] = [];
  public parameters: Record<string, any> = {};
  public enabled: boolean = true;
  public type: string = 'MotionNode';

  constructor(name?: string) {
    if (name) this.name = name;
  }

  abstract execute(context: MotionContext): void;

  estimateMemory(): number { return 1024; }
  estimateCost(): number { return 1; }
  estimateExecutionTime(): number { return 0.1; }
  canCache(): boolean { return true; }
  canParallelize(): boolean { return true; }

  serialize(): any {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      parameters: this.parameters,
      enabled: this.enabled
    };
  }

  deserialize(data: any): void {
    if (data.id) this.id = data.id;
    if (data.name) this.name = data.name;
    if (data.parameters) this.parameters = { ...data.parameters };
    if (data.enabled !== undefined) this.enabled = data.enabled;
  }
}
