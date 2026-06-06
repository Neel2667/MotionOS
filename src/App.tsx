/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { createDemo } from './engine/examples/demo';
import { Engine } from './engine/Engine';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = createDemo(canvasRef.current);
    }
    
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-[#111111] overflow-hidden text-white flex flex-col font-sans">
      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md z-10 absolute w-full">
        <h1 className="font-bold text-lg tracking-tight">MotionOS</h1>
        <div className="text-xs font-mono text-white/50 tracking-wider">ENGINE v0.0.1 (MILESTONE 1)</div>
      </header>
      
      <main className="flex-1 relative w-full h-full">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full display-block focus:outline-none"
        />
        
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/30 pointer-events-none">
          <p>ENGINE STATUS: RUNNING</p>
          <p>RENDERER: WEBGL</p>
        </div>
      </main>
    </div>
  );
}

