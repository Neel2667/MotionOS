import { EventSystem } from './core/EventSystem';
import { Config } from './core/Config';
import { Clock } from './core/Clock';
import { Scene } from './scene/Scene';
import { Timeline } from './timeline/Timeline';
import { Renderer } from './renderer/Renderer';

export class Engine {
  public eventSystem: EventSystem;
  public config: Config;
  public clock: Clock;
  public scene: Scene;
  public timeline: Timeline;
  
  private renderer: Renderer | null = null;

  constructor() {
    this.eventSystem = new EventSystem();
    this.config = new Config();
    this.clock = new Clock();
    this.scene = new Scene();
    this.timeline = new Timeline();
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

    this.clock.update();
    const delta = this.clock.delta;

    this.timeline.update(delta);
    
    // In the future, Timeline events map to Scene properties via Animations.
    // Right now simply update scene transforms.
    this.scene.update(delta);

    // Render using attached renderer
    // Note: We need a camera. Let's assume the user handles camera creation, we just dispatch render event hooks for now, 
    // or let the outer application manually call render if it manages the camera.
    // For cleanliness, we emit 'pre-render' to allow app to call renderer.render()
    this.eventSystem.emit('pre-render', delta);
  };

  // Stub for ffmpeg integration
  exportFrames(fps: number, start: number, end: number) {
    console.log(`[FFmpeg Stub] Exporting frames from ${start}s to ${end}s at ${fps}fps`);
    this.eventSystem.emit('export-start');
    
    // Mock async process
    setTimeout(() => {
       console.log(`[FFmpeg Stub] Export complete.`);
       this.eventSystem.emit('export-complete');
    }, 1000);
  }
}
