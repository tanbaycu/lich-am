import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface Session {
    date: number;
    duration: number; // in minutes
    mode: string;
}

export const Stats = () => {
    const [statsData, setStatsData] = useState<{ day: string; hours: number; isToday: boolean }[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);

    useEffect(() => {
        const loadStats = () => {
            try {
                const sessions: Session[] = JSON.parse(localStorage.getItem('prodomo-sessions') || '[]');
                
                const totalMins = sessions.reduce((acc, curr) => acc + curr.duration, 0);
                setTotalHours(parseFloat((totalMins / 60).toFixed(1)));
                setTotalSessions(sessions.length);

                // Calculate Streak
                // Sort sessions by date descending
                const uniqueDays = Array.from(new Set(sessions.map(s => format(new Date(s.date), 'yyyy-MM-dd')))).sort().reverse();
                let streak = 0;
                const today = format(new Date(), 'yyyy-MM-dd');
                const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');
                
                if (uniqueDays.length > 0) {
                     if (uniqueDays[0] === today) {
                         streak = 1;
                         for (let i = 1; i < uniqueDays.length; i++) {
                             if (uniqueDays[i] === format(addDays(new Date(), -i), 'yyyy-MM-dd')) {
                                 streak++;
                             } else {
                                 break;
                             }
                         }
                     } else if (uniqueDays[0] === yesterday) {
                        // Better Logic:
                        let current = new Date();
                         let tempStreak = 0;
                         // Check today
                         if (uniqueDays.includes(format(current, 'yyyy-MM-dd'))) {
                             tempStreak++;
                             current = addDays(current, -1);
                         } else {
                             // If not today, did we do yesterday?
                             if (!uniqueDays.includes(format(addDays(current, -1), 'yyyy-MM-dd'))) {
                                 tempStreak = 0;
                             } else {
                                 current = addDays(current, -1);
                             }
                         }
                         
                         // Count backwards
                         while (uniqueDays.includes(format(current, 'yyyy-MM-dd'))) {
                             tempStreak++;
                             current = addDays(current, -1);
                         }
                         // Fix double count if started with today
                         if (uniqueDays.includes(format(new Date(), 'yyyy-MM-dd'))) tempStreak--; 
                         // Wait, simpler: just iterate uniqueDays and check gap
                         
                         let efficientStreak = 0;
                         let checkDate = new Date();
                         // Allow today to be missing but streak valid if yesterday present
                         if (!uniqueDays.includes(format(checkDate, 'yyyy-MM-dd'))) {
                             checkDate = addDays(checkDate, -1);
                         }
                         
                         for (let i = 0; i < uniqueDays.length; i++) {
                             if (uniqueDays.includes(format(checkDate, 'yyyy-MM-dd'))) {
                                 efficientStreak++;
                                 checkDate = addDays(checkDate, -1);
                             } else {
                                 break;
                             }
                         }
                         streak = efficientStreak;
                     }
                }
                setCurrentStreak(streak);

                const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 }); 
                const weekData = Array.from({ length: 7 }, (_, i) => {
                    const currentDay = addDays(startOfCurrentWeek, i);
                    const daySessions = sessions.filter(s => isSameDay(new Date(s.date), currentDay));
                    const dayHours = daySessions.reduce((acc, curr) => acc + curr.duration, 0) / 60;

                    return {
                        day: format(currentDay, 'EEE'),
                        hours: dayHours,
                        isToday: isSameDay(currentDay, new Date()),
                    };
                });
                
                setStatsData(weekData);
            } catch (e) {
                console.error('Failed to load stats', e);
            }
        };

        loadStats();
        const interval = setInterval(loadStats, 5000); 
        return () => clearInterval(interval);

    }, []);

    const maxHours = Math.max(...statsData.map(d => d.hours), 1); 

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                        </svg>
                    </div>
                    STATS
                </h2>
                {currentStreak > 1 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold animate-pulse-slow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                        </svg>
                        {currentStreak} DAY STREAK
                    </div>
                )}
            </div>

            <div className="flex-1 flex items-end justify-between gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                {statsData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group w-full h-full justify-end">
                         {/* Bar Container */}
                         <div className="w-full relative h-full flex items-end justify-center">
                             <div 
                                className={`w-full max-w-[12px] md:max-w-[24px] rounded-t-full transition-all duration-1000 ease-out group-hover:scale-y-110 origin-bottom ${d.isToday ? 'bg-gradient-to-t from-purple-600 to-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/10 group-hover:bg-white/20'}`}
                                style={{ height: `${Math.max((d.hours / maxHours) * 100, 5)}%` }}
                             >
                                {/* Tooltip */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-white/10 z-10 pointer-events-none shadow-xl -translate-y-2 group-hover:translate-y-0">
                                    {d.hours.toFixed(1)}h
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                             </div>
                         </div>
                         {/* Label */}
                         <div className={`text-[10px] md:text-xs font-mono font-bold ${d.isToday ? 'text-purple-400' : 'text-white/20'}`}>
                             {d.day[0]}
                         </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                     <div className="text-3xl font-bold text-white mb-1 tracking-tighter">{totalHours}</div>
                     <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Hours Focus</div>
                 </div>
                 <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                     <div className="text-3xl font-bold text-white mb-1 tracking-tighter">{totalSessions}</div>
                     <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Sessions</div>
                 </div>
            </div>
        </div>
    );
};
