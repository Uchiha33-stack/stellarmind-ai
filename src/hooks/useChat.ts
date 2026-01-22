import { useState, useCallback } from "react";

type Message = { role: "user" | "assistant"; content: string };

// Mock AI responses for immediate usability
const mockResponses: Record<string, { scientific: string; simplified: string }> = {
  "black hole": {
    scientific: "A black hole is a region of spacetime where gravity is so intense that nothing—not even light or other electromagnetic waves—can escape once past the event horizon. They form when massive stars (typically >20 solar masses) exhaust their nuclear fuel and undergo gravitational collapse. The core implodes past the Schwarzschild radius, creating a singularity of theoretically infinite density. Black holes are characterized by three properties: mass, charge, and angular momentum (the 'no-hair theorem'). Stellar black holes range from 5-100 solar masses, while supermassive black holes at galactic centers can exceed billions of solar masses.",
    simplified: "Imagine a cosmic vacuum cleaner so powerful that even light can't escape! 🌑 A black hole forms when a giant star runs out of fuel and collapses under its own weight, squishing into an incredibly tiny, super-dense point. It's like crushing the entire Earth into something the size of a marble—gravity becomes crazy strong!"
  },
  "dark matter": {
    scientific: "Dark matter is a hypothetical form of matter that doesn't emit, absorb, or reflect electromagnetic radiation, making it invisible to the entire electromagnetic spectrum. Its existence is inferred from gravitational effects on visible matter, gravitational lensing, and the cosmic microwave background. Evidence includes galaxy rotation curves (Vera Rubin's work), the Bullet Cluster observations, and large-scale structure formation models. Dark matter constitutes approximately 27% of the universe's mass-energy content. Leading candidates include WIMPs (Weakly Interacting Massive Particles), axions, and sterile neutrinos.",
    simplified: "Dark matter is like cosmic invisible glue! 🔮 We can't see it, touch it, or detect it directly—but we know it's there because galaxies spin way faster than they should. Without this mystery stuff holding things together, galaxies would fly apart like water off a spinning umbrella!"
  },
  "general relativity": {
    scientific: "General relativity, published by Einstein in 1915, describes gravity not as a force but as curvature of spacetime caused by mass and energy. The Einstein field equations (Gμν + Λgμν = 8πG/c⁴ Tμν) relate spacetime geometry to mass-energy distribution. Key predictions include gravitational time dilation, gravitational lensing, gravitational waves, and the precession of Mercury's perihelion. The theory has been confirmed through numerous experiments including the Pound-Rebka experiment, GPS satellite corrections, LIGO gravitational wave detections, and the Event Horizon Telescope's black hole images.",
    simplified: "Einstein figured out that gravity isn't a force pulling you down—it's actually space being curved! 🎳 Imagine a bowling ball on a trampoline creating a dip. Now roll a marble nearby, and it curves toward the bowling ball. That's exactly what planets do around the Sun—they're following the curves in space itself!"
  },
  "white hole": {
    scientific: "A white hole is a theoretical region of spacetime that cannot be entered from the outside, but from which matter and light may escape. It's essentially the time-reversal of a black hole, predicted by the mathematics of general relativity. The Schwarzschild metric allows for both black hole and white hole solutions. However, white holes are considered physically implausible because they violate the second law of thermodynamics and would be unstable. Some theories suggest the Big Bang itself could be interpreted as a white hole, or that black holes in our universe could be connected to white holes in other universes via wormholes.",
    simplified: "A white hole is like a black hole running backwards in time! ⚪ Instead of sucking everything in, it would spit everything out. It's a cool idea from Einstein's math, but scientists think they probably can't exist in real life—it would be like watching a broken egg un-break and jump back into your hand!"
  },
  default: {
    scientific: "That's a fascinating question about the cosmos! The universe contains countless mysteries, from the quantum foam at the smallest scales to the cosmic web at the largest. Current astrophysics research continues to push the boundaries of our understanding, with missions like the James Webb Space Telescope revealing unprecedented details about the early universe, exoplanets, and stellar evolution. Each discovery often raises more questions than it answers, which is the beautiful nature of scientific inquiry.",
    simplified: "Great question! The universe is full of amazing mysteries. Scientists are constantly discovering new things about space, from distant planets to ancient light from the beginning of time. Every answer we find leads to more questions—that's what makes exploring the cosmos so exciting! 🚀✨"
  }
};

const getMockResponse = (message: string, simplified: boolean): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const [key, responses] of Object.entries(mockResponses)) {
    if (key !== "default" && lowerMessage.includes(key)) {
      return simplified ? responses.simplified : responses.scientific;
    }
  }
  
  return simplified ? mockResponses.default.simplified : mockResponses.default.scientific;
};

// Simulate typewriter effect
const simulateTyping = async (
  text: string,
  onChunk: (chunk: string) => void,
  delayMs: number = 15
): Promise<void> => {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    onChunk(words[i] + (i < words.length - 1 ? " " : ""));
  }
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, simplified: boolean) => {
    const userMsg: Message = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    let assistantContent = "";
    
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    // If Supabase is not configured, use mock responses
    if (!supabaseUrl || !supabaseKey) {
      const mockResponse = getMockResponse(content, simplified);
      await simulateTyping(mockResponse, updateAssistant);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          simplified 
        }),
      });

      if (!resp.ok) {
        // Fallback to mock on API error
        const mockResponse = getMockResponse(content, simplified);
        await simulateTyping(mockResponse, updateAssistant);
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) updateAssistant(deltaContent);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      // Fallback to mock on any error
      console.warn("API unavailable, using mock response:", e);
      assistantContent = "";
      const mockResponse = getMockResponse(content, simplified);
      await simulateTyping(mockResponse, updateAssistant);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
};
