import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudLightning, Wind, MapPin, Droplets } from 'lucide-react';

const getWeatherStyle = (code: number) => {
    // Return gradient and aesthetic classes based on weather
    if (code === 0) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]";
    if (code >= 1 && code <= 3) return "from-gray-400/20 to-slate-500/20 border-white/20";
    if (code >= 51 && code <= 67) return "from-blue-500/20 to-indigo-500/20 border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]";
    if (code >= 95) return "from-purple-900/40 to-indigo-900/40 border-purple-500/40 shadow-[0_0_50px_rgba(147,51,234,0.3)] animate-pulse-slow";
    return "from-white/10 to-white/5 border-white/10";
};

const getWeatherIcon = (code: number) => {
    const props = "w-10 h-10 drop-shadow-lg filter";
    if (code === 0) return <Sun className={`${props} text-yellow-300`} />;
    if (code >= 1 && code <= 3) return <Cloud className={`${props} text-gray-300`} />;
    if (code >= 45 && code <= 48) return <CloudFog className={`${props} text-gray-400`} />;
    if (code >= 51 && code <= 67) return <CloudRain className={`${props} text-blue-300`} />;
    if (code >= 71 && code <= 77) return <CloudSnow className={`${props} text-white`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${props} text-indigo-300`} />; 
    if (code >= 95 && code <= 99) return <CloudLightning className={`${props} text-purple-300`} />;
    return <Sun className={`${props} text-white`} />;
};

export const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            setWeather(res.data.current_weather);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
  };

  const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (p) => fetchWeather(p.coords.latitude, p.coords.longitude),
            () => fetchWeather(21.0285, 105.8542)
        );
      } else {
           fetchWeather(21.0285, 105.8542);
      }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (loading) return null;

  return (
    <div className="animate-fade-in z-40">
        <div className={`glass-panel p-5 rounded-3xl backdrop-blur-2xl transition-all duration-1000 bg-gradient-to-br flex flex-col gap-3 min-w-[220px] relative overflow-hidden group hover:scale-105 ${weather ? getWeatherStyle(weather.weathercode) : ''}`}>
            
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {weather ? (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                             <div className="flex items-start">
                                <span className="text-5xl font-mono font-bold text-white tracking-tighter leading-none text-glow">
                                    {Math.round(weather.temperature)}°
                                </span>
                             </div>
                             <span className="text-[10px] font-mono text-white/60 tracking-[0.2em] mt-2 uppercase">
                                 HANOI {/* Dynamic location would be better but keeping simple for now */}
                             </span>
                        </div>
                        <div className="relative z-10 animate-float">
                            {getWeatherIcon(weather.weathercode)}
                            {/* Reflection/Glow under icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 blur-xl rounded-full -z-10"></div>
                        </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="flex items-center justify-between text-white/60 text-xs font-mono">
                         <div className="flex items-center gap-2">
                             <Wind className="w-3 h-3" />
                             <span>{weather.windspeed} km/h</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <Droplets className="w-3 h-3" />
                             <span>--%</span> {/* API doesn't give humidity in current_weather simple call, keeping layout ready */}
                         </div>
                    </div>
                </>
            ) : (
                <button onClick={requestLocation} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <MapPin className="w-4 h-4 animate-bounce" />
                    <span className="text-xs font-mono uppercase tracking-widest">Locate Signal</span>
                </button>
            )}
        </div>
    </div>
  );
};
