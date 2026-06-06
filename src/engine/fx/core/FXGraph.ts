import { v4 as uuidv4 } from 'uuid';

export class FXNode {
  public id: string = uuidv4();
  public type: string;
  public parameters: Record<string, any> = {};
  public inputs: string[] = [];
  public outputs: string[] = [];

  constructor(type: string, parameters: Record<string, any> = {}) {
    this.type = type;
    this.parameters = parameters;
  }
}

export class FXGraph {
  public id: string = uuidv4();
  public nodes: Map<string, FXNode> = new Map();
  public rootNodeId: string | null = null;

  addNode(node: FXNode) {
    this.nodes.set(node.id, node);
  }
}

export class FXRegistry {
  private graphs: Map<string, FXGraph> = new Map();
  register(graph: FXGraph) { this.graphs.set(graph.id, graph); }
  get(id: string) { return this.graphs.get(id); }
}

export class FXCompiler {
  compile(graph: FXGraph): any {
    // Topologically sort nodes, validate parameters, and output GPU-ready shader chunks or VM instructions
    return { compiledGraphId: graph.id };
  }
}

export class FXExecutor {
  execute(compiledGraph: any, context: any) {
    // Apply compiled FX graph onto the render target / execution buffer
  }
}
