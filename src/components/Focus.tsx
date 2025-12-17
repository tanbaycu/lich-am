import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';

export const Focus = () => {
  const [focus, setFocus] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const storedFocus = localStorage.getItem('dailyFocus');
    const storedDate = localStorage.getItem('focusDate');
    const today = new Date().toDateString();

    if (storedFocus && storedDate === today) {
      setFocus(storedFocus);
      setIsSet(true);
    } else {
        localStorage.removeItem('dailyFocus');
        localStorage.removeItem('focusDate');
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const today = new Date().toDateString();
      localStorage.setItem('dailyFocus', inputValue);
      localStorage.setItem('focusDate', today);
      setFocus(inputValue);
      setIsSet(true);
    }
  };

  const clearFocus = () => {
      setIsSet(false);
      setFocus('');
      localStorage.removeItem('dailyFocus');
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6 z-20 w-full max-w-md mx-auto transition-all duration-500">
      {!isSet ? (
        <div className="group relative w-full">
            <h3 className="text-center font-mono text-white/70 text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                What is your main focus for today?
            </h3>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="[Enter your goal]"
                className="w-full bg-transparent border-b-2 border-white/20 text-center text-xl md:text-2xl font-mono text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors py-2"
            />
        </div>
      ) : (
        <div className="flex items-center gap-3 animate-fade-in group cursor-pointer" onClick={clearFocus} title="Click to clear">
             <Target className="w-5 h-5 text-green-400 animate-pulse" />
             <span className="text-xl md:text-2xl font-mono text-white font-bold text-glow tracking-wide border-b border-transparent group-hover:border-white/50 transition-all">
                {focus}
             </span>
        </div>
      )}
    </div>
  );
};
