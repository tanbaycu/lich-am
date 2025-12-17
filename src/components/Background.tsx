import FaultyTerminal from './FaultyTerminal';

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-black select-none pointer-events-none">
      <FaultyTerminal 
        tint="#00ffcc" // Cyber Cyan Tint
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        glitchAmount={1.1} // Subtle Glitch
        scanlineIntensity={0.2} 
        timeScale={0.2} // Slow matrix feel
        mouseStrength={0.4}
        brightness={0.8}
        flickerAmount={0.3}
      />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
};
