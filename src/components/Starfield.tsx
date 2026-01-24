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
    return Array.from({ length: 250 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.8 + 0.4,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      driftDuration: Math.random() * 40 + 25,
    }));
  }, []);

  const floatingStars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 25 + 18,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Brighter deep space gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, hsl(235 45% 8%) 0%, hsl(250 40% 12%) 30%, hsl(220 50% 10%) 70%, hsl(240 35% 8%) 100%)'
        }}
      />
      
      {/* Bright central glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[200px] animate-float"
        style={{ background: 'radial-gradient(circle, hsl(var(--stellar-cyan) / 0.12) 0%, transparent 50%)' }}
      />
      
      {/* Brighter animated nebula glow effects */}
      <div 
        className="absolute top-0 -left-1/4 w-full h-3/4 rounded-full blur-[180px] animate-float-slow"
        style={{ background: 'radial-gradient(circle, hsl(var(--nebula-purple) / 0.18) 0%, transparent 60%)' }}
      />
      <div 
        className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 rounded-full blur-[150px] animate-drift"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--stellar-cyan) / 0.15) 0%, transparent 60%)',
          animationDelay: '-5s'
        }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-1/2 h-1/2 rounded-full blur-[120px] animate-float"
        style={{ 
          background: 'radial-gradient(circle, hsl(280 70% 60% / 0.1) 0%, transparent 70%)',
          animationDelay: '-3s'
        }}
      />
      
      {/* Background stars with drift animation - brighter */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            background: `radial-gradient(circle, hsl(0 0% 100%) 0%, hsl(0 0% 90%) 100%)`,
            boxShadow: `0 0 ${star.size * 2}px ${star.size * 0.5}px hsl(0 0% 100% / 0.4)`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite, drift ${star.driftDuration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Larger floating accent stars with glow */}
      {floatingStars.map((star) => (
        <div
          key={`float-${star.id}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, hsl(var(--stellar-cyan)) 0%, hsl(var(--stellar-cyan) / 0.5) 50%, transparent 100%)`,
            boxShadow: `0 0 ${star.size * 4}px ${star.size * 1.5}px hsl(var(--stellar-cyan) / 0.5)`,
            animation: `float-slow ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Super bright accent stars */}
      {[...Array(18)].map((_, i) => (
        <div
          key={`accent-${i}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${5 + i * 5.5}%`,
            top: `${8 + (i % 5) * 20}%`,
            width: "4px",
            height: "4px",
            background: i % 3 === 0 ? 'hsl(var(--stellar-cyan))' : i % 3 === 1 ? 'hsl(var(--nebula-purple))' : 'hsl(0 0% 100%)',
            boxShadow: i % 3 === 0 
              ? "0 0 12px 5px hsl(var(--stellar-cyan) / 0.6)" 
              : i % 3 === 1 
              ? "0 0 12px 5px hsl(var(--nebula-purple) / 0.5)"
              : "0 0 10px 4px hsl(0 0% 100% / 0.5)",
            animation: `twinkle ${1.5 + i * 0.2}s ease-in-out ${i * 0.15}s infinite, drift ${20 + i * 1.5}s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}
      
      {/* Shooting star effect - subtle horizontal streaks */}
      <div 
        className="absolute top-1/4 left-0 w-48 h-[1px] opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--stellar-cyan)) 50%, transparent 100%)',
          animation: 'drift 30s ease-in-out infinite',
        }}
      />
    </div>
  );
};

export default Starfield;
