import { Object3D } from '../objects/Object3D';
import * as THREE from 'three';

export class Camera extends Object3D {
  public fov: number = 75;
  public aspect: number = 1;
  public near: number = 0.1;
  public far: number = 1000;
  
  // Expose underlying THREE camera for Renderer
  public threeCamera: THREE.PerspectiveCamera;

  constructor() {
    super('Camera');
    this.threeCamera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    
    // Default backward
    this.transform.position.z = 5;
  }

  update(delta: number) {
    super.update(delta);
    // Sync THREE.js camera with this node's world transform
    this.threeCamera.fov = this.fov;
    this.threeCamera.aspect = this.aspect;
    this.threeCamera.near = this.near;
    this.threeCamera.far = this.far;
    this.threeCamera.updateProjectionMatrix();

    this.threeCamera.position.copy(this.transform.position);
    this.threeCamera.rotation.copy(this.transform.rotation);
  }
}
