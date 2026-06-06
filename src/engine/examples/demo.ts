import { Engine } from '../Engine';
import { Scene } from '../scene/Scene';
import { Camera } from '../camera/Camera';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { Object3D } from '../objects/Object3D';
import * as THREE from 'three';

/**
 * Creates a basic scene as requested:
 * Engine -> Scene -> Object -> Camera -> Render
 */
export function createDemo(canvas: HTMLCanvasElement): Engine {
  // 1. Initialize Engine
  const engine = new Engine();
  
  // 2. Initialize Renderer
  const renderer = new WebGLRenderer();
  engine.setRenderer(renderer, canvas);

  // 3. Scene is built-in (engine.scene)

  // 4. Create Camera
  const camera = new Camera();
  camera.transform.position.z = 5;
  engine.scene.add(camera);

  // 5. Create Logo Object
  const logo = new Object3D('Logo');
  engine.scene.add(logo);

  // For the sake of the MVP renderer actually showing the object,
  // we slip in a Three Mesh into the WebGLRenderer's inner scene.
  // In a full implementation, `renderer.render()` would traverse `engine.scene` mapping MotionOS objects to THREE objects.
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  renderer.dangerouslyGetThreeScene().add(mesh);

  // Setup loop integration
  engine.eventSystem.on('pre-render', (delta) => {
    // Update camera aspect
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    
    // Rotate the logo object internally
    logo.transform.rotation.y += delta;
    logo.transform.rotation.x += delta * 0.5;
    
    // Sync to inner three mesh for visual demo
    mesh.position.copy(logo.transform.position);
    mesh.rotation.copy(logo.transform.rotation);
    mesh.scale.copy(logo.transform.scale);

    renderer.render(engine.scene, camera);
  });

  // Handle Resize
  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.resize(w, h);
    camera.aspect = w / h;
  };
  window.addEventListener('resize', onResize);
  
  // Trigger initial resize
  onResize();

  // 6. Start 
  engine.start();

  return engine;
}
