import { v4 as uuidv4 } from 'uuid';

export class BlackboardEntry {
  constructor(public id: string, public name: string, public type: string, public value: any) {}
}

export class BlackboardScope {
  public id: string = uuidv4();
  public parent: BlackboardScope | null = null;
  public entries: Map<string, BlackboardEntry> = new Map();

  set(name: string, type: string, value: any) {
    if (!this.entries.has(name)) {
      this.entries.set(name, new BlackboardEntry(uuidv4(), name, type, value));
    } else {
      const entry = this.entries.get(name)!;
      entry.type = type;
      entry.value = value;
    }
  }

  get(name: string): any {
    if (this.entries.has(name)) return this.entries.get(name)!.value;
    if (this.parent) return this.parent.get(name);
    return undefined;
  }
}

export interface BlackboardProvider {
  provide(blackboard: Blackboard): void;
}

export class BlackboardResolver {
  resolve(scope: BlackboardScope, name: string): any {
    return scope.get(name);
  }
}

export class Blackboard {
  public globalScope: BlackboardScope = new BlackboardScope();
  public resolver: BlackboardResolver = new BlackboardResolver();

  setValue(name: string, type: string, value: any) {
    this.globalScope.set(name, type, value);
  }

  getValue(name: string) {
    return this.globalScope.get(name);
  }

  updateCore(time: number, delta: number, frame: number, fps: number) {
    this.setValue('Time', 'Float', time);
    this.setValue('DeltaTime', 'Float', delta);
    this.setValue('Frame', 'Integer', frame);
    this.setValue('FPS', 'Float', fps);
  }

  updateViewport(width: number, height: number, logoW: number, logoH: number, sceneW: number, sceneH: number) {
    this.setValue('ViewportWidth', 'Float', width);
    this.setValue('ViewportHeight', 'Float', height);
    this.setValue('LogoWidth', 'Float', logoW);
    this.setValue('LogoHeight', 'Float', logoH);
    this.setValue('SceneWidth', 'Float', sceneW);
    this.setValue('SceneHeight', 'Float', sceneH);
  }
  
  updateInput(mouseX: number, mouseY: number) {
    this.setValue('MouseX', 'Float', mouseX);
    this.setValue('MouseY', 'Float', mouseY);
  }
}
