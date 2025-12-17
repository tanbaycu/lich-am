import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center z-10 select-none relative animate-[float_8s_ease-in-out_infinite]">
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
