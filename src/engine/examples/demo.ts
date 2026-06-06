import { Engine } from '../Engine';
import { Scene } from '../scene/Scene';
import { Camera } from '../camera/Camera';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { Object3D } from '../objects/Object3D';
import { RotateNode } from '../motion/nodes/RotateNode';
import { ScaleNode } from '../motion/nodes/ScaleNode';
import { OpacityNode } from '../motion/nodes/OpacityNode';
import * as THREE from 'three';

/**
 * Creates a basic scene as requested:
 * Engine -> Scene -> Object -> Camera -> Render -> MotionGraph execution
 */
export function createDemo(canvas: HTMLCanvasElement): Engine {
  const engine = new Engine();
  const renderer = new WebGLRenderer();
  engine.setRenderer(renderer, canvas);

  const camera = new Camera();
  camera.transform.position.z = 5;
  engine.scene.add(camera);

  const logo = new Object3D('Logo');
  engine.scene.add(logo);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true });
  const mesh = new THREE.Mesh(geometry, material);
  renderer.dangerouslyGetThreeScene().add(mesh);

  // Setup MotionGraph
  const rotateNode = new RotateNode();
  rotateNode.parameters = { targetName: 'Logo', x: 0.5, y: 1, z: 0, speed: 1 };
  
  const scaleNode = new ScaleNode();
  scaleNode.parameters = { targetName: 'Logo', sx: 1, sy: 1, sz: 1, oscillate: 0.5, speed: 2 };
  
  const opacityNode = new OpacityNode();
  opacityNode.parameters = { targetName: 'Logo', opacity: 0.5, pulse: 0.5, speed: 3 };

  engine.motionGraph.addNode(rotateNode);
  engine.motionGraph.addNode(scaleNode);
  engine.motionGraph.addNode(opacityNode);
  
  // Need to start timeline for MotionContext time to advance
  engine.timeline.play();

  engine.eventSystem.on('pre-render', (delta) => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    
    // Sync to inner three mesh for visual demo
    mesh.position.copy(logo.transform.position);
    mesh.rotation.copy(logo.transform.rotation);
    mesh.scale.copy(logo.transform.scale);
    mesh.material.opacity = logo.opacity;

    renderer.render(engine.scene, camera);
  });

  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.resize(w, h);
    camera.aspect = w / h;
  };
  window.addEventListener('resize', onResize);
  onResize();

  engine.start();

  return engine;
}

