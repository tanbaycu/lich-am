import { Clock } from './components/Clock';
import { Background } from './components/Background';
import { LunarInfo } from './components/LunarInfo';
import { Weather } from './components/Weather';
import { Focus } from './components/Focus';
import { Dock } from './components/Dock';
import { ZenMode } from './components/ZenMode';
import { CalendarWidget } from './components/CalendarWidget';

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden text-white font-mono">
      <Background />
      
      {/* Top Left Area */}
      <ZenMode /> 
      
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
    </main>
  );
}

export default App;
