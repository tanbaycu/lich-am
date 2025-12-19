import { useState, useEffect, useRef } from 'react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES = {
    focus: { label: 'Focus', minutes: 25, color: 'text-white', stroke: '#fb7185' },
    shortBreak: { label: 'Short Break', minutes: 5, color: 'text-teal-200', stroke: '#2dd4bf' },
    longBreak: { label: 'Long Break', minutes: 15, color: 'text-blue-200', stroke: '#60a5fa' },
};

const SOUNDS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Mechanical Click
    alarm: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Bell
};

export const Timer = () => {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    
    // Audio Refs
    const clickSoundRef = useRef<HTMLAudioElement | null>(null);
    const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
    const autoSwitchRef = useRef(false);

    // Initialize Audio
    useEffect(() => {
        clickSoundRef.current = new Audio(SOUNDS.click);
        alarmSoundRef.current = new Audio(SOUNDS.alarm);
        clickSoundRef.current.volume = 0.5;
        alarmSoundRef.current.volume = 0.7;
    }, []);

    const playSound = (type: 'click' | 'alarm') => {
        if (type === 'click' && clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(e => console.error("Audio error", e));
        } else if (type === 'alarm' && alarmSoundRef.current) {
            alarmSoundRef.current.play().catch(e => console.error("Audio error", e));
        }
    };

    // Reset timer when mode changes
    useEffect(() => {
        setTimeLeft(MODES[mode].minutes * 60);
        if (autoSwitchRef.current) {
            setIsActive(true);
            autoSwitchRef.current = false;
        } else {
            setIsActive(false);
        }
    }, [mode]);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        playSound('alarm');
        
        let nextMode: TimerMode = mode;
        
        if (mode === 'focus') {
            // Log Session
            saveSession(MODES.focus.minutes);
            
            // Determine logic: 4 Focus -> Long Break, else Short Break
            const newCycleCount = cycleCount + 1;
            setCycleCount(newCycleCount);
            
            if (newCycleCount % 4 === 0) {
                nextMode = 'longBreak';
            } else {
                nextMode = 'shortBreak';
            }
        } else {
            // Break is over -> Back to Focus
            nextMode = 'focus';
        }
        
        // Auto-switch mode and start
        autoSwitchRef.current = true;
        setMode(nextMode);
    };

    const saveSession = (duration: number) => {
        try {
            const sessions = JSON.parse(localStorage.getItem('prodomo-sessions') || '[]');
            sessions.push({
                date: Date.now(),
                duration: duration,
                mode: 'focus'
            });
            localStorage.setItem('prodomo-sessions', JSON.stringify(sessions));
        } catch (e) {
            console.error('Failed to save session', e);
        }
    };

    const toggleTimer = () => {
        playSound('click');
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        playSound('click');
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center animate-fade-in">
            {/* Mode Selectors */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-full mb-10 relative z-30 border border-white/5 backdrop-blur-md">
                {(Object.keys(MODES) as TimerMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => { 
                            playSound('click'); 
                            if (isActive) autoSwitchRef.current = true; // Maintain active state if already running
                            setMode(m); 
                        }}
                        className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                            mode === m 
                            ? 'bg-white text-black shadow-lg' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {MODES[m].label}
                    </button>
                ))}
            </div>

            {/* Massive Hero Timer */}
            <div className="relative leading-none select-none flex flex-col items-center justify-center z-20">
                 <h1 className="text-[25vw] md:text-[20rem] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl tracking-tighter transition-all duration-500">
                    {formatTime(timeLeft)}
                </h1>
                
                {/* Cycle Indicator */}
                <div className="absolute -bottom-6 flex gap-2 opacity-30">
                     {[...Array(4)].map((_, i) => (
                         <div key={i} className={`w-2 h-2 rounded-full ${i < cycleCount % 4 ? 'bg-white' : 'bg-white/20'}`}></div>
                     ))}
                </div>
            </div>

            {/* Minimalist Controls - No Slide Effect */}
            <div className="flex gap-6 mt-16 items-center z-30">
                <button
                    onClick={toggleTimer}
                    className={`group h-16 px-10 rounded-full flex items-center justify-center gap-3 transition-all duration-200 border ${
                        isActive 
                        ? 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40' 
                        : 'bg-white text-black border-white hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                    }`}
                >
                    {isActive ? (
                        <>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-5 bg-current rounded-full"></span>
                                <span className="w-1.5 h-5 bg-current rounded-full"></span>
                            </div>
                            <span className="font-bold tracking-widest text-xs">PAUSE</span>
                        </>
                    ) : (
                        <>
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold tracking-widest text-xs">START FOCUS</span>
                        </>
                    )}
                </button>
                
                <button
                    onClick={resetTimer}
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                    title="Reset Timer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
