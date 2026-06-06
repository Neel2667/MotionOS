import { v4 as uuidv4 } from 'uuid';

export class SceneDefinition {
  public id: string = uuidv4();
  public name: string;
  public version: string = '1.0.0';
  public compositionId: string = '';
  public metadata: Record<string, any> = {};

  constructor(name: string) {
    this.name = name;
  }
}

export class SceneRegistry {
  private scenes: Map<string, SceneDefinition> = new Map();
  register(scene: SceneDefinition) { this.scenes.set(scene.id, scene); }
  get(id: string) { return this.scenes.get(id); }
}

export class SceneBuilder {
  public create(name: string): SceneDefinition {
    const scene = new SceneDefinition(name);
    return scene;
  }
}

export class SceneValidator {
  public validate(scene: SceneDefinition): boolean {
    if (!scene.id || !scene.name) return false;
    return true;
  }
}

export class SceneCompiler {
  public compile(scene: SceneDefinition): any {
    // Translates high-level Scene into lower-level Execution Plans
    return { compiledSceneId: scene.id };
  }
}

export class SceneSerializer {
  public serialize(scene: SceneDefinition): any {
    return {
      id: scene.id,
      name: scene.name,
      version: scene.version,
      compositionId: scene.compositionId,
      metadata: scene.metadata
    };
  }

  public deserialize(data: any): SceneDefinition {
    const scene = new SceneDefinition(data.name || 'Untitled');
    if (data.id) scene.id = data.id;
    if (data.compositionId) scene.compositionId = data.compositionId;
    if (data.version) scene.version = data.version;
    if (data.metadata) scene.metadata = data.metadata;
    return scene;
  }
}
