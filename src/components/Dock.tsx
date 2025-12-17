import { useRef } from 'react';

// Using consistent simple-icons CDN or similar
const DOCK_APPS = [
    { name: "Facebook", url: "https://facebook.com", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
    { name: "Messenger", url: "https://messenger.com", icon: "https://cdn.simpleicons.org/messenger/006AFF" },
    { name: "YouTube", url: "https://youtube.com", icon: "https://cdn.simpleicons.org/youtube/FF0000" },
    { name: "TikTok", url: "https://tiktok.com", icon: "https://cdn.simpleicons.org/tiktok/000000/white" }, // White for dark mode
    { name: "Gmail", url: "https://mail.google.com", icon: "https://cdn.simpleicons.org/gmail/EA4335" },
    { name: "Google", url: "https://google.com", icon: "https://cdn.simpleicons.org/google/4285F4" },
    { name: "ChatGPT", url: "https://chat.openai.com", icon: "https://cdn.simpleicons.org/openai/white" },
    { name: "GitHub", url: "https://github.com", icon: "https://cdn.simpleicons.org/github/white" },
    { name: "Spotify", url: "https://open.spotify.com", icon: "https://cdn.simpleicons.org/spotify/1DB954" },
    { name: "Netflix", url: "https://netflix.com", icon: "https://cdn.simpleicons.org/netflix/E50914" },
    { name: "Notion", url: "https://notion.so", icon: "https://cdn.simpleicons.org/notion/white" },
    { name: "Figma", url: "https://figma.com", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
];

export const Dock = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90vw] md:max-w-2xl">
        <div 
            ref={scrollRef}
            onWheel={handleWheel}
            className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-4 overflow-x-auto hide-scrollbar scroll-smooth mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {DOCK_APPS.map((app, idx) => (
                <a 
                    key={idx}
                    href={app.url}
                    className="flex-shrink-0 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-125 hover:-translate-y-2 group relative"
                >
                    <img src={app.icon} alt={app.name} className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-lg" />
                    
                    {/* Tooltip */}
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-mono tracking-wider border border-white/10 z-50">
                        {app.name}
                    </span>
                    
                    {/* Reflection dot */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"></div>
                </a>
            ))}
        </div>
    </div>
  );
};
