import { useState, useEffect, useRef } from 'react';
import { Calendar, Gift, Heart, Flag, X, Clock, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

const EVENTS = [
    { name: "Giáng Sinh 2025", date: "2025-12-24", icon: <Gift size={24} />, color: "text-green-400", desc: "Merry Christmas!" },
    { name: "Năm Mới 2026", date: "2026-01-01", icon: <Zap size={24} />, color: "text-yellow-300", desc: "New Year Celebration" },
    { name: "Tết Nguyên Đán", date: "2026-02-17", icon: <Gift size={24} />, color: "text-red-500", desc: "Year of the Horse" },
    { name: "Valentine", date: "2026-02-14", icon: <Heart size={24} />, color: "text-pink-400", desc: "Love Season" },
    { name: "Thi THPT QG 26", date: "2026-06-11", icon: <Calendar size={24} />, color: "text-blue-400", desc: "National Exam" },
    { name: "Quốc Khánh", date: "2026-09-02", icon: <Flag size={24} />, color: "text-yellow-500", desc: "Independence Day" },
];

export const CalendarWidget = () => {
  const [daysLeft, setDaysLeft] = useState(0);
  const [nearestEvent, setNearestEvent] = useState(EVENTS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const futureEvents = EVENTS.map(e => ({
        ...e,
        diff: differenceInDays(new Date(e.date), today)
    })).filter(e => e.diff >= 0).sort((a, b) => a.diff - b.diff);

    if (futureEvents.length > 0) {
        setNearestEvent(futureEvents[0]);
        setDaysLeft(futureEvents[0].diff);
    }
  }, []);

  const scrollTimeline = (dir: 'left' | 'right') => {
      if (scrollRef.current) {
          const scrollAmount = 400;
          scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
  };

  return (
    <>
        {/* Artistic Minimal Widget (Relative now, positioned by Parent) */}
        <div 
            className="group cursor-pointer animate-fade-in" 
            onClick={() => setIsOpen(true)}
        >
            <div className="relative flex flex-col items-end gap-1">
                {/* Decorative Line */}
                <div className={`absolute -right-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-${nearestEvent.color.split('-')[1]}-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                         <span className="text-[10px] font-mono font-bold text-white/40 tracking-[0.3em] uppercase transition-colors group-hover:text-white/80">
                             Next Event
                         </span>
                         <span className={`text-sm font-mono font-bold ${nearestEvent.color} tracking-widest uppercase text-glow`}>
                             {nearestEvent.name}
                         </span>
                    </div>
                    {/* Icon Container */}
                    <div className="p-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                         <div className={`${nearestEvent.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                            {nearestEvent.icon}
                         </div>
                    </div>
                </div>

                {/* Big Number Display */}
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-6xl font-mono font-bold text-white tracking-tighter leading-none group-hover:translate-x-[-5px] transition-transform duration-500">
                        {daysLeft}
                    </span>
                    <span className="text-xs font-mono text-white/30 rotate-[-90deg] origin-left translate-y-[-10px]">
                        DAYS
                    </span>
                </div>
            </div>
        </div>

        {/* Horizontal Timeline Modal */}
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in text-white" onClick={() => setIsOpen(false)}>
                <div className="relative w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6">
                        <h2 className="text-3xl font-mono font-bold text-white tracking-[0.2em] uppercase flex items-center gap-4">
                            <Clock className="w-8 h-8 text-white/50" />
                            Timeline_Horizontal
                        </h2>
                        <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors group">
                            <X className="w-6 h-6 text-white/50 group-hover:text-white" />
                        </button>
                    </div>

                    {/* Timeline Container */}
                    <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
                        
                        {/* Horizontal Line Background */}
                        <div className="absolute left-0 right-0 h-[1px] bg-white/10 top-1/2 -translate-y-1/2 w-full"></div>

                        {/* Scroll Controls */}
                        <button onClick={() => scrollTimeline('left')} className="absolute left-4 z-20 p-4 bg-black/50 hover:bg-white/10 rounded-full backdrop-blur border border-white/10 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => scrollTimeline('right')} className="absolute right-4 z-20 p-4 bg-black/50 hover:bg-white/10 rounded-full backdrop-blur border border-white/10 transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Scrollable Track */}
                        <div 
                            ref={scrollRef}
                            className="flex items-center gap-24 px-24 overflow-x-auto no-scrollbar scroll-smooth w-full h-full pb-12 pt-12 snap-x"
                        >
                            {EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, idx) => {
                                const diff = differenceInDays(new Date(event.date), new Date());
                                const isPast = diff < 0;
                                const isNearest = event.name === nearestEvent.name;

                                return (
                                    <div key={idx} className={`relative flex flex-col items-center min-w-[300px] snap-center group ${isPast ? 'opacity-30 grayscale' : ''}`}>
                                        
                                        {/* Connector to Line */}
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-black z-10 transition-all duration-500 ${isNearest ? 'border-blue-400 bg-blue-500 scale-125 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'border-white/30 group-hover:border-white'}`}></div>
                                        
                                        {/* Content Card - Alternating Top/Bottom */}
                                        <div className={`
                                            transition-all duration-500 transform
                                            ${idx % 2 === 0 ? '-translate-y-[calc(50%+40px)]' : 'translate-y-[calc(50%+40px)]'}
                                            bg-white/5 border border-white/10 p-6 rounded-2xl w-full
                                            hover:bg-white/10 hover:border-white/30 hover:scale-105
                                            shadow-2xl backdrop-blur-lg
                                        `}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`${event.color} p-2 bg-white/5 rounded-lg`}>{event.icon}</div>
                                                <span className={`text-xs font-mono border px-2 py-0.5 rounded ${diff < 0 ? 'border-white/20 text-white/30' : 'border-green-500/30 text-green-400 bg-green-500/10'}`}>
                                                    {diff < 0 ? 'DONE' : `${diff} DAYS`}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold font-mono text-white mb-1">{event.name}</h3>
                                            <p className="text-sm font-mono text-white/50 tracking-wide uppercase">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
                                            
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <p className="text-xs text-white/40 italic">"{event.desc}"</p>
                                            </div>
                                        </div>

                                        {/* Vertical Line Connector */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] bg-white/20 -z-10
                                            ${idx % 2 === 0 ? 'bottom-[50%] h-[40px]' : 'top-[50%] h-[40px]'}
                                        `}></div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};
