import { MotionGraph } from './MotionGraph';
import { MotionContext } from './MotionContext';
import { MotionCompiler } from '../compiler/MotionCompiler';
import { ExecutionPlan } from '../compiler/ExecutionPlan';
import { RuntimeVM } from '../../runtime/vm/RuntimeVM';
import { globalProfiler } from '../../profiler/Profiler';

export class MotionExecutor {
  public graph: MotionGraph;
  private compiler: MotionCompiler;
  private activePlan: ExecutionPlan | null = null;
  public runtimeVM: RuntimeVM | null = null;

  constructor(graph: MotionGraph) {
    this.graph = graph;
    this.compiler = new MotionCompiler();
  }

  update(context: MotionContext) {
    if (!this.activePlan) {
      const compileStart = performance.now();
      const result = this.compiler.compile(this.graph);
      globalProfiler.compilation.compileTime.record(performance.now() - compileStart);
      
      if (result.success && result.plan) {
        this.activePlan = result.plan;
      } else {
        console.error("MotionGraph Compilation failed:", result.errors);
        return;
      }
    }

    if (this.runtimeVM && this.activePlan) {
      // Milestone 4: Route execution through Runtime VM
      this.runtimeVM.execute(this.activePlan);
      globalProfiler.instructions.instructionCount.record(this.runtimeVM.stats.totalInstructionsExecuted);
    }

    // Milestone 3 fallback (execute nodes directly until VM has all opcodes implemented)
    for (const instruction of this.activePlan.buffer.instructions) {
      const node = this.graph.nodes.find(n => n.id === instruction.nodeId);
      if (node && node.enabled) {
        node.execute(context);
      }
    }
  }

  invalidateCache() {
    this.activePlan = null;
  }
}
