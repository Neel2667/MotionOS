import { useState } from 'react';
import { EditorView } from './components/EditorView';
import { DashboardView } from './components/DashboardView';
import { Navigation } from './components/Navigation';
import { AIDirectorView } from './components/AIDirectorView';

export default function App() {
  const [currentView, setCurrentView] = useState('AI_DIRECTOR');

  return (
    <div className="w-full h-screen bg-[#0d0d0d] overflow-hidden text-neutral-300 flex font-sans selection:bg-indigo-500/30">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative h-full">
        {currentView === 'EDITOR' && <EditorView />}
        {currentView === 'AI_DIRECTOR' && <AIDirectorView onPlay={() => setCurrentView('EDITOR')} />}
        {currentView !== 'EDITOR' && currentView !== 'AI_DIRECTOR' && <DashboardView view={currentView} setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}
