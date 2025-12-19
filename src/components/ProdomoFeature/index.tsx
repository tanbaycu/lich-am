import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Timer } from './Timer';
import { TaskList } from './TaskList';
import { Stats } from './Stats';
import { ThemeSwitcher, THEMES } from './ThemeSwitcher';
import { AmbientSound } from './AmbientSound';
import Aurora from '../Aurora';
import { Eye, EyeOff } from 'lucide-react';

interface ProdomoProps {
    onExit: () => void;
}

const QUOTES = [
    "The way to get started is to quit talking and begin doing.",
    "Focus allows you to see clearly.",
    "A cluttered mind is a restless mind.",
    "Productivity is being able to do things that you were never able to do before.",
    "Simplicity is the ultimate sophistication.",
    "It always seems impossible until it's done.",
    "Act as if what you do makes a difference. It does."
];

export const Prodomo = ({ onExit }: ProdomoProps) => {
    const [themeId, setThemeId] = useState('aurora');
    const [time, setTime] = useState(new Date());
    const [showSidebar, setShowSidebar] = useState(false);
    const [intent, setIntent] = useState('');
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const [immersiveMode, setImmersiveMode] = useState(false);

    useEffect(() => {
        setIntent(localStorage.getItem('prodomo-intent') || '');
    }, []);

    const handleIntentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
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
            </div>
            
            {/* Overlay Pattern */}
            <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            {/* Header Controls - Hidden in Immersive Mode */}
            <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-40 pointer-events-none transition-all duration-500 ${immersiveMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                {/* Left: Toggles - Pointer Events Enabled */}
                <div className="flex items-center gap-4 pointer-events-auto">
                     <button 
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`group p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${showSidebar ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/50 hover:text-white'}`}
                        title="Toggle Dashboard"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:rotate-180">
                            {showSidebar ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                            )}
                        </svg>
                     </button>
                     <span className={`text-xs font-mono font-bold tracking-widest transition-opacity duration-300 ${showSidebar ? 'opacity-0' : 'opacity-40'}`}>DASHBOARD</span>
                </div>

                {/* Right: Controls - Pointer Events Enabled */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    {THEMES.length > 1 && <ThemeSwitcher currentTheme={themeId} onThemeChange={setThemeId} />}
                    <button 
                        onClick={() => setImmersiveMode(true)}
                        className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                        title="Immersive Mode"
                    >
                        <EyeOff className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={onExit} 
                        className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300 group"
                        title="Exit Prodomo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Immersive Exit Button - Floating Bottom Center */}
            {immersiveMode && (
                <button 
                    onClick={() => setImmersiveMode(false)}
                    className="absolute bottom-8 z-50 p-4 rounded-full bg-white/5 border border-white/10 text-white/30 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-500 animate-in fade-in zoom-in"
                >
                    <Eye className="w-6 h-6" />
                </button>
            )}

            {/* Main Content Area */}
            <div className="flex-1 w-full h-full flex relative overflow-hidden">
                
                {/* Hero Center - Timer */}
                <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${showSidebar ? 'translate-x-[-15%] md:translate-x-[-10%] scale-90 opacity-80' : 'scale-100'}`}>
                     <div className="animate-[float_8s_ease-in-out_infinite]">
                         <Timer />
                     </div>
                     
                     {/* Intent Display (Main View) - Hidden in Immersive */}
                     {intent && !showSidebar && !immersiveMode && (
                        <div className="absolute top-32 animate-fade-in opacity-50 tracking-widest text-sm uppercase">
                            GOAL: {intent}
                        </div>
                     )}

                     {/* Subtle Real Time Display - Hidden in Immersive */}
                     <div className={`absolute bottom-12 flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-All duration-500 ${immersiveMode ? 'translate-y-20 opacity-0' : 'translate-y-0'}`}>
                        <div className="text-sm font-mono tracking-[0.5em] uppercase">Current Time</div>
                        <div className="text-2xl font-bold font-mono">
                            {format(time, 'HH:mm')} • {format(time, 'EEE, dd MMM', { locale: vi })}
                        </div>
                     </div>
                </div>

                {/* Sidebar Overlay - Stats & Tasks */}
                <div className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-black/40 backdrop-blur-2xl border-l border-white/10 transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] z-40 flex flex-col ${showSidebar && !immersiveMode ? 'translate-x-0' : 'translate-x-full'}`}>
                    
                    {/* Sidebar Header */}
                    <div className="p-8 pb-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                        <button onClick={() => setShowSidebar(false)} className="md:hidden p-2 opacity-50 hover:opacity-100">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                             </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        
                        {/* Quote Widget */}
                         <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-16 h-16">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                </svg>
                            </div>
                            <p className="text-white/80 font-medium italic relative z-10">"{quote}"</p>
                        </div>
                        
                        {/* Ambient Sound Mixer */}
                        <AmbientSound />

                        {/* Intent Input */}
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Session Goal</label>
                             <input 
                                type="text" 
                                value={intent}
                                onChange={handleIntentChange}
                                placeholder="What are you focusing on?"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 focus:bg-black/40 outline-none transition-all placeholder:text-white/20"
                             />
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-4">
                            <Stats />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10 w-full"></div>

                        {/* Tasks Section */}
                        <div className="h-[400px] flex flex-col">
                             <TaskList />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote Footer - Only visible when sidebar is hidden and NOT Immersive */}
            <div className={`absolute bottom-6 text-center w-full pointer-events-none z-30 opacity-30 transition-opacity duration-500 ${showSidebar || immersiveMode ? 'opacity-0' : ''}`}>
                 <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/50">DESIGN YOUR TIME • MASTER YOUR MIND</p>
            </div>
        </div>
    );
};
