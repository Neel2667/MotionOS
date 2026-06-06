import { MotionAnalyzer } from './MotionAnalyzer';
import { MotionPlanner } from './MotionPlanner';
import { MotionValidator } from './MotionValidator';
import { MotionGenerator } from './MotionGenerator';

export class MotionDirector {
  private analyzer = new MotionAnalyzer();
  private planner = new MotionPlanner();
  private validator = new MotionValidator();
  private generator = new MotionGenerator();

  public direct(intent: string): any {
    // 1. Semantic Analysis
    const partialDNA = this.analyzer.analyzeIntent(intent);
    
    // 2. Trajectory and Rhythm Planning
    const finalDNA = this.planner.plan(partialDNA);
    
    // 3. DNA Validation
    if (!this.validator.validate(finalDNA)) {
      throw new Error(`Motion Director: Failed to validate generated Motion DNA for intent '${intent}'`);
    }
    
    // 4. Track and Primitive Generation
    const timeline = this.generator.generateTimeline(finalDNA);
    return timeline;
  }
}
