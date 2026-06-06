import * as THREE from 'three';

export class Transform {
  public position: THREE.Vector3;
  public rotation: THREE.Euler;
  public scale: THREE.Vector3;
  
  public matrix: THREE.Matrix4;
  public worldMatrix: THREE.Matrix4;

  constructor() {
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler();
    this.scale = new THREE.Vector3(1, 1, 1);
    
    this.matrix = new THREE.Matrix4();
    this.worldMatrix = new THREE.Matrix4();
  }

  updateMatrix() {
    const quaternion = new THREE.Quaternion().setFromEuler(this.rotation);
    this.matrix.compose(this.position, quaternion, this.scale);
  }

  updateWorldMatrix(parentWorldMatrix?: THREE.Matrix4) {
    this.updateMatrix();
    if (parentWorldMatrix) {
      this.worldMatrix.multiplyMatrices(parentWorldMatrix, this.matrix);
    } else {
      this.worldMatrix.copy(this.matrix);
    }
  }

  serialize() {
    return {
      position: this.position.toArray(),
      rotation: this.rotation.toArray(),
      scale: this.scale.toArray(),
    };
  }

  deserialize(data: any) {
    if (data.position) this.position.fromArray(data.position);
    if (data.rotation) this.rotation.fromArray(data.rotation as any);
    if (data.scale) this.scale.fromArray(data.scale);
    this.updateMatrix();
  }
}
