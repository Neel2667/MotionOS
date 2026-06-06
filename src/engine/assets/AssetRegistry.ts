import { v4 as uuidv4 } from 'uuid';

export class AssetHandle {
  constructor(public id: string = uuidv4()) {}
}

export class AssetDescriptor {
  public id: string = uuidv4();
  public hash: string = '';
  public version: number = 1;
  public type: string = 'unknown';
  public dependencies: string[] = [];
  public metadata: Record<string, any> = {};
  public uri: string = '';

  constructor(type: string, uri: string) {
    this.type = type;
    this.uri = uri;
  }
}

export class AssetRegistry {
  protected assets: Map<string, AssetDescriptor> = new Map();
  protected loadedData: Map<string, any> = new Map();

  register(descriptor: AssetDescriptor): AssetHandle {
    this.assets.set(descriptor.id, descriptor);
    return new AssetHandle(descriptor.id);
  }

  load(handle: AssetHandle): Promise<any> {
    const asset = this.assets.get(handle.id);
    if (!asset) return Promise.reject(`Asset ${handle.id} not found.`);
    if (this.loadedData.has(handle.id)) return Promise.resolve(this.loadedData.get(handle.id));
    
    // Stub for actual loading logic
    return new Promise((resolve) => {
      this.loadedData.set(handle.id, { _stubData: true });
      resolve(this.loadedData.get(handle.id));
    });
  }

  unload(handle: AssetHandle): void {
    this.loadedData.delete(handle.id);
  }

  invalidate(handle: AssetHandle): void {
    this.unload(handle);
    // Logic to update version/hash would go here
  }

  serialize(): any {
    return Array.from(this.assets.values()).map(d => ({...d}));
  }

  deserialize(data: any): void {
    for (const item of data) {
      const desc = new AssetDescriptor(item.type, item.uri);
      Object.assign(desc, item);
      this.assets.set(desc.id, desc);
    }
  }
}
