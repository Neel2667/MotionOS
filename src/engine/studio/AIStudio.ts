import { globalStudioSession, StudioSessionState } from './StudioSession';
import { globalWorkflowManager, WorkflowStep } from './WorkflowManager';
import { globalGenerationEngine } from './GenerationEngine';
import { globalValidationEngine, ProjectHealthReport } from './ValidationEngine';
import { globalRecommendationEngine, SmartRecommendation } from './RecommendationEngine';
import { globalTemplateLibrary } from '../templates/TemplateLibrary';
import { Project } from '../project/Project';

export class AIStudio {
  getSessionState(): StudioSessionState {
    return globalStudioSession.getState();
  }

  getWorkflowSteps(): WorkflowStep[] {
    return globalWorkflowManager.getSteps();
  }

  getCurrentStep(): WorkflowStep {
    return globalWorkflowManager.getCurrentStep();
  }

  getRecommendations(project: Project): SmartRecommendation[] {
    const style = project.sceneState?.brandStyle || null;
    return globalRecommendationEngine.getRecommendationsForBrand(style);
  }

  validate(project: Project): ProjectHealthReport {
    return globalValidationEngine.validateProject(project);
  }

  resetSession() {
    globalStudioSession.reset();
  }
}

export const globalAIStudio = new AIStudio();
export default globalAIStudio;
