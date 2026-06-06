export interface FrameGraphNode {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
  executionTimeMs: number;
  status: 'pending' | 'executing' | 'completed' | 'skipped';
  vramMappedBytes: number;
}

export class FrameGraph {
  private nodes: FrameGraphNode[] = [];
  private order: string[] = [];

  constructor() {
    this.resetWithDefaults();
  }

  public resetWithDefaults() {
    this.nodes = [];
    this.addNode({
      id: 'depth-prepass',
      name: 'Geometric Depth Prepass',
      inputs: [],
      outputs: ['depth-buffer'],
      executionTimeMs: 0.12,
      status: 'pending',
      vramMappedBytes: 1920 * 1080 * 4
    });

    this.addNode({
      id: 'g-buffer',
      name: 'Metallic G-Buffer Pass',
      inputs: ['depth-buffer'],
      outputs: ['normals', 'materials', 'albedo-color'],
      executionTimeMs: 0.35,
      status: 'pending',
      vramMappedBytes: 1920 * 1080 * 12
    });

    this.addNode({
      id: 'deferred-lighting',
      name: 'Physically-Based Lighting Resolver',
      inputs: ['normals', 'materials', 'albedo-color'],
      outputs: ['hdr-frame'],
      executionTimeMs: 0.45,
      status: 'pending',
      vramMappedBytes: 1920 * 1080 * 8
    });

    this.addNode({
      id: 'bloom-extract',
      name: 'HDR Luma Downsampler',
      inputs: ['hdr-frame'],
      outputs: ['luma-pyramid'],
      executionTimeMs: 0.18,
      status: 'pending',
      vramMappedBytes: 960 * 540 * 4
    });

    this.addNode({
      id: 'bloom-blur',
      name: 'Dual-Kawase Gaussian Blur',
      inputs: ['luma-pyramid'],
      outputs: ['blurred-glow'],
      executionTimeMs: 0.22,
      status: 'pending',
      vramMappedBytes: 960 * 540 * 4
    });

    this.addNode({
      id: 'composite-filter',
      name: 'UI Color Compositor & CRT Filter',
      inputs: ['hdr-frame', 'blurred-glow'],
      outputs: ['back-buffer'],
      executionTimeMs: 0.29,
      status: 'pending',
      vramMappedBytes: 1920 * 1080 * 4
    });

    this.compile();
  }

  public addNode(node: FrameGraphNode) {
    this.nodes.push(node);
  }

  public getNodes(): FrameGraphNode[] {
    return this.nodes;
  }

  public getOrder(): string[] {
    return this.order;
  }

  public compile() {
    // Topological sort (simulated dependency resolution)
    const visited = new Set<string>();
    const temp = new Set<string>();
    const order: string[] = [];

    const visit = (nodeId: string) => {
      if (temp.has(nodeId)) throw new Error('Cyclic dependency discovered in shader frame graph!');
      if (!visited.has(nodeId)) {
        temp.add(nodeId);
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
          // Find dependecies
          node.inputs.forEach(input => {
            const supplierNode = this.nodes.find(n => n.outputs.includes(input));
            if (supplierNode) visit(supplierNode.id);
          });
        }
        temp.delete(nodeId);
        visited.add(nodeId);
        order.push(nodeId);
      }
    };

    this.nodes.forEach(node => visit(node.id));
    this.order = order;
  }

  public executeAll(): number {
    let totalTime = 0;
    this.nodes.forEach(node => {
      node.status = 'executing';
      totalTime += node.executionTimeMs;
      node.status = 'completed';
    });
    return totalTime;
  }
}
