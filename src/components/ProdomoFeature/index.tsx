import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Timer } from './Timer';
import { TaskList } from './TaskList';
import { Stats } from './Stats';
import { Custom } from './Custom';
import { THEMES } from './ThemeSwitcher';
import Aurora from '../Aurora';
import GridMotion from '../GridMotion';
import Beams from '../Beams';
import Lightning from '../Lightning';
import PrismaticBurst from '../PrismaticBurst';
import { Eye, EyeOff, LayoutDashboard, CheckSquare, BarChart2, Sliders } from 'lucide-react';

interface ProdomoProps {
    onExit: () => void;
}

export const Prodomo = ({ onExit }: ProdomoProps) => {
    const [themeId, setThemeId] = useState('aurora');
    const [activeView, setActiveView] = useState<'timer' | 'stats' | 'tasks' | 'custom'>('timer');
    const [time, setTime] = useState(new Date());
    const [intent, setIntent] = useState('');
    const [immersiveMode, setImmersiveMode] = useState(false);

    useEffect(() => {
        setIntent(localStorage.getItem('prodomo-intent') || '');
    }, []);

    const updateIntent = (val: string) => {
        setIntent(val);
        localStorage.setItem('prodomo-intent', val);
    };

    const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center text-white font-mono animate-in fade-in duration-500 bg-black overflow-hidden selection:bg-purple-500/30">
             {/* Background / Theme Layer */}
            <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${activeTheme.bgClass}`}>
                {themeId === 'aurora' && (
                    <div className="absolute inset-0 opacity-60">
                        <Aurora colorStops={['#00d2ff', '#3a7bd5', '#00d2ff']} speed={0.5} />
                    </div>
                )}
                {themeId === 'grid-motion' && (
                     <GridMotion gradientColor="#000" />
                )}
                {themeId === 'beams' && (
                     <Beams />
                )}
                {themeId === 'lightning' && (
                     <div className="absolute inset-0 -z-10 bg-black">
                         <Lightning />
                     </div>
                )}
                {themeId === 'prismatic' && (
                     <div className="absolute inset-0 -z-10 bg-black">
                        <PrismaticBurst />
                     </div>
                )}
            </div>
            
            {/* Overlay Pattern */}
            <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            {/* Header Controls - Hidden in Immersive Mode */}
            <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-40 pointer-events-none transition-all duration-500 ${immersiveMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                {/* Left: Branding */}
                <div className="flex flex-col pointer-events-auto">
                     <span className="text-xl font-bold tracking-tighter">PRODOMO</span>
                     <span className="text-[10px] opacity-50 tracking-[0.3em] uppercase">Focus System</span>
                </div>

                {/* Right: Controls - Pointer Events Enabled */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Immersive Toggle */}
                     <button 
                        onClick={() => setImmersiveMode(true)}
                        className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                        title="Immersive Mode"
                    >
                        <EyeOff className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={onExit} 
                        className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300 group"
                        title="Exit Prodomo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Immersive Exit Button - Floating Bottom Center */}
            {immersiveMode && (
                <button 
                    onClick={() => setImmersiveMode(false)}
                    className="absolute bottom-12 z-50 p-4 rounded-full bg-white/5 border border-white/10 text-white/30 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-500 animate-in fade-in zoom-in backdrop-blur-sm"
                >
                    <Eye className="w-6 h-6" />
                </button>
            )}

            {/* Main Content Area */}
            <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-8">
                
                {/* VIEW: TIMER (Default) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${activeView === 'timer' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                     <div className="animate-[float_8s_ease-in-out_infinite] scale-125">
                         <Timer />
                     </div>
                     
                     {/* Minimal Intent Display (Read-only) if set */}
                     {!immersiveMode && intent && (
                         <div className="mt-12 opacity-50 font-mono tracking-widest text-sm uppercase">
                            {intent}
                         </div>
                     )}
                </div>

                {/* VIEW: STATS */}
                <div className={`absolute inset-0 p-8 md:p-16 transition-all duration-500 ${activeView === 'stats' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                     <div className="w-full h-full max-w-6xl mx-auto flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                                <BarChart2 className="w-8 h-8 text-purple-400" />
                             </div>
                             <div>
                                 <h2 className="text-3xl font-bold tracking-tight">Focus Analytics</h2>
                                 <p className="text-white/40 text-sm">Track your productivity journey</p>
                             </div>
                        </div>
                        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                             <Stats />
                        </div>
                     </div>
                </div>

                 {/* VIEW: TASKS */}
                 <div className={`absolute inset-0 p-8 md:p-16 transition-all duration-500 ${activeView === 'tasks' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                     <div className="w-full h-full max-w-4xl mx-auto flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                                <CheckSquare className="w-8 h-8 text-yellow-400" />
                             </div>
                             <div>
                                 <h2 className="text-3xl font-bold tracking-tight">Task Master</h2>
                                 <p className="text-white/40 text-sm">Organize and conquer your goals</p>
                             </div>
                        </div>
                        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
                             <TaskList />
                        </div>
                     </div>
                </div>

                {/* VIEW: CUSTOM */}
                <div className={`absolute inset-0 p-8 md:p-16 transition-all duration-500 ${activeView === 'custom' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                     <div className="w-full h-full max-w-2xl mx-auto flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                <Sliders className="w-8 h-8 text-blue-400" />
                             </div>
                             <div>
                                 <h2 className="text-3xl font-bold tracking-tight">Studio</h2>
                                 <p className="text-white/40 text-sm">Customize your focus environment</p>
                             </div>
                        </div>
                        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
                             <Custom 
                                intent={intent} 
                                setIntent={updateIntent}
                                currentTheme={themeId}
                                setThemeId={setThemeId}
                             />
                        </div>
                     </div>
                </div>

            </div>

             {/* Bottom Navigation Dock - Hidden in Immersive Mode */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${immersiveMode ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                    
                    <button 
                        onClick={() => setActiveView('timer')}
                        className={`p-4 rounded-full transition-all duration-300 flex items-center gap-3 ${activeView === 'timer' ? 'bg-white text-black px-6' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        {activeView === 'timer' && <span className="text-xs font-bold tracking-widest">PRODOMO</span>}
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-2"></div>

                    <button 
                        onClick={() => setActiveView('stats')}
                        className={`relative group p-4 rounded-full transition-all duration-300 ${activeView === 'stats' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                    >
                        <BarChart2 className="w-5 h-5" />
                         {activeView === 'stats' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>}
                         <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Stats</span>
                    </button>

                    <button 
                        onClick={() => setActiveView('tasks')}
                        className={`relative group p-4 rounded-full transition-all duration-300 ${activeView === 'tasks' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                    >
                        <CheckSquare className="w-5 h-5" />
                         {activeView === 'tasks' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>}
                         <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Tasks</span>
                    </button>

                    <button 
                        onClick={() => setActiveView('custom')}
                        className={`relative group p-4 rounded-full transition-all duration-300 ${activeView === 'custom' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                    >
                        <Sliders className="w-5 h-5" />
                         {activeView === 'custom' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>}
                         <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Studio</span>
                    </button>
                    
                </div>
            </div>

            {/* Clock Overlay (Bottom Right) - Standard Mode */}
            {!immersiveMode && (
                 <div className="absolute bottom-8 right-8 text-right opacity-30 pointer-events-none hidden md:block">
                     <div className="text-3xl font-bold">{format(time, 'HH:mm')}</div>
                     <div className="text-xs tracking-widest uppercase">{format(time, 'EEE, dd MMM', { locale: vi })}</div>
                 </div>
            )}
        </div>
    );
};

