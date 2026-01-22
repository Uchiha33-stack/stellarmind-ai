import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      "relative flex items-end gap-3 p-4",
      "bg-card/50 backdrop-blur-sm rounded-2xl",
      "border border-border",
      "focus-within:border-space-stellar/50 focus-within:shadow-[0_0_20px_hsl(var(--stellar-cyan)/0.1)]",
      "transition-all duration-300"
    )}>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about the cosmos..."
        disabled={disabled}
        className={cn(
          "flex-1 min-h-[48px] max-h-[200px] resize-none",
          "bg-transparent border-none text-foreground placeholder:text-muted-foreground",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "text-sm leading-relaxed"
        )}
        rows={1}
      />
      
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        size="icon"
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl",
          "bg-space-stellar hover:bg-space-glow text-primary-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200",
          "hover:shadow-[0_0_20px_hsl(var(--stellar-cyan)/0.4)]"
        )}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
