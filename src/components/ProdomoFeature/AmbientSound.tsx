import { useState, useRef, useEffect } from 'react';
import { CloudRain, Trees, Coffee, Keyboard } from 'lucide-react';

const SOUNDS = [
    { id: 'rain', label: 'Rain', icon: <CloudRain className="w-5 h-5" />, url: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3' }, // Heavy Rain
    { id: 'forest', label: 'Forest', icon: <Trees className="w-5 h-5" />, url: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3' }, // Forest Birds
    { id: 'cafe', label: 'Cafe', icon: <Coffee className="w-5 h-5" />, url: 'https://assets.mixkit.co/active_storage/sfx/2452/2452-preview.mp3' }, // Cafe Ambience
    { id: 'lofi', label: 'Typing', icon: <Keyboard className="w-5 h-5" />, url: 'https://assets.mixkit.co/active_storage/sfx/2382/2382-preview.mp3' }, // Keyboard Typing
];

export const AmbientSound = () => {
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }

        if (activeSound) {
            const sound = SOUNDS.find(s => s.id === activeSound);
            if (sound && audioRef.current.src !== sound.url) {
                audioRef.current.src = sound.url;
                audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
            } else if (sound && audioRef.current.paused) {
                 audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
            }
        } else {
            audioRef.current.pause();
        }
    }, [activeSound]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Soundscapes</h3>
                {activeSound && (
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] text-white/30">VOL</span>
                         <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={volume} 
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                         />
                    </div>
                )}
             </div>

             <div className="grid grid-cols-4 gap-2">
                 {SOUNDS.map((s) => (
                     <button
                        key={s.id}
                        onClick={() => setActiveSound(activeSound === s.id ? null : s.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                            activeSound === s.id 
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white hover:border-white/20'
                        }`}
                     >
                         <div className="">{s.icon}</div>
                         <span className="text-[10px] font-bold uppercase tracking-wide">{s.label}</span>
                     </button>
                 ))}
             </div>
        </div>
    );
};
