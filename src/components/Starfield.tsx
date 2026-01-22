import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  driftDuration: number;
}

const Starfield = () => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      driftDuration: Math.random() * 30 + 20,
    }));
  }, []);

  const floatingStars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 20 + 15,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-space-gradient" />
      
      {/* Animated nebula glow effects */}
      <div 
        className="absolute top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-[150px] animate-float-slow"
        style={{ background: 'radial-gradient(circle, hsl(var(--nebula-purple) / 0.08) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full blur-[120px] animate-drift"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--stellar-cyan) / 0.06) 0%, transparent 70%)',
          animationDelay: '-5s'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-[100px] animate-float"
        style={{ background: 'radial-gradient(circle, hsl(var(--stellar-cyan) / 0.03) 0%, transparent 70%)' }}
      />
      
      {/* Background stars with drift animation */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-space-star will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite, drift ${star.driftDuration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Larger floating accent stars */}
      {floatingStars.map((star) => (
        <div
          key={`float-${star.id}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, hsl(var(--stellar-cyan)) 0%, hsl(var(--stellar-cyan) / 0.3) 50%, transparent 100%)`,
            boxShadow: `0 0 ${star.size * 3}px ${star.size}px hsl(var(--stellar-cyan) / 0.3)`,
            animation: `float-slow ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Brighter accent stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`accent-${i}`}
          className="absolute rounded-full bg-space-stellar will-change-transform"
          style={{
            left: `${8 + i * 8}%`,
            top: `${10 + (i % 4) * 22}%`,
            width: "3px",
            height: "3px",
            boxShadow: "0 0 8px 3px hsl(var(--stellar-cyan) / 0.5)",
            animation: `twinkle ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite, drift ${25 + i * 2}s ease-in-out ${i}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
