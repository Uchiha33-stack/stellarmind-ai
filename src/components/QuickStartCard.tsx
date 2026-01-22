import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStartCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  index?: number;
}

const QuickStartCard = ({ title, description, icon: Icon, onClick, index = 0 }: QuickStartCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 p-5 rounded-xl",
        "bg-card/40 backdrop-blur-sm border border-border/50",
        "hover:border-space-stellar/40 hover:bg-card/60",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_0_40px_hsl(var(--stellar-cyan)/0.12)]",
        "hover:-translate-y-1",
        "text-left w-full animate-fade-in-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon container */}
      <div className={cn(
        "flex items-center justify-center w-11 h-11 rounded-xl",
        "bg-space-stellar/10 text-space-stellar border border-space-stellar/20",
        "group-hover:bg-space-stellar/20 group-hover:scale-110 group-hover:border-space-stellar/40",
        "transition-all duration-500 ease-out",
        "group-hover:shadow-[0_0_20px_hsl(var(--stellar-cyan)/0.3)]"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      
      {/* Content */}
      <div className="space-y-1.5">
        <h3 className="font-display text-sm font-medium text-foreground group-hover:text-space-stellar transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-space-stellar/5 via-transparent to-space-nebula/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </button>
  );
};

export default QuickStartCard;
