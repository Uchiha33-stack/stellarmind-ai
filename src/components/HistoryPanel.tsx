import { History, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (query: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryPanel = ({ history, onSelect, onDelete, onClear }: HistoryPanelProps) => {
  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-space-stellar" />
          <h2 className="font-display text-lg font-semibold">Search History</h2>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 pr-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No search history yet</p>
            <p className="text-xs mt-1">Your questions will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "group p-3 rounded-xl bg-card/50 border border-border/50 cursor-pointer",
                  "hover:bg-space-stellar/10 hover:border-space-stellar/30 transition-all duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onSelect(item.query)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground line-clamp-2 flex-1">
                    {item.query}
                  </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(item.timestamp).toLocaleDateString()} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;
