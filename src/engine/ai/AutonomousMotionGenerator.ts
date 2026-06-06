import { LogoAnalyzer } from './analyzer/LogoAnalyzer';
import { BrandAnalyzer } from './analyzer/BrandAnalyzer';
import { MotionPlanner } from './planner/MotionPlanner';
import { ScenePlanner } from './planner/ScenePlanner';
import { FXPlanner } from './planner/FXPlanner';
import { LightingPlanner } from './planner/LightingPlanner';
import { MaterialPlanner } from './planner/MaterialPlanner';
import { TimelinePlanner } from './planner/TimelinePlanner';

export class AutonomousMotionGenerator {
  public logoAnalyzer = new LogoAnalyzer();
  public brandAnalyzer = new BrandAnalyzer();
  public motionPlanner = new MotionPlanner();
  public scenePlanner = new ScenePlanner();
  public fxPlanner = new FXPlanner();
  public lightingPlanner = new LightingPlanner();
  public materialPlanner = new MaterialPlanner();
  public timelinePlanner = new TimelinePlanner();

  public lastAnalysis: any = null;

  generate(image: any) {
    const logoAnalysis = this.logoAnalyzer.analyze(image);
    const brandStyle = this.brandAnalyzer.analyze(logoAnalysis);
    
    this.lastAnalysis = {
      logo: logoAnalysis,
      brand: brandStyle,
      motionStyle: 'Premium Reveal',
      confidence: 0.94,
      motionPlan: this.motionPlanner.plan(brandStyle),
      scenePlan: this.scenePlanner.plan(brandStyle),
      fxPlan: this.fxPlanner.plan(brandStyle),
      materialPlan: this.materialPlanner.plan(brandStyle),
      lightingPlan: this.lightingPlanner.plan(brandStyle),
      timelinePlan: this.timelinePlanner.plan(brandStyle),
    };

    return this.lastAnalysis;
  }
}
