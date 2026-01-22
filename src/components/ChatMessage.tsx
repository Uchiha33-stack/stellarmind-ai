import { cn } from "@/lib/utils";
import { Orbit, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

const ChatMessage = ({ role, content, isTyping }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn(
      "flex gap-4 py-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-space-stellar/20 flex items-center justify-center border border-space-stellar/30">
          <Orbit className="w-4 h-4 text-space-stellar" />
        </div>
      )}
      
      {/* Message content */}
      <div className={cn(
        "max-w-[75%] rounded-2xl px-5 py-3",
        isUser
          ? "bg-space-stellar/20 border border-space-stellar/30 text-foreground"
          : "bg-card/60 border border-border text-foreground"
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
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
