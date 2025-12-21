import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
// @ts-ignore
import { SolarDate } from 'lunar-date-vn';

export const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [lunarDate, setLunarDate] = useState<any>(null);

  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        setTime(now);
        
        // Calculate Lunar Date
        try {
            const solar = new SolarDate(now);
            const lunar = solar.toLunarDate();
            setLunarDate(lunar);
        } catch (e) {
            console.error(e);
        }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCanChiYear = (year: number) => {
      const can = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"][year % 10];
      const chi = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"][year % 12];
      return `${can} ${chi}`;
  };

  return (
    <div className="flex flex-col items-center justify-center z-10 select-none relative animate-[float_8s_ease-in-out_infinite]">
        
        {/* Special Lunar Date - Highlighted Above Clock */}
        {lunarDate && (
             <div className="mb-4 flex flex-col items-center animate-fade-in">
                 <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center gap-3 group hover:scale-105 transition-transform duration-500 cursor-default">
                    <div className="flex flex-col items-center">
                         <span className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-bold mb-0.5">Lịch Âm</span>
                         <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-bold font-mono text-purple-100 drop-shadow-md">
                                 {lunarDate.day < 10 ? `0${lunarDate.day}` : lunarDate.day}/{lunarDate.month < 10 ? `0${lunarDate.month}` : lunarDate.month}
                             </span>
                             <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-wider">
                                 Năm {getCanChiYear(lunarDate.year)}
                             </span>
                         </div>
                    </div>
                 </div>
             </div>
        )}

        {/* Main Clock - Massive & Clean */}
        <div className="relative leading-none">
            <h1 className="text-[15vw] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl tracking-tighter">
                {format(time, 'HH:mm')}
            </h1>
            
            {/* Seconds - Orbiting or Floating nearby */}
            <div className="absolute -top-4 -right-12 bg-white/10 backdrop-blur-md rounded-full w-24 h-24 flex items-center justify-center border border-white/20 shadow-lg">
                 <span className="text-4xl font-mono text-white font-bold">{format(time, 'ss')}</span>
            </div>
        </div>

        {/* Date - Clean Tech Monospace */}
        <div className="mt-4 px-8 py-3 glass-panel rounded-full flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xl md:text-2xl text-white/90 font-mono uppercase tracking-widest">
                {format(time, 'EEEE, dd MMMM yyyy', { locale: vi })}
            </span>
        </div>
    </div>
  );
};
