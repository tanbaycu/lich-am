import { useState } from 'react';
import { Clock } from './components/Clock';
import { Prodomo } from './components/ProdomoFeature';
import { Background } from './components/Background';
import { LunarInfo } from './components/LunarInfo';
import { Weather } from './components/Weather';
import { Focus } from './components/Focus';
import { Dock } from './components/Dock';
import { ZenMode } from './components/ZenMode';
import { CalendarWidget } from './components/CalendarWidget';

function App() {
  const [isProdomo, setIsProdomo] = useState(false);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden text-white font-mono">
      {isProdomo ? (
        <Prodomo onExit={() => setIsProdomo(false)} />
      ) : (
        <>
          <Background />
          
          {/* Top Left Area */}
          <ZenMode /> 
          
          {/* Prodomo Card */}
          <div className="absolute top-24 left-8 z-40 animate-fade-in delay-100">
             <button 
                onClick={() => setIsProdomo(true)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center gap-4 p-4 pr-6 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-0.5">Focus Mode</div>
                        <div className="text-lg font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all">
                            PRODOMO
                        </div>
                    </div>
                </div>
             </button>
          </div>
          
          {/* Right Sidebar Container - Prevents Overlap */}
          <div className="absolute top-8 right-8 bottom-8 flex flex-col items-end gap-6 z-40 pointer-events-none">
              {/* Wrapper divs to re-enable pointer events for interactive children */}
              <div className="pointer-events-auto">
                <Weather />
              </div>
              <div className="pointer-events-auto mt-4">
                <CalendarWidget />
              </div>
          </div>
          
          {/* Center Stage */}
          <div className="flex flex-col items-center z-10">
              <Clock />
              <Focus />
          </div>

          {/* Bottom Area */}
          <LunarInfo /> 
          
          <Dock />
          
          {/* Status Line */}
          <div className="hidden md:flex absolute bottom-4 right-4 flex-col items-end opacity-60 text-[0.6rem] tracking-[0.2em] gap-1 pointer-events-none group z-40">
              <span className="font-light text-white/50 group-hover:text-white transition-colors duration-500 lowercase">system: online</span>
              <span className="font-bold text-white group-hover:text-green-400 transition-colors duration-500 text-glow lowercase">
                  made by <span className="text-green-400 group-hover:text-white transition-colors">tanbaycu</span>
              </span>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
