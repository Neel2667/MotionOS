import { v4 as uuidv4 } from 'uuid';

export class ObjectHandle {
  constructor(public id: number = 0, public uuid: string = uuidv4()) {}
}

export class HandleRegistry {
  public indices: Map<string, number> = new Map();
  public handles: Map<number, ObjectHandle> = new Map();
  private nextId: number = 1;

  add(uuid: string): ObjectHandle {
    const id = this.nextId++;
    const handle = new ObjectHandle(id, uuid);
    this.indices.set(uuid, id);
    this.handles.set(id, handle);
    return handle;
  }

  remove(uuid: string): void {
    const id = this.indices.get(uuid);
    if (id !== undefined) {
      this.handles.delete(id);
      this.indices.delete(uuid);
    }
  }
}

export class UUIDRegistry {
  private uuids: Set<string> = new Set();
  
  register(uuid: string) { this.uuids.add(uuid); }
  unregister(uuid: string) { this.uuids.delete(uuid); }
  exists(uuid: string) { return this.uuids.has(uuid); }
}

export class LookupCache {
  private cache: Map<string, any> = new Map();
  
  get(uuid: string) { return this.cache.get(uuid); }
  set(uuid: string, obj: any) { this.cache.set(uuid, obj); }
  invalidate(uuid: string) { this.cache.delete(uuid); }
}

export class ObjectRegistry {
  private table: Map<number, any> = new Map(); // id -> Object3D

  set(id: number, obj: any) { this.table.set(id, obj); }
  get(id: number): any { return this.table.get(id); }
  remove(id: number) { this.table.delete(id); }
}

export class SceneRegistry {
  public uuidRegistry = new UUIDRegistry();
  public handleRegistry = new HandleRegistry();
  public objectRegistry = new ObjectRegistry();
  public lookupCache = new LookupCache();

  register(obj: any): ObjectHandle {
    if (!obj.id) obj.id = uuidv4();
    this.uuidRegistry.register(obj.id);
    const handle = this.handleRegistry.add(obj.id);
    this.objectRegistry.set(handle.id, obj);
    this.lookupCache.set(obj.id, obj);
    return handle;
  }

  unregister(obj: any) {
    if (!obj.id) return;
    const id = this.handleRegistry.indices.get(obj.id);
    if (id !== undefined) {
      this.objectRegistry.remove(id);
      this.handleRegistry.remove(obj.id);
    }
    this.uuidRegistry.unregister(obj.id);
    this.lookupCache.invalidate(obj.id);
  }

  getByHandle(handle: ObjectHandle): any {
    return this.objectRegistry.get(handle.id);
  }

  getByUUID(uuid: string): any {
    // Check O(1) cache first
    let obj = this.lookupCache.get(uuid);
    if (obj) return obj;

    const id = this.handleRegistry.indices.get(uuid);
    if (id !== undefined) {
      obj = this.objectRegistry.get(id);
      if (obj) this.lookupCache.set(uuid, obj);
      return obj;
    }
    return null;
  }

  getById(id: number): any {
    return this.objectRegistry.get(id);
  }

  exists(uuid: string): boolean {
    return this.uuidRegistry.exists(uuid);
  }
}
