import { v4 as uuidv4 } from 'uuid';

export class MotionConnection {
  public id: string = uuidv4();
  public sourceNodeId: string;
  public sourceOutputId: string;
  public targetNodeId: string;
  public targetInputId: string;

  constructor(sourceNodeId: string, sourceOutputId: string, targetNodeId: string, targetInputId: string) {
    this.sourceNodeId = sourceNodeId;
    this.sourceOutputId = sourceOutputId;
    this.targetNodeId = targetNodeId;
    this.targetInputId = targetInputId;
  }

  serialize(): any {
    return {
      id: this.id,
      sourceNodeId: this.sourceNodeId,
      sourceOutputId: this.sourceOutputId,
      targetNodeId: this.targetNodeId,
      targetInputId: this.targetInputId
    };
  }

  deserialize(data: any) {
    this.id = data.id;
    this.sourceNodeId = data.sourceNodeId;
    this.sourceOutputId = data.sourceOutputId;
    this.targetNodeId = data.targetNodeId;
    this.targetInputId = data.targetInputId;
  }
}
