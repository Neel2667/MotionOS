export class TransformBuffer {
  public data: Float32Array;
  public capacity: number;
  private nextIdx: number = 0;
  
  // Layout: X, Y, Z, RotX, RotY, RotZ, ScaleX, ScaleY, ScaleZ (9 floats per object)
  public static readonly STRIDE = 9;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.data = new Float32Array(capacity * TransformBuffer.STRIDE);
  }
}

export class ParameterBuffer {
  public data: Float32Array;
  
  constructor(capacity: number) {
    this.data = new Float32Array(capacity);
  }
}

export class InstructionBuffer {
  public data: Uint32Array; // Encoded instructions
  
  constructor(capacity: number) {
    this.data = new Uint32Array(capacity);
  }
}

export class GPUUploadBuffer {
  public data: Float32Array;
  public dirty: boolean = false;
  
  constructor(capacity: number) {
    this.data = new Float32Array(capacity);
  }
}
