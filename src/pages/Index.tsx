import { useState, useRef, useEffect } from "react";
import { Orbit, Atom, Telescope, RotateCcw } from "lucide-react";
import Starfield from "@/components/Starfield";
import QuickStartCard from "@/components/QuickStartCard";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SimplifyToggle from "@/components/SimplifyToggle";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const quickStartTopics = [
  {
    title: "Black Holes",
    description: "Explore the mysteries of cosmic voids where gravity reigns supreme",
    icon: Orbit,
    prompt: "What is a black hole and how does it form?",
  },
  {
    title: "Dark Matter",
    description: "Uncover the invisible substance shaping the universe",
    icon: Atom,
    prompt: "What is dark matter and how do we know it exists?",
  },
  {
    title: "General Relativity",
    description: "Understand Einstein's revolutionary theory of gravity",
    icon: Telescope,
    prompt: "Can you explain Einstein's theory of general relativity?",
  },
];

const Index = () => {
  const [simplified, setSimplified] = useState(false);
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  const handleSend = (content: string) => {
    sendMessage(content, simplified);
  };

  const handleQuickStart = (prompt: string) => {
    sendMessage(prompt, simplified);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Starfield background */}
      <Starfield />
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-space-stellar/20 flex items-center justify-center border border-space-stellar/30 animate-pulse-glow">
              <Orbit className="w-6 h-6 text-space-stellar" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-glow">
              StellarMind AI
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Your intelligent companion for exploring the cosmos. Ask anything about space, physics, and the universe.
          </p>
        </header>

        {/* Toggle and controls row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <SimplifyToggle enabled={simplified} onToggle={setSimplified} />
          
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!hasMessages ? (
            /* Quick start cards */
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="font-display text-lg font-medium text-center mb-6 text-muted-foreground">
                Start Exploring
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickStartTopics.map((topic) => (
                  <QuickStartCard
                    key={topic.title}
                    title={topic.title}
                    description={topic.description}
                    icon={topic.icon}
                    onClick={() => handleQuickStart(topic.prompt)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className={cn(
              "flex-1 overflow-y-auto mb-4 px-2",
              "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            )}>
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    isTyping={
                      isLoading && 
                      index === messages.length - 1 && 
                      message.role === "assistant"
                    }
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input */}
          <div className="mt-auto">
            <ChatInput onSend={handleSend} disabled={isLoading} />
            
            {/* Mode indicator */}
            <p className="text-center text-xs text-muted-foreground mt-3">
              {simplified ? (
                <span className="text-space-stellar">✨ Simplified mode active — responses will be easy to understand</span>
              ) : (
                <span>Scientific mode — detailed, technical responses</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
