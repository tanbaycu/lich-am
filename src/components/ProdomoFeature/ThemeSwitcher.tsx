export const THEMES = [
    { id: 'aurora', name: 'Aurora', color: 'bg-gradient-to-br from-cyan-500 to-blue-500', bgClass: 'bg-black' },
    { id: 'grid-motion', name: 'Grid Motion', color: 'bg-gradient-to-br from-purple-500 to-pink-500', bgClass: 'bg-black' },
    { id: 'beams', name: 'Beams', color: 'bg-white', bgClass: 'bg-black' },
    { id: 'lightning', name: 'Lightning', color: 'bg-blue-600', bgClass: 'bg-black' },
    { id: 'prismatic', name: 'Prismatic', color: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500', bgClass: 'bg-black' },
];

interface ThemeSwitcherProps {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

export const ThemeSwitcher = ({ currentTheme, onThemeChange }: ThemeSwitcherProps) => {
    return (
        <div className="flex gap-2">
            {THEMES.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        currentTheme === theme.id 
                            ? 'border-white scale-110 shadow-[0_0_10px_white]' 
                            : 'border-white/20 opacity-50 hover:opacity-100'
                    } overflow-hidden`}
                    title={theme.name}
                >
                    <div className={`w-full h-full ${theme.color}`}></div>
                </button>
            ))}
        </div>
    );
};
