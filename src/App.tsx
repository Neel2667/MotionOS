import { useState } from 'react';
import { EditorView } from './components/EditorView';
import { DashboardView } from './components/DashboardView';
import { Navigation } from './components/Navigation';
import { AIDirectorView } from './components/AIDirectorView';
import { AnimationComposerView } from './components/AnimationComposerView';
import { ProjectBrowser } from './components/ProjectBrowser';
import { ExportView } from './components/ExportView';
import { RenderQueueView } from './components/RenderQueueView';
import { MediaLibrary } from './components/MediaLibrary';
import { WorkspaceView } from './components/WorkspaceView';

export default function App() {
  const [currentView, setCurrentView] = useState('HOME');

  return (
    <div className="w-full h-screen bg-[#0d0d0d] overflow-hidden text-neutral-300 flex font-sans selection:bg-indigo-500/30">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {currentView === 'WORKSPACE' && <WorkspaceView />}
        {currentView === 'EDITOR' && <EditorView />}
        {currentView === 'AI_DIRECTOR' && <AIDirectorView onPlay={() => setCurrentView('COMPOSER')} />}
        {currentView === 'COMPOSER' && <AnimationComposerView onPlay={() => setCurrentView('EDITOR')} />}
        {currentView === 'PROJECTS' && <ProjectBrowser onProjectSelected={() => setCurrentView('EDITOR')} />}
        {currentView === 'EXPORT' && <ExportView />}
        {currentView === 'RENDER_QUEUE' && <RenderQueueView />}
        {currentView === 'ASSETS' && <MediaLibrary />}
        {currentView !== 'EDITOR' && currentView !== 'AI_DIRECTOR' && currentView !== 'COMPOSER' && 
         currentView !== 'PROJECTS' && currentView !== 'EXPORT' && currentView !== 'RENDER_QUEUE' &&
         currentView !== 'ASSETS' &&
         <DashboardView view={currentView} setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}
