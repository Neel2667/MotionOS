import { Project, createNewProject } from './Project';

export interface ValidationSummary {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  patched: boolean;
}

export class ProjectLoader {
  /**
   * Parses and validates a project JSON string.
   * If parts are missing, it attempts to safely auto-patch them.
   */
  public deserializeAndValidate(jsonString: string): { project: Project | null; report: ValidationSummary } {
    const report: ValidationSummary = {
      isValid: true,
      errors: [],
      warnings: [],
      patched: false
    };

    try {
      if (!jsonString || jsonString.trim() === '') {
        throw new Error('Project payload stream is empty.');
      }

      const parsed = JSON.parse(jsonString);

      // Verify metadata schema
      if (!parsed.metadata) {
        report.errors.push('CRITICAL: Project metadata descriptor is missing.');
        report.isValid = false;
      } else {
        if (!parsed.metadata.id) parsed.metadata.id = `proj_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        if (!parsed.metadata.name) parsed.metadata.name = 'Auto Restored Clip';
      }

      // Verify scene parameters
      if (!parsed.sceneState) {
        report.warnings.push('Scene attributes are missing. Creating generic default layout.');
        parsed.sceneState = createNewProject('Fallback').sceneState;
        report.patched = true;
      }

      // Verify layers timeline details
      if (!parsed.timelineTracks || !Array.isArray(parsed.timelineTracks)) {
        report.warnings.push('Timeline tracks are nonexistent or corrupted. Emptying animation lanes.');
        parsed.timelineTracks = [];
        report.patched = true;
      }

      // Verify asset manifests
      if (!parsed.assets || !Array.isArray(parsed.assets)) {
        parsed.assets = [];
        report.patched = true;
      }

      if (!report.isValid) {
        return { project: null, report };
      }

      const project: Project = {
        metadata: parsed.metadata,
        sceneState: parsed.sceneState,
        timelineTracks: parsed.timelineTracks,
        assets: parsed.assets
      };

      return { project, report };
    } catch (e) {
      report.isValid = false;
      report.errors.push(`JSON Decrypt Failure: ${(e as Error).message}`);
      return { project: null, report };
    }
  }
}
