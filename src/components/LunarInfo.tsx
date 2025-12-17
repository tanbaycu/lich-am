import { useEffect, useState, useRef } from 'react';
// @ts-ignore
import { SolarDate } from 'lunar-date-vn'; 
import { Moon, Sun, Sparkles } from 'lucide-react';

export const LunarInfo = () => {
  const [lunarDate, setLunarDate] = useState<any>(null);
  const [solarDate, setSolarDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const now = new Date();
      setSolarDate(now);
      const solar = new SolarDate(now); 
      const lunar = solar.toLunarDate();
      setLunarDate(lunar);
    } catch (e) { console.error(e); }
  }, []);

  if (!lunarDate || !solarDate) return null;

  const handleScroll = (e: React.WheelEvent) => {
      // Prevent default page scroll if possible, though easier on a widget
      if (e.deltaY > 0) {
          setViewMode((prev) => (prev + 1) % 3);
      } else {
          setViewMode((prev) => (prev - 1 + 3) % 3);
      }
  };

  return (
    <div className="absolute bottom-10 left-10 z-50 animate-fade-in">
        {/* Capsule Container */}
        <div 
            ref={containerRef}
            onWheel={handleScroll}
            className="group relative flex items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full h-16 w-64 px-2 transition-all duration-300 hover:border-white/30 cursor-ns-resize select-none overflow-hidden shadow-2xl"
        >
            {/* Background Gradient Mesh (Subtle) */}
            <div className={`absolute inset-0 opacity-30 transition-colors duration-700 bg-gradient-to-r ${
                viewMode === 0 ? 'from-indigo-900 via-transparent to-transparent' :
                viewMode === 1 ? 'from-orange-900 via-transparent to-transparent' :
                'from-purple-900 via-transparent to-transparent'
            }`}></div>

            {/* Floating Icon Orb */}
            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 ${
                 viewMode === 0 ? 'bg-gradient-to-tr from-indigo-500 to-blue-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]' :
                 viewMode === 1 ? 'bg-gradient-to-tr from-orange-400 to-red-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]' :
                 'bg-gradient-to-tr from-purple-500 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
            }`}>
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse-slow"></div>
                {viewMode === 0 && <Moon className="w-5 h-5 text-indigo-100" />}
                {viewMode === 1 && <Sun className="w-5 h-5 text-orange-100" />}
                {viewMode === 2 && <Sparkles className="w-5 h-5 text-purple-100" />}
            </div>

            {/* Text Content Area */}
            <div className="flex-1 h-full relative overflow-hidden ml-4 flex flex-col justify-center">
                
                {/* View 0: Lunar */}
                <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                    viewMode === 0 ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 -translate-y-full blur-sm'
                }`}>
                    <span className="text-[10px] text-indigo-300 font-mono tracking-[0.2em] uppercase">Lich Am</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-white">{lunarDate.day < 10 ? `0${lunarDate.day}` : lunarDate.day}</span>
                        <span className="text-sm font-mono text-white/50">/ {lunarDate.month < 10 ? `0${lunarDate.month}` : lunarDate.month}</span>
                    </div>
                </div>

                {/* View 1: Solar */}
                <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                    viewMode === 1 ? 'opacity-100 translate-y-0 filter-none' : viewMode < 1 ? 'opacity-0 translate-y-full blur-sm' : 'opacity-0 -translate-y-full blur-sm'
                }`}>
                    <span className="text-[10px] text-orange-300 font-mono tracking-[0.2em] uppercase">Duong Lich</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-white">{solarDate.getDate() < 10 ? `0${solarDate.getDate()}` : solarDate.getDate()}</span>
                        <span className="text-sm font-mono text-white/50">/ {solarDate.getMonth() + 1} / {solarDate.getFullYear()}</span>
                    </div>
                </div>

                 {/* View 2: Info */}
                 <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                    viewMode === 2 ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-full blur-sm'
                }`}>
                    <span className="text-[10px] text-purple-300 font-mono tracking-[0.2em] uppercase">{lunarDate.year}</span>
                    <div className="flex items-center gap-2">
                         <span className="text-xl font-bold font-mono text-white">Ất Tỵ</span>
                         <span className="px-2 py-[2px] rounded text-[10px] bg-white/10 text-white/60 border border-white/10">Snake</span>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator (Right side dots) */}
            <div className="flex flex-col gap-1 pr-2 opacity-30">
                <div className={`w-1 h-1 rounded-full bg-white transition-all ${viewMode === 0 ? 'scale-150 opacity-100' : ''}`}></div>
                <div className={`w-1 h-1 rounded-full bg-white transition-all ${viewMode === 1 ? 'scale-150 opacity-100' : ''}`}></div>
                <div className={`w-1 h-1 rounded-full bg-white transition-all ${viewMode === 2 ? 'scale-150 opacity-100' : ''}`}></div>
            </div>

        </div>
    </div>
  );
};
