import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

const Starfield = () => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-space-gradient" />
      
      {/* Nebula glow effects */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-space-nebula/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-space-stellar/5 rounded-full blur-[120px]" />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-space-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Larger accent stars */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`accent-${i}`}
          className="absolute rounded-full bg-space-stellar"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 30}%`,
            width: "3px",
            height: "3px",
            boxShadow: "0 0 6px 2px hsl(var(--stellar-cyan) / 0.5)",
            animation: `twinkle ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
