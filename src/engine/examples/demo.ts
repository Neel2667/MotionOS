import { Engine } from '../Engine';
import { Scene } from '../scene/Scene';
import { Camera } from '../camera/Camera';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { Object3D } from '../objects/Object3D';
import { RotateNode } from '../motion/nodes/RotateNode';
import { ScaleNode } from '../motion/nodes/ScaleNode';
import { OpacityNode } from '../motion/nodes/OpacityNode';
import * as THREE from 'three';

export function createDemo(canvas: HTMLCanvasElement): Engine {
  const engine = new Engine();
  const renderer = new WebGLRenderer();
  engine.setRenderer(renderer, canvas);

  const camera = new Camera();
  camera.transform.position.z = 5;
  engine.scene.add(camera);

  const logo = new Object3D('Logo');
  engine.scene.add(logo);

  // FX Graph: Scene Overhaul 
  const threeScene = renderer.dangerouslyGetThreeScene();
  const cinematicGroup = new THREE.Group();
  threeScene.add(cinematicGroup);

  // Lighting Engine: Studio Rig with Color
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  cinematicGroup.add(ambientLight);

  const keyLight = new THREE.SpotLight(0x00ffff, 10, 20, Math.PI / 4, 0.5, 1);
  keyLight.position.set(2, 5, 5);
  keyLight.lookAt(0,0,0);
  cinematicGroup.add(keyLight);

  const rimLight = new THREE.PointLight(0xff00ff, 15, 15);
  rimLight.position.set(-3, 2, -3);
  cinematicGroup.add(rimLight);

  // Material Graph: Holographic PBR Setup
  const logoMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0x00ffcc, 
    metalness: 0.9, 
    roughness: 0.1,
    transmission: 0.8,
    ior: 1.5,
    thickness: 0.5,
    clearcoat: 1.0,
    emissive: 0x003333,
    emissiveIntensity: 0.5
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });

  // Geometry: Mesh
  const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 200, 32);
  const mainMesh = new THREE.Mesh(geometry, logoMaterial);
  cinematicGroup.add(mainMesh);

  // FX Graph: Glow Pulse Mesh
  const glowMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.25, 0.35, 100, 16),
    wireframeMaterial
  );
  cinematicGroup.add(glowMesh);

  // FX: Shockwave
  const ringGeom = new THREE.RingGeometry(2.5, 2.55, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const shockwave = new THREE.Mesh(ringGeom, ringMat);
  shockwave.rotation.x = Math.PI / 2;
  cinematicGroup.add(shockwave);

  // Particle System
  const particleGeom = new THREE.BufferGeometry();
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for(let i=0; i<particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 1 + Math.random() * 3;
    const y = (Math.random() - 0.5) * 4;
    positions[i*3] = Math.cos(theta) * r;
    positions[i*3+1] = y;
    positions[i*3+2] = Math.sin(theta) * r;

    // Cyan to Magenta gradient
    const mix = Math.random();
    colors[i*3] = mix; 
    colors[i*3+1] = 1.0 - mix; 
    colors[i*3+2] = 1.0; 
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
  const particles = new THREE.Points(particleGeom, particleMat);
  cinematicGroup.add(particles);

  threeScene.background = new THREE.Color(0x050508);
  threeScene.fog = new THREE.FogExp2(0x050508, 0.05);

  const rotateNode = new RotateNode();
  rotateNode.parameters = { targetName: 'Logo', x: 0.5, y: 1, z: 0, speed: 1 };
  
  const scaleNode = new ScaleNode();
  scaleNode.parameters = { targetName: 'Logo', sx: 1, sy: 1, sz: 1, oscillate: 0.5, speed: 2 };
  
  const opacityNode = new OpacityNode();
  opacityNode.parameters = { targetName: 'Logo', opacity: 0.5, pulse: 0.5, speed: 3 };

  engine.motionGraph.addNode(rotateNode);
  engine.motionGraph.addNode(scaleNode);
  engine.motionGraph.addNode(opacityNode);
  
  engine.timeline.play();

  engine.eventSystem.on('pre-render', (delta) => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    const time = engine.timeline.currentTime;
    
    // Sync to inner three mesh for visual demo
    mainMesh.position.copy(logo.transform.position);
    mainMesh.rotation.copy(logo.transform.rotation);
    mainMesh.scale.copy(logo.transform.scale);
    logoMaterial.opacity = logo.opacity;

    glowMesh.position.copy(logo.transform.position);
    glowMesh.rotation.copy(logo.transform.rotation);
    glowMesh.scale.copy(logo.transform.scale);
    
    const pulse = (Math.sin(time * 4) + 1.0) * 0.5;
    wireframeMaterial.opacity = 0.1 + pulse * 0.4;

    const shockT = (time % 3.0) / 3.0; // loop
    shockwave.scale.setScalar(0.5 + shockT * 3.0);
    ringMat.opacity = 1.0 - shockT;

    particles.rotation.y = time * -0.2;
    const posAttr = particles.geometry.attributes.position;
    const posArr = posAttr.array as Float32Array;
    for(let i=0; i<particleCount; i++) {
       posArr[i*3+1] += Math.sin(time * 2 + posArr[i*3]) * 0.01;
    }
    posAttr.needsUpdate = true;

    // Cinematic Camera tracking
    const targetX = Math.sin(time * 0.5) * 6;
    const targetZ = Math.cos(time * 0.5) * 6;
    const targetY = 2 + Math.sin(time * 0.2) * 1;
    camera.transform.position.x += (targetX - camera.transform.position.x) * 0.1;
    camera.transform.position.y += (targetY - camera.transform.position.y) * 0.1;
    camera.transform.position.z += (targetZ - camera.transform.position.z) * 0.1;
    
    const matrix = new THREE.Matrix4();
    matrix.lookAt(
      new THREE.Vector3(camera.transform.position.x, camera.transform.position.y, camera.transform.position.z),
      new THREE.Vector3(0, Math.sin(time) * 0.5, 0),
      new THREE.Vector3(0, 1, 0)
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    camera.transform.rotation.x = euler.x;
    camera.transform.rotation.y = euler.y;
    camera.transform.rotation.z = euler.z;

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


