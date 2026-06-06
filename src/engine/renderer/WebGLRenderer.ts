import { Renderer } from './Renderer';
import { Scene } from '../scene/Scene';
import { Camera } from '../camera/Camera';
import { Object3D } from '../objects/Object3D';
import * as THREE from 'three';

export class WebGLRenderer implements Renderer {
  private renderer: THREE.WebGLRenderer | null = null;
  private threeScene: THREE.Scene;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color('#111111');
  }

  init(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Temporary helper inside renderer just to see something before full geometry integration
    const grid = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    this.threeScene.add(grid);
  }

  render(scene: Scene, camera: Camera): void {
    if (!this.renderer) return;

    // A real implementation would sync MotionOS Scene -> Three.js Scene here.
    // For MVP, we will only map basic objects we created if they have geometry,
    // but right now Object3D has no geometry attached directly.
    // As a stub: Ensure camera matches aspects.
    
    // We render the internal THREE scene from the custom Camera's internal THREE camera.
    this.renderer.render(this.threeScene, camera.threeCamera);
  }

  resize(width: number, height: number): void {
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
  }

  dispose(): void {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }

  // Debug Hook to add something to view
  public dangerouslyGetThreeScene(): THREE.Scene {
    return this.threeScene;
  }
}
