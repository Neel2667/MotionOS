import { MotionGraph } from '../core/MotionGraph';
import { TimelineSegment } from './Sequencer';
import { TransitionType } from './TransitionEngine';
import * as THREE from 'three';

export class MotionAssembler {
  /**
   * Translates active materials names to standard THREE meshes materials.
   */
  assembleMaterial(materialNames: string[]): THREE.Material {
     const name = materialNames[0] || 'MATTE';
     
     switch (name) {
       case 'GOLD':
         return new THREE.MeshPhysicalMaterial({
           color: 0xD4AF37,
           metalness: 0.95,
           roughness: 0.15,
           clearcoat: 1.0,
           clearcoatRoughness: 0.1
         });
       case 'CHROME':
         return new THREE.MeshPhysicalMaterial({
           color: 0xcccccc,
           metalness: 1.0,
           roughness: 0.05,
           clearcoat: 1.0
         });
       case 'NEON':
         return new THREE.MeshStandardMaterial({
           color: 0x00ffff,
           emissive: 0x00ffff,
           emissiveIntensity: 2.0,
           roughness: 0.2
         });
       case 'GLASS':
         return new THREE.MeshPhysicalMaterial({
           color: 0xffffff,
           transparent: true,
           opacity: 0.4,
           roughness: 0.1,
           transmission: 0.9,
           thickness: 0.8
         });
       default:
         return new THREE.MeshStandardMaterial({
           color: 0x6366f1,
           roughness: 0.4,
           metalness: 0.2
         });
     }
  }

  /**
   * Applies the composed transitions parameters directly to lighting or scenes.
   */
  applyTransitionFX(renderer: any, transitionType: TransitionType, progress: number) {
    const threeScene = renderer.dangerouslyGetThreeScene();
    
    switch (transitionType) {
      case TransitionType.LIGHT_FLASH:
        threeScene.traverse((child: any) => {
          if (child instanceof THREE.Light) {
            // Amplify light temporarily then settle
            const flashWeight = Math.sin(progress * Math.PI) * 5;
            child.intensity = (child.userData.baseIntensity || 1.0) * (1 + flashWeight);
          }
        });
        break;
      case TransitionType.FADE:
        // Adjust fog or background color to blend
        const blendFactor = progress;
        threeScene.background = new THREE.Color(0x050508).lerp(new THREE.Color(0x221133), blendFactor);
        break;
      default:
        break;
    }
  }
}
