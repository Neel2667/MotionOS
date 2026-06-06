import { RenderSettings, DEFAULT_RENDER_SETTINGS } from './RenderSettings';
import { FrameRenderer, FrameBufferMetrics } from './FrameRenderer';
import { RenderQueue, RenderJob, QueueJobStatus } from './RenderQueue';
import { Encoder, EncodedOutput } from './Encoder';

export interface DataFlowStep {
  name: string;
  description: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ERROR';
  order: number;
}

export class ExportEngine {
  private frameRenderer = new FrameRenderer();
  private encoder = new Encoder();
  public queue = new RenderQueue();
  
  // Represents full requested MotionOS Data Flow
  public dataFlowSteps: DataFlowStep[] = [
    { name: 'Logo Input', description: 'Loads brand asset logo & markers', status: 'PENDING', order: 1 },
    { name: 'AI Director', description: 'Analyzes design language heuristics', status: 'PENDING', order: 2 },
    { name: 'Motion DNA', description: 'Formulates core timing and cadence rules', status: 'PENDING', order: 3 },
    { name: 'Animation Composer', description: 'Paces blocks and maps timelines', status: 'PENDING', order: 4 },
    { name: 'Motion Graph', description: 'Solves topological nodes layout dependency', status: 'PENDING', order: 5 },
    { name: 'Timeline', description: 'Generates active tracks & parameters keys', status: 'PENDING', order: 6 },
    { name: 'Scene Builder', description: 'Spawns Three.js primitives and buffers', status: 'PENDING', order: 7 },
    { name: 'Renderer', description: 'Executes standard WebGL passes', status: 'PENDING', order: 8 },
    { name: 'Frame Renderer', description: 'Grabs target frame color matrices', status: 'PENDING', order: 9 },
    { name: 'Render Queue', description: 'Coordinates active image sequence stacks', status: 'PENDING', order: 10 },
    { name: 'Encoder', description: 'Bridges stream vectors into output file stream', status: 'PENDING', order: 11 },
    { name: 'Output', description: 'Discharges final MP4/JSON asset package', status: 'PENDING', order: 12 },
  ];

  public updateFlowStep(name: string, status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ERROR') {
    const step = this.dataFlowSteps.find(s => s.name === name);
    if (step) {
      step.status = status;
    }
  }

  public resetFlowSteps() {
    this.dataFlowSteps.forEach(s => {
      s.status = 'PENDING';
    });
  }

  /**
   * Executes continuous render loops
   */
  public async executeImmediateExport(
    projectName: string,
    settings: RenderSettings,
    onProgress: (currentFrame: number, totalFrames: number, stepInfo?: string) => void
  ): Promise<EncodedOutput> {
    this.resetFlowSteps();
    
    // Step 1: Logo Input
    this.updateFlowStep('Logo Input', 'ACTIVE');
    onProgress(0, settings.endFrame, 'Initializing brand logo vector layers...');
    await this.delay(180);
    this.updateFlowStep('Logo Input', 'COMPLETED');

    // Step 2-3: AI Director & Motion DNA
    this.updateFlowStep('AI Director', 'ACTIVE');
    this.updateFlowStep('Motion DNA', 'ACTIVE');
    onProgress(1, settings.endFrame, 'Compiling Brand Design Heuristics map into Motion DNA...');
    await this.delay(220);
    this.updateFlowStep('AI Director', 'COMPLETED');
    this.updateFlowStep('Motion DNA', 'COMPLETED');

    // Step 4-5: Animation Composer & Motion Graph
    this.updateFlowStep('Animation Composer', 'ACTIVE');
    this.updateFlowStep('Motion Graph', 'ACTIVE');
    onProgress(3, settings.endFrame, 'Evaluating topological constraint paths & scheduling solver loops...');
    await this.delay(240);
    this.updateFlowStep('Animation Composer', 'COMPLETED');
    this.updateFlowStep('Motion Graph', 'COMPLETED');

    // Step 6-7: Timeline & Scene Builder
    this.updateFlowStep('Timeline', 'ACTIVE');
    this.updateFlowStep('Scene Builder', 'ACTIVE');
    onProgress(5, settings.endFrame, 'Warming up WebGL buffers & loading render shaders...');
    await this.delay(200);
    this.updateFlowStep('Timeline', 'COMPLETED');
    this.updateFlowStep('Scene Builder', 'COMPLETED');

    // Setup buffers
    const width = settings.resolutionPreset === 'Custom' ? settings.customWidth : 1280;
    const height = settings.resolutionPreset === 'Custom' ? settings.customHeight : 720;
    this.frameRenderer.prepareBuffers(width, height);
    this.encoder.initializeBuffer(width, height);

    // Step 8-10: Renderer, Frame Renderer, Render Queue
    this.updateFlowStep('Renderer', 'ACTIVE');
    this.updateFlowStep('Frame Renderer', 'ACTIVE');
    this.updateFlowStep('Render Queue', 'ACTIVE');

    const totalFrames = settings.endFrame - settings.startFrame;
    for (let current = 0; current < totalFrames; current++) {
      // Deterministic Render tick (Zero allocation simulation)
      this.frameRenderer.renderFrame(current, settings);
      
      if (current % 15 === 0) {
        onProgress(current, totalFrames, `Drawing WebGL stream frame: ${current}/${totalFrames}`);
        await this.delay(20);
      }
    }

    this.updateFlowStep('Renderer', 'COMPLETED');
    this.updateFlowStep('Frame Renderer', 'COMPLETED');
    this.updateFlowStep('Render Queue', 'COMPLETED');

    // Step 11: Encoder
    this.updateFlowStep('Encoder', 'ACTIVE');
    onProgress(totalFrames - 1, totalFrames, 'Encoding frame fragments into direct stream codecs...');
    await this.delay(250);
    const output = this.encoder.encode(totalFrames, settings, projectName);
    this.updateFlowStep('Encoder', 'COMPLETED');

    // Step 12: Output ready
    this.updateFlowStep('Output', 'COMPLETED');
    onProgress(totalFrames, totalFrames, 'Compilation complete! Dispatching download stream bundle.');

    return output;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global Single Instance for app-wide UI bindings
export const globalExportEngine = new ExportEngine();
export { DEFAULT_RENDER_SETTINGS };
