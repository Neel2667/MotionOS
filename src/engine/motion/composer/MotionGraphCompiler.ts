import { MotionGraph } from '../core/MotionGraph';
import { MotionCompiler, CompilationResult } from '../compiler/MotionCompiler';

export interface CompilationMetrics {
  totalNodes: number;
  totalEdges: number;
  compilationTimeMs: number;
  estimatedRenderCost: number; // calculated Gflops/polygon overhead
  success: boolean;
  errors: string[];
}

export class MotionGraphCompiler {
  private baseCompiler = new MotionCompiler();

  compile(graph: MotionGraph): { result: CompilationResult, metrics: CompilationMetrics } {
    const startTimeStamp = performance.now();
    const result = this.baseCompiler.compile(graph);
    const endTimeStamp = performance.now();

    // Custom metrics evaluation
    let baseVertexCost = 0;
    for (const node of graph.nodes) {
      baseVertexCost += node.estimateCost ? node.estimateCost() : 1;
    }

    // Multiply cost by degree of connections representing depth overlays
    const estimatedRenderCost = Math.round((baseVertexCost * (1 + graph.connections.length * 0.15)) * 10) / 10;

    const metrics: CompilationMetrics = {
      totalNodes: graph.nodes.length,
      totalEdges: graph.connections.length,
      compilationTimeMs: Math.round((endTimeStamp - startTimeStamp) * 100) / 100,
      estimatedRenderCost,
      success: result.success,
      errors: result.errors
    };

    return {
      result,
      metrics
    };
  }
}
