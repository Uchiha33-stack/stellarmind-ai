import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStartCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

const QuickStartCard = ({ title, description, icon: Icon, onClick }: QuickStartCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 p-5 rounded-xl",
        "bg-card/50 backdrop-blur-sm border border-border",
        "hover:border-space-stellar/50 hover:bg-card/70",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_0_30px_hsl(var(--stellar-cyan)/0.15)]",
        "text-left w-full"
      )}
    >
      {/* Icon container */}
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg",
        "bg-space-stellar/10 text-space-stellar",
        "group-hover:bg-space-stellar/20 group-hover:scale-110",
        "transition-all duration-300"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      
      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-display text-sm font-medium text-foreground group-hover:text-space-stellar transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-space-stellar/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
};

export default QuickStartCard;
