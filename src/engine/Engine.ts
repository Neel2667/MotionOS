import { EventSystem } from './core/EventSystem';
import { Config } from './core/Config';
import { Clock } from './core/Clock';
import { Scene } from './scene/Scene';
import { SceneRegistry } from './scene/SceneRegistry';
import { Timeline } from './timeline/Timeline';
import { Renderer } from './renderer/Renderer';
import { Logger, logger } from './core/Logger';
import { MotionGraph } from './motion/core/MotionGraph';
import { MotionExecutor } from './motion/core/MotionExecutor';
import { MotionContext } from './motion/core/MotionContext';
import { Blackboard } from './blackboard/Blackboard';
import { RuntimeVM } from './runtime/vm/RuntimeVM';
import { Scheduler } from './runtime/scheduler/Scheduler';
import { CacheSystem } from './cache/CacheSystem';
import { globalProfiler } from './profiler/Profiler';

export class Engine {
  public eventSystem: EventSystem;
  public config: Config;
  public clock: Clock;
  public scene: Scene;
  public sceneRegistry: SceneRegistry;
  public timeline: Timeline;
  public logger: Logger;
  public motionGraph: MotionGraph;
  public motionExecutor: MotionExecutor;
  public blackboard: Blackboard;
  public runtimeVM: RuntimeVM;
  public scheduler: Scheduler;
  public cache: CacheSystem;
  public profiler = globalProfiler;
  
  private renderer: Renderer | null = null;

  constructor() {
    this.eventSystem = new EventSystem();
    this.config = new Config();
    this.clock = new Clock();
    this.sceneRegistry = new SceneRegistry();
    this.scene = new Scene();
    this.sceneRegistry.register(this.scene);
    this.timeline = new Timeline();
    this.logger = logger;
    this.motionGraph = new MotionGraph();
    this.motionExecutor = new MotionExecutor(this.motionGraph);
    this.blackboard = new Blackboard();
    this.runtimeVM = new RuntimeVM();
    this.scheduler = new Scheduler();
    this.motionExecutor.runtimeVM = this.runtimeVM;
    this.cache = new CacheSystem();
  }

  setRenderer(renderer: Renderer, canvas: HTMLCanvasElement) {
    this.renderer = renderer;
    this.renderer.init(canvas);
  }

  start() {
    this.clock.start();
    this.loop();
  }

  stop() {
    this.clock.stop();
  }

  private loop = () => {
    if (!this.clock['running']) return;

    requestAnimationFrame(this.loop);

    const frameStart = performance.now();

    this.clock.update();
    const delta = this.clock.delta;

    this.timeline.update(delta);
    
    // Update Blackboard global variables
    const fps = delta > 0 ? 1 / delta : 60;
    this.blackboard.updateCore(this.timeline.currentTime, delta, Math.floor(this.timeline.currentTime * 60), fps);
    this.blackboard.updateViewport(1920, 1080, 500, 500, 1920, 1080);
    
    const context = new MotionContext(this.scene, this.blackboard);
    context.time = this.timeline.currentTime;
    context.delta = delta;
    this.motionExecutor.update(context);
    
    // Evaluate tasks
    this.scheduler.execute(16.6); // Execute tasks within Time Budget
    
    this.scene.update(delta);

    this.eventSystem.emit('pre-render', delta);

    this.profiler.frame.frameCost.record(performance.now() - frameStart);
    this.profiler.frame.fps.record(fps);
  };

  exportFrames(fps: number, start: number, end: number) {
    console.log(`[FFmpeg Stub] Exporting frames from ${start}s to ${end}s at ${fps}fps`);
    this.eventSystem.emit('export-start');
    
    setTimeout(() => {
       console.log(`[FFmpeg Stub] Export complete.`);
       this.eventSystem.emit('export-complete');
    }, 1000);
  }
}
