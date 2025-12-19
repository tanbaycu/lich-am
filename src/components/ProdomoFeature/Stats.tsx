import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Activity, Flame, Clock, Calendar } from 'lucide-react';

interface Session {
    date: number;
    duration: number; // in minutes
    mode: string;
}

export const Stats = () => {
    const [statsData, setStatsData] = useState<any[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        totalHours: 0,
        totalSessions: 0,
        streak: 0,
        dailyAverage: 0
    });

    useEffect(() => {
        const loadStats = () => {
            try {
                const sessions: Session[] = JSON.parse(localStorage.getItem('prodomo-sessions') || '[]');
                
                // === 1. Summary Calculation ===
                const totalMins = sessions.reduce((acc, curr) => acc + curr.duration, 0);
                const totalHours = parseFloat((totalMins / 60).toFixed(1));
                
                // Streak Logic
                const uniqueDays = Array.from(new Set(sessions.map(s => format(new Date(s.date), 'yyyy-MM-dd')))).sort().reverse();
                let streak = 0;
                let checkDate = new Date();
                
                // If not today, check if yesterday exists to maintain streak
                if (!uniqueDays.includes(format(checkDate, 'yyyy-MM-dd'))) {
                    checkDate = addDays(checkDate, -1);
                }
                
                for (let i = 0; i < uniqueDays.length; i++) {
                     if (uniqueDays.includes(format(checkDate, 'yyyy-MM-dd'))) {
                         streak++;
                         checkDate = addDays(checkDate, -1);
                     } else {
                         break;
                     }
                }

                setSummary({
                    totalHours,
                    totalSessions: sessions.length,
                    streak,
                    dailyAverage: uniqueDays.length > 0 ? parseFloat((totalHours / uniqueDays.length).toFixed(1)) : 0
                });

                // === 2. Weekly Bar Chart Data ===
                const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
                const weekData = Array.from({ length: 7 }, (_, i) => {
                    const currentDay = addDays(startOfCurrentWeek, i);
                    const daySessions = sessions.filter(s => isSameDay(new Date(s.date), currentDay));
                    const dayHours = daySessions.reduce((acc, curr) => acc + curr.duration, 0) / 60;

                    return {
                        name: format(currentDay, 'EEE'),
                        hours: parseFloat(dayHours.toFixed(1)),
                        fullDate: format(currentDay, 'dd/MM'),
                        isToday: isSameDay(currentDay, new Date()),
                    };
                });
                setStatsData(weekData);

                // === 3. Distribution Pie Chart ===
                const modeDistribution = sessions.reduce((acc: any, curr) => {
                    acc[curr.mode] = (acc[curr.mode] || 0) + curr.duration;
                    return acc;
                }, {});

                const pData = Object.keys(modeDistribution).map(key => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value: modeDistribution[key]
                }));
                // Provide default if empty
                setPieData(pData.length ? pData : [{ name: 'Focus', value: 100 }]);

            } catch (e) {
                console.error('Failed to load stats', e);
            }
        };

        loadStats();
        // Live update listeners could go here
    }, []);

    const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b'];

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <StatCard 
                    icon={<Clock className="w-5 h-5 text-purple-400" />}
                    label="Total Hours"
                    value={summary.totalHours.toString()}
                    subValue="All time focus"
                    color="purple"
                 />
                 <StatCard 
                    icon={<Flame className="w-5 h-5 text-orange-400" />}
                    label="Current Streak"
                    value={`${summary.streak} Days`}
                    subValue="Keep it up!"
                    color="orange"
                 />
                 <StatCard 
                    icon={<Activity className="w-5 h-5 text-blue-400" />}
                    label="Daily Average"
                    value={`${summary.dailyAverage}h`}
                    subValue="Consistency is key"
                    color="blue"
                 />
                 <StatCard 
                    icon={<Calendar className="w-5 h-5 text-emerald-400" />}
                    label="Sessions"
                    value={summary.totalSessions.toString()}
                    subValue="Total sessions completed"
                    color="emerald"
                 />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[300px]">
                
                {/* Main Weekly Chart */}
                <div className="md:col-span-2 bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white/80">
                        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                        Weekly Activity
                    </h3>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#ffffff50" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#ffffff50" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}h`}
                                />
                                <Tooltip 
                                    cursor={{fill: '#ffffff10'}}
                                    contentStyle={{ 
                                        backgroundColor: '#18181b', 
                                        borderRadius: '12px', 
                                        border: '1px solid #ffffff20',
                                        color: 'white'
                                    }}
                                    itemStyle={{ color: '#a855f7' }}
                                />
                                <Bar 
                                    dataKey="hours" 
                                    fill="#a855f7" 
                                    radius={[6, 6, 0, 0]}
                                    activeBar={{ fill: '#c084fc' }}
                                >
                                    {statsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isToday ? '#c084fc' : '#581c87'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white/80">
                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                        Mode Split
                    </h3>
                    <div className="flex-1 w-full min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#18181b', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ffffff20',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-sm text-white/40 font-bold tracking-widest uppercase">Ratio</div>
                        </div>
                    </div>
                    {/* Horizontal Legend */}
                    <div className="mt-4 flex flex-wrap gap-3 justify-center">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subValue, color }: any) => {
    // Dynamic styles based on color prop could be enhanced here
    return (
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 hover:bg-white/10 transition-colors group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">{label}</div>
                <div className="text-[10px] text-white/30">{subValue}</div>
            </div>
        </div>
    );
};

