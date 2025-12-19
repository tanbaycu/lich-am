import { useEffect, useState } from 'react';
// @ts-ignore
import { SolarDate } from 'lunar-date-vn'; 
import { Moon, Sun, Sparkles } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';

export const LunarInfo = () => {
  const [lunarDate, setLunarDate] = useState<any>(null);
  const [solarDate, setSolarDate] = useState<Date | null>(null);

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

  return (
    <div className="absolute bottom-16 left-16 z-50 animate-fade-in pointer-events-auto">
        <CardSwap 
            width="280px" 
            height="100px" 
            cardDistance={40} 
            verticalDistance={30} 
            delay={4000} 
            pauseOnHover={true}
            skewAmount={2}
        >
            
            {/* Card 1: Lunar Date */}
            <Card customClass="flex items-center p-4 bg-black/60 backdrop-blur-2xl border border-indigo-500/50 rounded-2xl overflow-hidden group hover:border-indigo-400 hover:bg-black/70 shadow-[0_8px_32px_rgba(31,38,135,0.37)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
                    <Moon className="w-6 h-6 text-indigo-300" />
                 </div>
                 
                 <div className="ml-5 flex flex-col relative z-10">
                    <span className="text-[10px] font-mono font-bold text-indigo-300 tracking-[0.2em] uppercase mb-1">Lich Am</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-mono text-white tracking-widest leading-none drop-shadow-md">
                            {lunarDate.day < 10 ? `0${lunarDate.day}` : lunarDate.day}
                        </span>
                        <span className="text-sm font-mono text-white/50">/ {lunarDate.month < 10 ? `0${lunarDate.month}` : lunarDate.month}</span>
                    </div>
                 </div>
            </Card>

            {/* Card 2: Solar Date */}
            <Card customClass="flex items-center p-4 bg-black/60 backdrop-blur-2xl border border-orange-500/50 rounded-2xl overflow-hidden group hover:border-orange-400 hover:bg-black/70 shadow-[0_8px_32px_rgba(31,38,135,0.37)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0">
                    <Sun className="w-6 h-6 text-orange-300" />
                 </div>
                 
                 <div className="ml-5 flex flex-col relative z-10">
                    <span className="text-[10px] font-mono font-bold text-orange-300 tracking-[0.2em] uppercase mb-1">Duong Lich</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-mono text-white tracking-widest leading-none drop-shadow-md">
                            {solarDate.getDate() < 10 ? `0${solarDate.getDate()}` : solarDate.getDate()}
                        </span>
                        <span className="text-xs font-mono text-white/50 italic">
                             {solarDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                 </div>
            </Card>

            {/* Card 3: Zodiac / Year Info */}
            <Card customClass="flex items-center p-4 bg-black/60 backdrop-blur-2xl border border-purple-500/50 rounded-2xl overflow-hidden group hover:border-purple-400 hover:bg-black/70 shadow-[0_8px_32px_rgba(31,38,135,0.37)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-300" />
                 </div>
                 
                 <div className="ml-5 flex flex-col relative z-10">
                    <span className="text-[10px] font-mono font-bold text-purple-300 tracking-[0.2em] uppercase mb-1">Nam {lunarDate.year}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-mono text-white drop-shadow-md">Ất Tỵ</span>
                        <div className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-bold text-white/70 uppercase">Snake</div>
                    </div>
                 </div>
            </Card>

        </CardSwap>
    </div>
  );
};
