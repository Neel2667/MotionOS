import { Sequencer, TimelineSegment } from './Sequencer';
import { ConstraintSolver, ConstraintConflict } from './ConstraintSolver';
import { MotionGraphBuilder } from './MotionGraphBuilder';
import { MotionGraphCompiler, CompilationMetrics } from './MotionGraphCompiler';
import { MotionAssembler } from './MotionAssembler';
import { TransitionManager, TransitionType } from './TransitionEngine';
import { BrandStyle } from '../../ai/analyzer/BrandAnalyzer';
import { MotionGraph } from '../core/MotionGraph';

export interface ComposedAnimationState {
  brandStyle: BrandStyle;
  segments: TimelineSegment[];
  graph: any; // serialized graph
  errors: string[];
  metrics: CompilationMetrics;
  conflictLogs: ConstraintConflict[];
  optimizationScore: number;
}

export class AnimationComposer {
  public sequencer = new Sequencer();
  public solver = new ConstraintSolver();
  public builder = new MotionGraphBuilder();
  public compiler = new MotionGraphCompiler();
  public assembler = new MotionAssembler();
  public transitionManager = new TransitionManager();

  public lastComposition: ComposedAnimationState | null = null;

  compose(brandStyle: BrandStyle, activeFX: string[], activeMaterials: string[]): ComposedAnimationState {
    // 1. Arrange Blocks in Sequencer
    const segments = this.sequencer.sequence(brandStyle);

    // 2. Clear and setup transitions
    this.transitionManager.clear();
    this.transitionManager.addTransition(TransitionType.LIGHT_FLASH, 2.0, 0.6);
    this.transitionManager.addTransition(TransitionType.FADE, 4.5, 1.0);

    // 3. Build MotionGraph
    const graph = this.builder.build(segments);

    // 4. Compile Graph & gather metrics
    const { metrics } = this.compiler.compile(graph);

    // 5. Solve Constraints
    const envLights = { rig: brandStyle === BrandStyle.LUXURY ? 'LUXURY_STUDIO' : 'STANDARD', lights: ['KEY', 'RIM', 'FILL'] };
    const { logs, score } = this.solver.solve(segments, activeFX, activeMaterials, envLights);

    const composition: ComposedAnimationState = {
      brandStyle,
      segments,
      graph: graph.serialize(),
      errors: metrics.errors,
      metrics,
      conflictLogs: logs,
      optimizationScore: score
    };

    this.lastComposition = composition;
    return composition;
  }

  serialize(): string {
    if (!this.lastComposition) return '{}';
    return JSON.stringify(this.lastComposition, null, 2);
  }
}
