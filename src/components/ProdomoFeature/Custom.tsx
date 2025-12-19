import { AmbientSound } from './AmbientSound';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Image, Music, Target } from 'lucide-react';

interface CustomProps {
    intent: string;
    setIntent: (val: string) => void;
    currentTheme: string;
    setThemeId: (id: string) => void;
}

export const Custom = ({ intent, setIntent, currentTheme, setThemeId }: CustomProps) => {
    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
            
            {/* Section: Focus Intent */}
            <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-4 text-white/40">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Session Intent</span>
                </div>
                <div className="relative group">
                    <input 
                        type="text" 
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        placeholder="What are you working on?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20 text-lg font-medium"
                    />
                </div>
            </div>

            {/* Section: Soundscapes */}
            <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-6 text-white/40">
                    <Music className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Audio Environment</span>
                </div>
                <AmbientSound />
            </div>

            {/* Section: Visual Theme */}
            <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-6 text-white/40">
                    <Image className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Visual Ambience</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                     <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setThemeId} />
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-white/40 flex justify-between items-center">
                    <p>Backgrounds by <a href="https://reactbits.dev" target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors font-bold">ReactBits</a></p>
                </div>
            </div>

        </div>
    );
};
