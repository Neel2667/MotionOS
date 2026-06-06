import { 
  Home, FolderGit2, Edit3, Box, Palette, Dna, 
  Layers, Clock, Settings, BrainCircuit, Cpu 
} from 'lucide-react';

export function Navigation({ currentView, setCurrentView }: { currentView: string, setCurrentView: (v: string) => void }) {
  const navItems = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'PROJECTS', icon: FolderGit2, label: 'Projects' },
    { id: 'AI_DIRECTOR', icon: BrainCircuit, label: 'AI Director' },
    { id: 'COMPOSER', icon: Cpu, label: 'Animation Composer' },
    { id: 'EDITOR', icon: Edit3, label: 'Editor' },
    { id: 'ASSETS', icon: Box, label: 'Assets' },
    { id: 'MATERIALS', icon: Palette, label: 'Materials' },
    { id: 'DNA', icon: Dna, label: 'Motion DNA' },
    { id: 'SCENE', icon: Layers, label: 'Scene' },
    { id: 'TIMELINE', icon: Clock, label: 'Timeline' },
  ];

  return (
    <aside className="w-14 items-center bg-[#141414] border-r border-neutral-800 flex flex-col py-4 z-20 shadow-xl">
      <div className="w-8 h-8 rounded-md bg-indigo-500 mb-8 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
        M
      </div>
      
      <div className="flex flex-col gap-4 w-full px-2 mt-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`p-2 rounded-lg transition-all duration-200 group relative flex justify-center ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800'}`}
              title={item.label}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <div className="absolute left-10 bg-black text-white text-xs px-2 py-1 rounded border border-neutral-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-2 w-full">
        <button 
          onClick={() => setCurrentView('SETTINGS')}
          className={`p-2 rounded-lg transition-all duration-200 w-full flex justify-center ${currentView === 'SETTINGS' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800'}`}
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
}
