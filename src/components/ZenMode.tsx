import { useState, useRef } from 'react';
import { Headphones, Volume2 } from 'lucide-react';

export const ZenMode = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Using a Rain sound effect (Public Domain or direct link)
  const SOUND_URL = "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg"; 

  const toggleSound = () => {
    if (!audioRef.current) {
        audioRef.current = new Audio(SOUND_URL);
        audioRef.current.loop = true;
    }

    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="absolute top-8 left-8 z-50 animate-fade-in">
        <button 
            onClick={toggleSound}
            className={`glass-panel p-3 pr-4 rounded-full flex items-center gap-3 transition-all duration-500 group overflow-hidden ${isPlaying ? 'bg-white/10 border-green-400/30' : 'hover:bg-white/5'}`}
        >
            <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>
                {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Headphones className="w-4 h-4" />}
            </div>

            <div className="flex flex-col items-start min-w-[60px]">
                <span className="text-[10px] font-mono text-white/50 tracking-wider">ZEN MODE</span>
                <span className={`text-xs font-bold font-mono transition-colors ${isPlaying ? 'text-green-400' : 'text-white/80'}`}>
                    {isPlaying ? "ACTIVE" : "OFF"}
                </span>
            </div>
            
            {/* Equalizer Visualizer Simulation */}
            {isPlaying && (
                <div className="flex gap-[2px] h-4 items-end ml-2">
                    <div className="w-1 bg-green-400 animate-[bounce_1s_infinite] h-2"></div>
                    <div className="w-1 bg-green-400 animate-[bounce_1.2s_infinite] h-4"></div>
                    <div className="w-1 bg-green-400 animate-[bounce_0.8s_infinite] h-1"></div>
                </div>
            )}
        </button>
    </div>
  );
};
