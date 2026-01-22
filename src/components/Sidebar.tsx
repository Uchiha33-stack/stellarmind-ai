import { useState } from "react";
import { History, Sparkles, BookOpen, Settings, ChevronLeft, ChevronRight, Orbit, Rocket, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "chat", icon: Orbit, label: "Chat" },
  { id: "explore", icon: Rocket, label: "Explore" },
  { id: "history", icon: History, label: "History" },
  { id: "learn", icon: BookOpen, label: "Learn" },
  { id: "favorites", icon: Star, label: "Favorites" },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-20",
        "bg-card/80 backdrop-blur-xl border-r border-border",
        "flex flex-col transition-all duration-500 ease-out",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-space-stellar/20 flex items-center justify-center border border-space-stellar/30 flex-shrink-0">
          <Sparkles className="w-4 h-4 text-space-stellar" />
        </div>
        <span
          className={cn(
            "font-display text-sm font-semibold text-glow whitespace-nowrap transition-all duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}
        >
          StellarMind
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-300 ease-out group",
              activeTab === tab.id
                ? "bg-space-stellar/20 text-space-stellar border border-space-stellar/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <tab.icon
              className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                activeTab === tab.id && "scale-110"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap transition-all duration-300",
                collapsed ? "opacity-0 w-0" : "opacity-100"
              )}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
