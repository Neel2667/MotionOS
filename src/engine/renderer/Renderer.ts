import { Scene } from '../scene/Scene';
import { Camera } from '../camera/Camera';

export interface Renderer {
  init(canvas: HTMLCanvasElement): void;
  render(scene: Scene, camera: Camera): void;
  resize(width: number, height: number): void;
  dispose(): void;
}
