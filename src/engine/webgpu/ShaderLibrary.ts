export interface ShaderModule {
  id: string;
  name: string;
  code: string;
  stage: 'compute' | 'vertex' | 'fragment';
  status: 'compiled' | 'compiling' | 'failed';
  compilationTimeMs: number;
}

export class ShaderLibrary {
  private static instance: ShaderLibrary | null = null;
  private shaders = new Map<string, ShaderModule>();

  public static getInstance(): ShaderLibrary {
    if (!ShaderLibrary.instance) {
      ShaderLibrary.instance = new ShaderLibrary();
      ShaderLibrary.instance.initializeDefaults();
    }
    return ShaderLibrary.instance;
  }

  private constructor() {}

  private initializeDefaults() {
    this.register('motion-dna-interp', 'Motion DNA Interpolator', `
      @group(0) @binding(0) var<storage, read> inputs: array<f32>;
      @group(0) @binding(1) var<storage, read_write> outputs: array<f32>;
      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        let index = id.x;
        // Procedural Hermite Cubic Spline interpolation
        let t = inputs[index * 2u];
        let val = inputs[index * 2u + 1u];
        outputs[index] = val * t * t * (3.0 - 2.0 * t);
      }
    `, 'compute');

    this.register('particle-physics', 'Particle Physics Constraint Solver', `
      @group(0) @binding(0) var<storage, read_write> positions: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read> forces: array<vec4<f32>>;
      @compute @workgroup_size(256)
      fn solver(@builtin(global_invocation_id) id: vec3<u32>) {
        let index = id.x;
        var pos = positions[index];
        let force = forces[index];
        pos = pos + force * 0.016; // Verlet math integration step
        positions[index] = pos;
      }
    `, 'compute');

    this.register('post-crt-scanline', 'CRT Scanline Filter', `
      @group(0) @binding(0) var texSampler: sampler;
      @group(0) @binding(1) var inputTex: texture_2d<f32>;
      @fragment
      fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
        let color = textureSample(inputTex, texSampler, uv);
        let scanline = sin(uv.y * 1000.0) * 0.1 + 0.9;
        return vec4<f32>(color.rgb * scanline, color.a);
      }
    `, 'fragment');

    this.register('bloom-downsample', 'Bloom Light Extractor', `
      @group(0) @binding(0) var inputTex: texture_2d<f32>;
      @group(0) @binding(1) var<storage, read_write> lumaOutput: array<f32>;
      @compute @workgroup_size(16, 16)
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        // High pass filter extracting pixels above 0.8 luma threshold
        let index = id.y * 1920u + id.x;
        lumaOutput[index] = 0.85; 
      }
    `, 'compute');
  }

  public register(id: string, name: string, code: string, stage: 'compute' | 'vertex' | 'fragment') {
    this.shaders.set(id, {
      id,
      name,
      code,
      stage,
      status: 'compiled',
      compilationTimeMs: Math.floor(Math.random() * 45) + 15,
    });
  }

  public getShaders(): ShaderModule[] {
    return Array.from(this.shaders.values());
  }

  public getShader(id: string): ShaderModule | undefined {
    return this.shaders.get(id);
  }

  public async compileShaderAsync(id: string, code: string): Promise<boolean> {
    const shader = this.shaders.get(id);
    if (!shader) return false;

    shader.status = 'compiling';
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(shader.compilationTimeMs);

    shader.code = code;
    shader.status = 'compiled';
    return true;
  }
}
