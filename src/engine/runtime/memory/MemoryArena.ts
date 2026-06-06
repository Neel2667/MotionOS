export class MemoryHandle {
  constructor(public id: number, public offset: number, public size: number) {}
}

export class MemoryBlock {
  public data: Float32Array; // Using Float32Array as the foundational data-oriented backing
  constructor(size: number) {
    this.data = new Float32Array(size);
  }
}

export class MemoryArena {
  public block: MemoryBlock;
  public capacity: number;
  public cursor: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.block = new MemoryBlock(capacity);
  }

  allocate(size: number): MemoryHandle | null {
    if (this.cursor + size > this.capacity) return null;
    const handle = new MemoryHandle(this.cursor, this.cursor, size);
    this.cursor += size;
    return handle;
  }

  reset() {
    this.cursor = 0;
  }
}
