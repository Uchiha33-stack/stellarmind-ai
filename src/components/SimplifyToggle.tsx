import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimplifyToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const SimplifyToggle = ({ enabled, onToggle }: SimplifyToggleProps) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl",
      "bg-card/50 backdrop-blur-sm border",
      enabled ? "border-space-stellar/50 bg-space-stellar/5" : "border-border",
      "transition-all duration-300"
    )}>
      <Sparkles className={cn(
        "w-4 h-4 transition-colors",
        enabled ? "text-space-stellar" : "text-muted-foreground"
      )} />
      
      <Label 
        htmlFor="simplify-toggle" 
        className={cn(
          "text-sm font-medium cursor-pointer transition-colors",
          enabled ? "text-space-stellar" : "text-muted-foreground"
        )}
      >
        Simplify for Humans
      </Label>
      
      <Switch
        id="simplify-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
        className={cn(
          "data-[state=checked]:bg-space-stellar",
          "ml-auto"
        )}
      />
    </div>
  );
};

export default SimplifyToggle;
