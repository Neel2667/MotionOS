import { v4 as uuidv4 } from 'uuid';

export class CameraTarget {
  public id: string = uuidv4();
  public position: Float32Array = new Float32Array([0, 0, 0]);
  public targetNodeId: string | null = null;
}

export class CameraPath {
  public id: string = uuidv4();
  public waypoints: Float32Array[] = [];
  public closed: boolean = false;
  // Spline logic...
}

export class CameraRig {
  public id: string = uuidv4();
  public position: Float32Array = new Float32Array([0, 0, 5]);
  public rotation: Float32Array = new Float32Array([0, 0, 0, 1]); // Quaternion
  public target: CameraTarget = new CameraTarget();
  public fov: number = 45;
  public zoom: number = 1.0;
  public focusDistance: number = 10.0;
  public near: number = 0.1;
  public far: number = 1000.0;
  public exposure: number = 1.0;
}

export class CameraRegistry {
  private cameras: Map<string, CameraRig> = new Map();
  public activeCameraId: string | null = null;

  register(camera: CameraRig) {
    this.cameras.set(camera.id, camera);
    if (!this.activeCameraId) this.activeCameraId = camera.id;
  }

  get(id: string) { return this.cameras.get(id); }
  getActive() { return this.activeCameraId ? this.cameras.get(this.activeCameraId) : undefined; }
}

export class CameraController {
  // Evaluates bindings between inputs (mouse/timeline) and the Rig
  update(rig: CameraRig, dt: number) {
     // physics interpolation for smoothing
  }
}

export class CameraManager {
  public registry = new CameraRegistry();
  public controller = new CameraController();

  createRig(): CameraRig {
    const rig = new CameraRig();
    this.registry.register(rig);
    return rig;
  }
}
