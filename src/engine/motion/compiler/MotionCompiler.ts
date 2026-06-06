import { MotionGraph } from '../core/MotionGraph';
import { ExecutionPlan, Instruction, InstructionBuffer, CompilationCache } from './ExecutionPlan';
import { MotionNode } from '../core/MotionNode';

export class CompilationContext {
  public graph: MotionGraph;
  public instructions: Instruction[] = [];
  public errors: string[] = [];
  public warnings: string[] = [];

  constructor(graph: MotionGraph) {
    this.graph = graph;
  }
}

export class CompilationResult {
  public plan: ExecutionPlan | null = null;
  public success: boolean = false;
  public errors: string[] = [];
  public warnings: string[] = [];
}

export abstract class CompilerPass {
  abstract execute(context: CompilationContext): boolean;
}

export class ValidationPass extends CompilerPass {
  execute(context: CompilationContext): boolean {
    const graph = context.graph;
    const nodeIds = new Set<string>();
    
    for (const node of graph.nodes) {
      if (nodeIds.has(node.id)) {
        context.errors.push(`Duplicate ID detected: ${node.id}`);
        return false;
      }
      nodeIds.add(node.id);
    }

    const visited = new Set<string>();
    const stack = new Set<string>();
    
    const hasCycle = (nodeId: string): boolean => {
      if (stack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      stack.add(nodeId);
      
      const outgoing = graph.connections.filter(c => c.sourceNodeId === nodeId);
      for (const conn of outgoing) {
        if (hasCycle(conn.targetNodeId)) return true;
      }
      
      stack.delete(nodeId);
      return false;
    };

    for (const node of graph.nodes) {
      if (hasCycle(node.id)) {
        context.errors.push(`Cycle detected at node: ${node.id}`);
        return false;
      }
    }

    return true;
  }
}

export class DependencyResolver extends CompilerPass {
  execute(context: CompilationContext): boolean {
    const graph = context.graph;
    const sorted: MotionNode[] = [];
    const visited = new Set<string>();
    const tempMark = new Set<string>();
    
    const visit = (node: MotionNode) => {
      if (tempMark.has(node.id)) return;
      if (!visited.has(node.id)) {
        tempMark.add(node.id);
        const incoming = graph.connections.filter(c => c.targetNodeId === node.id);
        for (const conn of incoming) {
          const sourceNode = graph.nodes.find(n => n.id === conn.sourceNodeId);
          if (sourceNode) visit(sourceNode);
        }
        tempMark.delete(node.id);
        visited.add(node.id);
        sorted.push(node);
      }
    };
    
    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        visit(node);
      }
    }
    
    context.instructions = sorted.map(node => {
      const inst = new Instruction(node.type, node.id);
      inst.inputs = node.inputs.map(i => i.id);
      inst.outputs = node.outputs.map(o => o.id);
      inst.estimatedCost = node.estimateCost ? node.estimateCost() : 1;
      
      const incoming = graph.connections.filter(c => c.targetNodeId === node.id);
      inst.dependencies = incoming.map(c => c.sourceNodeId);
      return inst;
    });
    
    return true;
  }
}

export class OptimizationPass extends CompilerPass {
  execute(context: CompilationContext): boolean {
    context.instructions = context.instructions.filter(inst => {
      return true; // Keep all nodes alive for MVP
    });
    return true;
  }
}

export class ExecutionPlanner extends CompilerPass {
  public plan: ExecutionPlan = new ExecutionPlan();
  
  execute(context: CompilationContext): boolean {
    const buffer = new InstructionBuffer();
    let totalCost = 0;
    
    for (const inst of context.instructions) {
      buffer.add(inst);
      totalCost += inst.estimatedCost;
    }
    
    this.plan.buffer = buffer;
    this.plan.estimatedTotalCost = totalCost;
    this.plan.compiledAt = Date.now();
    return true;
  }
}

export class MotionCompiler {
  private cache: CompilationCache = new CompilationCache();

  compile(graph: MotionGraph): CompilationResult {
    const result = new CompilationResult();
    const hash = graph.serializeHash ? graph.serializeHash() : graph.nodes.length.toString();
    
    if (this.cache.isValid(hash)) {
      result.plan = this.cache.plan;
      result.success = true;
      return result;
    }

    const context = new CompilationContext(graph);
    
    const passes: CompilerPass[] = [
      new ValidationPass(),
      new DependencyResolver(),
      new OptimizationPass()
    ];

    for (const pass of passes) {
      if (!pass.execute(context)) {
        result.errors = context.errors;
        result.success = false;
        return result;
      }
    }

    const planner = new ExecutionPlanner();
    if (planner.execute(context)) {
      result.plan = planner.plan;
      result.success = true;
      
      this.cache.plan = result.plan;
      this.cache.graphHash = hash;
    }

    return result;
  }
}
