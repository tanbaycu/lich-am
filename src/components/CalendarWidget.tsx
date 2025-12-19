import { useState, useEffect, useRef } from 'react';
import { Calendar, Gift, Heart, Flag, X, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 text-white" onClick={() => setIsOpen(false)}>
                <div className="relative w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-12 py-10 z-50 pointer-events-none">
                        <div className="flex flex-col">
                            <h2 className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-[0.2em] uppercase">
                                Chrono_Stream
                            </h2>
                            <span className="text-xs text-white/30 font-mono mt-2 tracking-widest">FUTURE EVENTS • MILESTONES</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="pointer-events-auto p-4 hover:bg-white/5 rounded-full transition-all group border border-white/5 hover:border-white/20">
                            <X className="w-8 h-8 text-white/30 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Timeline Container */}
                    <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
                        
                        {/* Horizontal Line Background (The Beam) */}
                        <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent top-1/2 -translate-y-1/2 w-full z-0"></div>
                        <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-1/2 -translate-y-1/2 w-full blur-sm z-0"></div>

                        {/* Scroll Controls */}
                        <button onClick={() => scrollTimeline('left')} className="absolute left-8 z-20 p-6 hover:bg-white/5 rounded-full transition-all group">
                            <ChevronLeft className="w-8 h-8 text-white/20 group-hover:text-white group-hover:scale-125 transition-all" />
                        </button>
                        <button onClick={() => scrollTimeline('right')} className="absolute right-8 z-20 p-6 hover:bg-white/5 rounded-full transition-all group">
                            <ChevronRight className="w-8 h-8 text-white/20 group-hover:text-white group-hover:scale-125 transition-all" />
                        </button>

                        {/* Scrollable Track */}
                        <div 
                            ref={scrollRef}
                            className="flex items-center gap-32 px-40 overflow-x-auto no-scrollbar scroll-smooth w-full h-full pb-12 pt-12 snap-x"
                        >
                            {EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, idx) => {
                                const diff = differenceInDays(new Date(event.date), new Date());
                                const isPast = diff < 0;
                                const isNearest = event.name === nearestEvent.name;

                                return (
                                    <div key={idx} className={`relative flex flex-col items-center min-w-[200px] snap-center group ${isPast ? 'opacity-20 grayscale' : ''}`}>
                                        
                                        {/* The Node */}
                                        <div className={`
                                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                            w-3 h-3 rounded-full z-10 
                                            transition-all duration-500
                                            ${isNearest ? 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] scale-150' : 'bg-black border border-white/30 group-hover:border-white group-hover:bg-white group-hover:scale-125'}
                                        `}>
                                            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isNearest ? 'bg-white' : 'hidden'}`}></div>
                                        </div>
                                        
                                        {/* Content - Floating, No Cards */}
                                        <div className={`
                                            transition-all duration-700 transform px-8
                                            ${idx % 2 === 0 ? '-translate-y-[calc(50%+60px)] group-hover:-translate-y-[calc(50%+70px)]' : 'translate-y-[calc(50%+60px)] group-hover:translate-y-[calc(50%+70px)]'}
                                            flex flex-col items-center text-center w-[300px]
                                        `}>
                                            {/* Icon */}
                                            <div className={`mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${event.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                                                {event.icon}
                                            </div>

                                            {/* Name */}
                                            <h3 className="text-2xl font-bold font-mono text-white tracking-tighter mb-2 group-hover:text-shadow-glow transition-all">
                                                {event.name}
                                            </h3>

                                            {/* Days Left - Stylized */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold tracking-[0.2em] px-3 py-1 border rounded-full ${diff < 0 ? 'border-white/10 text-white/20' : 'border-white/20 text-white/60 group-hover:border-white/50 group-hover:text-white'}`}>
                                                    {diff < 0 ? 'COMPLETED' : `${diff} DAYS LEFT`}
                                                </span>
                                            </div>

                                            {/* Date */}
                                            <p className="text-xs font-mono text-white/30 uppercase tracking-widest">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
                                            
                                            {/* Description - Fade in on hover */}
                                            <p className="mt-4 text-xs text-white/40 italic opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-serif">
                                                "{event.desc}"
                                            </p>
                                        </div>

                                        {/* Vertical Line Connector (Subtle) */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent -z-10
                                            ${idx % 2 === 0 ? 'bottom-[50%] h-[60px] group-hover:h-[70px]' : 'top-[50%] h-[60px] group-hover:h-[70px]'}
                                            transition-all duration-500
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
