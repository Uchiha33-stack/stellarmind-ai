import { cn } from "@/lib/utils";
import { Orbit, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  index?: number;
}

const ChatMessage = ({ role, content, isTyping, index = 0 }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div 
      className={cn(
        "flex gap-4 py-5 animate-fade-in-up",
        isUser ? "justify-end" : "justify-start"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-space-stellar/20 flex items-center justify-center border border-space-stellar/30 shadow-[0_0_15px_hsl(var(--stellar-cyan)/0.2)] transition-all duration-300">
          <Orbit className="w-4 h-4 text-space-stellar" />
        </div>
      )}
      
      {/* Message content */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-5 py-3.5 transition-all duration-300",
        isUser
          ? "bg-space-stellar/15 border border-space-stellar/25 text-foreground shadow-[0_4px_20px_hsl(var(--stellar-cyan)/0.1)]"
          : "bg-card/70 border border-border/50 text-foreground backdrop-blur-sm shadow-[0_4px_20px_hsl(var(--space-black)/0.3)]"
      )}>
        <p className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          isTyping && "typewriter-cursor"
        )}>
          {content}
        </p>
      </div>
      
      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border transition-all duration-300">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
