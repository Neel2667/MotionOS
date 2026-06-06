import { MotionNode } from './MotionNode';
import { MotionConnection } from './MotionConnection';
import { MotionContext } from './MotionContext';

export class MotionGraph {
  public nodes: MotionNode[] = [];
  public connections: MotionConnection[] = [];

  addNode(node: MotionNode) {
    this.nodes.push(node);
  }

  removeNode(node: MotionNode) {
    this.nodes = this.nodes.filter(n => n.id !== node.id);
    this.connections = this.connections.filter(
      c => c.sourceNodeId !== node.id && c.targetNodeId !== node.id
    );
  }

  connect(sourceNodeId: string, sourceOutputId: string, targetNodeId: string, targetInputId: string) {
    const conn = new MotionConnection(sourceNodeId, sourceOutputId, targetNodeId, targetInputId);
    this.connections.push(conn);
    return conn;
  }

  disconnect(connectionId: string) {
    this.connections = this.connections.filter(c => c.id !== connectionId);
  }

  validate(): boolean {
    return true;
  }

  compile(): any {
    return { compiled: true, nodes: this.nodes.length, edges: this.connections.length };
  }

  execute(context: MotionContext) {
    for (const node of this.nodes) {
      if (node.enabled) {
        node.execute(context);
      }
    }
  }

  serializeHash(): string {
    return this.nodes.length + "_" + this.connections.length + "_" + this.nodes.map(n => n.id).join('');
  }

  serialize(): any {
    return {
      nodes: this.nodes.map(n => n.serialize()),
      connections: this.connections.map(c => c.serialize())
    };
  }

  deserialize(data: any, nodeFactory: (type: string) => MotionNode | null) {
    this.nodes = [];
    if (data.nodes) {
      for (const nData of data.nodes) {
        const node = nodeFactory(nData.type);
        if (node) {
          node.deserialize(nData);
          this.nodes.push(node);
        }
      }
    }
    
    this.connections = [];
    if (data.connections) {
      for (const cData of data.connections) {
        const conn = new MotionConnection('', '', '', '');
        conn.deserialize(cData);
        this.connections.push(conn);
      }
    }
  }
}
