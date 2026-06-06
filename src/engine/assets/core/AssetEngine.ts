import { v4 as uuidv4 } from 'uuid';

export interface AssetDefinition {
  id: string;
  type: string;
  name: string;
  parameters: Record<string, any>;
}

export class AssetRegistry {
  private assets: Map<string, AssetDefinition> = new Map();
  register(asset: AssetDefinition) { this.assets.set(asset.id, asset); }
  get(id: string) { return this.assets.get(id); }
  getAll() { return Array.from(this.assets.values()); }
}

export class AssetValidator {
  validate(asset: AssetDefinition): boolean {
    return !!(asset.id && asset.type && asset.name);
  }
}

export class AssetCompiler {
  compile(asset: AssetDefinition): any {
    // Generate deterministic execution buffers based on asset type and parameters
    return { compiledId: asset.id };
  }
}

export class AssetSerializer {
  serialize(asset: AssetDefinition): any {
    return { ...asset };
  }

  deserialize(data: any): AssetDefinition {
    return {
      id: data.id || uuidv4(),
      type: data.type,
      name: data.name || 'Unnamed Asset',
      parameters: data.parameters || {}
    };
  }
}

export class AssetGenerator {
  generate(type: string, name: string, parameters: Record<string, any>): AssetDefinition {
    return {
      id: uuidv4(),
      type,
      name,
      parameters
    };
  }
}

export class AssetLibrary {
  public registry = new AssetRegistry();
  public generator = new AssetGenerator();
  public validator = new AssetValidator();
  public compiler = new AssetCompiler();
  public serializer = new AssetSerializer();
}
