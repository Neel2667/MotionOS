import { v4 as uuidv4 } from 'uuid';

export enum PinType {
  Float = 'Float',
  Integer = 'Integer',
  Boolean = 'Boolean',
  Vector2 = 'Vector2',
  Vector3 = 'Vector3',
  Vector4 = 'Vector4',
  Color = 'Color',
  Matrix = 'Matrix',
  Transform = 'Transform',
  ObjectReference = 'ObjectReference',
  Custom = 'Custom'
}

export class Parameter {
  public id: string = uuidv4();
  constructor(public name: string, public type: PinType, public value: any) {}
}

export abstract class ParameterPin {
  public id: string = uuidv4();
  constructor(public name: string, public type: PinType, public nodeId: string) {}
}

export class InputPin extends ParameterPin {
  public connectionId: string | null = null;
  public defaultValue: any;
  constructor(name: string, type: PinType, nodeId: string, defaultValue?: any) {
    super(name, type, nodeId);
    this.defaultValue = defaultValue;
  }
}

export class OutputPin extends ParameterPin {
  public connections: string[] = []; // Connection IDs
}

export class Connection {
  public id: string = uuidv4();
  constructor(public sourceOutputId: string, public targetInputId: string) {}
}

export class ParameterResolver {
  resolve(pin: InputPin, connections: Connection[], outputs: Map<string, any>): any {
    if (pin.connectionId) {
      const conn = connections.find(c => c.id === pin.connectionId);
      if (conn && outputs.has(conn.sourceOutputId)) {
        return outputs.get(conn.sourceOutputId);
      }
    }
    return pin.defaultValue;
  }
}
