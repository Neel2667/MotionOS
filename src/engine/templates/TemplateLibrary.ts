import { IndustryTemplate, industryTemplates } from './IndustryTemplates';
import { MotionPreset, motionPresets } from './MotionTemplates';
import { CameraPreset, cameraPresets } from './CameraTemplates';
import { FXPreset, fxPresets } from './FXTemplates';
import { Project, ProjectSceneState } from '../project/Project';

export class TemplateLibrary {
  getIndustryTemplate(id: string): IndustryTemplate | undefined {
    return industryTemplates[id.toLowerCase()];
  }

  getIndustryTemplates(): IndustryTemplate[] {
    return Object.values(industryTemplates);
  }

  getMotionPresets(): MotionPreset[] {
    return motionPresets;
  }

  getCameraPresets(): CameraPreset[] {
    return cameraPresets;
  }

  getFXPresets(): FXPreset[] {
    return fxPresets;
  }

  applyIndustryTemplate(project: Project, templateId: string): Project {
    const template = this.getIndustryTemplate(templateId);
    if (!template) return project;

    const updatedProject = { ...project };

    // Apply scene stats
    updatedProject.sceneState = {
      ...updatedProject.sceneState,
      brandStyle: template.brandStyle,
      activeFX: [...template.fx.activeFX],
      activeMaterials: [...template.materials.activeMaterials],
      cameraSettings: {
        fov: template.camera.fov,
        near: 0.1,
        far: 1000,
        position: template.camera.position,
        lookAt: template.camera.lookAt,
        enableDof: template.camera.enableDof,
        focusDistance: template.camera.focusDistance
      },
      lightingRig: template.lighting.rigName
    };

    // Synthesize motion timeline tracks based on template specifications
    updatedProject.timelineTracks = [
      {
        id: 'track_1',
        name: `${template.name} Motion Track`,
        type: 'TRANSFORM',
        muted: false,
        locked: false,
        keyframes: [
          { id: 'kf_t1', time: 0, value: { scale: 0.3, rotation: 0, speed: template.motion.speedMultiplier }, easing: template.motion.easing },
          { id: 'kf_t2', time: template.motion.duration, value: { scale: 1.0, rotation: 360 * template.motion.amplitude, speed: template.motion.speedMultiplier }, easing: template.motion.easing }
        ]
      },
      {
        id: 'track_2',
        name: `${template.name} Particle Glow`,
        type: 'FX_PULSE',
        muted: false,
        locked: false,
        keyframes: [
          { id: 'kf_t3', time: 0, value: { count: template.fx.particleCount / 5, bloom: template.fx.bloomIntensity } },
          { id: 'kf_t4', time: template.motion.duration / 2, value: { count: template.fx.particleCount, bloom: template.fx.bloomIntensity * 1.5 } },
          { id: 'kf_t5', time: template.motion.duration, value: { count: template.fx.particleCount / 3, bloom: template.fx.bloomIntensity } }
        ]
      }
    ];

    // Assign template tags as mock asset paths to trigger vector renderer indices
    updatedProject.metadata.description = `Active rendering layout utilizing "${template.name}" DNA architecture template. Typography: ${template.typography.fontFamily}.`;

    return updatedProject;
  }
}

export const globalTemplateLibrary = new TemplateLibrary();
export default globalTemplateLibrary;
