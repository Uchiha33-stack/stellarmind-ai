import { Star, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface FavoriteItem {
  id: string;
  query: string;
  response: string;
  timestamp: number;
}

interface FavoritesPanelProps {
  favorites: FavoriteItem[];
  onSelect: (query: string) => void;
  onDelete: (id: string) => void;
}

const FavoritesPanel = ({ favorites, onSelect, onDelete }: FavoritesPanelProps) => {
  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-accent" />
        <h2 className="font-display text-lg font-semibold">Favorites</h2>
      </div>

      <ScrollArea className="flex-1 pr-2">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Sparkles className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No favorites yet</p>
            <p className="text-xs mt-1 text-center px-4">Star your favorite responses to save them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "group p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 cursor-pointer",
                  "hover:from-accent/20 hover:to-accent/10 hover:border-accent/50 transition-all duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onSelect(item.query)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-2">
                      {item.query}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {item.response}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-accent" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default FavoritesPanel;
