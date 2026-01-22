import { useState, useRef, useEffect } from "react";
import { Orbit, Atom, Telescope, RotateCcw, Loader2 } from "lucide-react";
import Starfield from "@/components/Starfield";
import Sidebar from "@/components/Sidebar";
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
  const [activeTab, setActiveTab] = useState("chat");
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
    <div className="relative min-h-screen flex">
      {/* Starfield background */}
      <Starfield />
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col ml-16 transition-all duration-500">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col min-h-screen">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-space-stellar/20 flex items-center justify-center border border-space-stellar/30 animate-pulse-glow">
                <Orbit className="w-6 h-6 text-space-stellar" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-glow">
                StellarMind AI
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Your intelligent companion for exploring the cosmos. Ask anything about space, physics, and the universe.
            </p>
          </header>

          {/* Toggle and controls row */}
          <div 
            className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <SimplifyToggle enabled={simplified} onToggle={setSimplified} />
            
            {hasMessages && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
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
                <h2 
                  className="font-display text-lg font-medium text-center mb-6 text-muted-foreground animate-fade-in-up"
                  style={{ animationDelay: '150ms' }}
                >
                  Start Exploring
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickStartTopics.map((topic, index) => (
                    <QuickStartCard
                      key={topic.title}
                      title={topic.title}
                      description={topic.description}
                      icon={topic.icon}
                      onClick={() => handleQuickStart(topic.prompt)}
                      index={index}
                    />
                  ))}
                </div>
                
                {/* Example prompts */}
                <div 
                  className="mt-8 text-center animate-fade-in-up"
                  style={{ animationDelay: '400ms' }}
                >
                  <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["What is 256 * 48?", "Speed of light?", "Explain supernovas"].map((q, i) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted/30 text-muted-foreground hover:text-space-stellar hover:bg-space-stellar/10 transition-all duration-300 border border-transparent hover:border-space-stellar/30"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="flex-1 overflow-y-auto mb-4 px-1 custom-scrollbar smooth-scroll">
                <div className="space-y-1">
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
                      index={index}
                    />
                  ))}
                  
                  {/* Loading indicator when waiting for response */}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-4 py-5 animate-fade-in-up">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-space-stellar/20 flex items-center justify-center border border-space-stellar/30">
                        <Loader2 className="w-4 h-4 text-space-stellar animate-spin" />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/50">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-space-stellar/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-space-stellar/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-space-stellar/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {/* Input */}
            <div className="mt-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <ChatInput onSend={handleSend} disabled={isLoading} />
              
              {/* Mode indicator */}
              <p className="text-center text-xs text-muted-foreground mt-3 transition-all duration-300">
                {simplified ? (
                  <span className="text-space-stellar inline-flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-space-stellar animate-pulse" />
                    Simplified mode — easy to understand answers
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    Scientific mode — detailed, technical responses
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
