import { useState, useCallback } from "react";

type Message = { role: "user" | "assistant"; content: string };

// Simple equation solver
const solveEquation = (input: string): string | null => {
  // Basic arithmetic
  const arithmeticMatch = input.match(/(?:what\s+is\s+|calculate\s+|solve\s+)?(\d+(?:\.\d+)?)\s*([\+\-\*\/\^])\s*(\d+(?:\.\d+)?)/i);
  if (arithmeticMatch) {
    const [, a, op, b] = arithmeticMatch;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    let result: number;
    switch (op) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '*': result = numA * numB; break;
      case '/': result = numB !== 0 ? numA / numB : NaN; break;
      case '^': result = Math.pow(numA, numB); break;
      default: return null;
    }
    return `${numA} ${op} ${numB} = ${result}`;
  }

  // Square root
  const sqrtMatch = input.match(/(?:square\s+root|sqrt)\s+(?:of\s+)?(\d+(?:\.\d+)?)/i);
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1]);
    return `√${num} = ${Math.sqrt(num).toFixed(4)}`;
  }

  // Percentage
  const percentMatch = input.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of\s+)?(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const [, percent, num] = percentMatch;
    const result = (parseFloat(percent) / 100) * parseFloat(num);
    return `${percent}% of ${num} = ${result}`;
  }

  // Speed of light calculations
  if (/speed\s+of\s+light/i.test(input)) {
    return "The speed of light (c) = 299,792,458 m/s ≈ 3 × 10⁸ m/s";
  }

  // Light year
  if (/light\s*year/i.test(input)) {
    return "1 light year = 9.461 × 10¹² km = 5.879 × 10¹² miles";
  }

  // Schwarzschild radius
  const schwarzschildMatch = input.match(/schwarzschild|event\s+horizon.*?(\d+(?:\.\d+)?)\s*(?:solar\s+masses?|M☉)/i);
  if (schwarzschildMatch) {
    const solarMasses = parseFloat(schwarzschildMatch[1]) || 1;
    const radius = 2.95 * solarMasses; // km
    return `Schwarzschild radius for ${solarMasses} M☉ = ${radius.toFixed(2)} km`;
  }

  // Escape velocity
  if (/escape\s+velocity/i.test(input)) {
    return "Escape velocity formula: v = √(2GM/r)\nEarth's escape velocity = 11.2 km/s";
  }

  return null;
};

// Mock AI responses
const mockResponses: Record<string, { scientific: string; simplified: string }> = {
  "black hole": {
    scientific: "A black hole is a region of spacetime where gravity is so intense that nothing—not even light—can escape once past the event horizon. They form when massive stars (>20 solar masses) exhaust nuclear fuel and undergo gravitational collapse. The core implodes past the Schwarzschild radius, creating a singularity of theoretically infinite density. Black holes are characterized by mass, charge, and angular momentum (no-hair theorem).",
    simplified: "A black hole is like a cosmic vacuum cleaner! 🌑 When a huge star dies, it squishes down so tight that its gravity becomes super strong—nothing can escape, not even light! That's why we call it 'black.'"
  },
  "dark matter": {
    scientific: "Dark matter is hypothetical matter that doesn't emit or interact with electromagnetic radiation. Evidence includes galaxy rotation curves, gravitational lensing, and cosmic microwave background observations. It constitutes ~27% of the universe's mass-energy. Leading candidates include WIMPs and axions.",
    simplified: "Dark matter is invisible cosmic glue! 🔮 We can't see it, but we know it's there because galaxies spin faster than they should. It's like knowing there's wind even though you can't see air!"
  },
  "general relativity": {
    scientific: "General relativity (Einstein, 1915) describes gravity as curvature of spacetime caused by mass-energy. The Einstein field equations Gμν = 8πG/c⁴ Tμν relate geometry to mass-energy distribution. Confirmed by gravitational lensing, time dilation, gravitational waves (LIGO), and black hole imaging.",
    simplified: "Einstein figured out that gravity isn't a force—it's curved space! 🎳 Put a bowling ball on a trampoline and it makes a dip. Planets roll around the Sun because space itself is curved!"
  },
  "white hole": {
    scientific: "A white hole is a theoretical spacetime region that cannot be entered but from which matter and light may escape—the time-reversal of a black hole. Mathematically predicted by general relativity but considered physically implausible due to thermodynamic violations.",
    simplified: "A white hole is a black hole playing backwards! ⚪ Instead of sucking things in, it would spit everything out. Scientists think they probably can't exist in real life though."
  },
  "neutron star": {
    scientific: "A neutron star is an ultra-dense stellar remnant formed from gravitational collapse of massive stars (8-20 M☉). Composed almost entirely of neutrons, with densities ~10¹⁷ kg/m³. Typical radius ~10 km, mass 1.4-2 M☉. Features include extreme magnetic fields (10⁸-10¹⁵ T) and rapid rotation.",
    simplified: "A neutron star is like a giant atomic nucleus in space! ⭐ It's a dead star so squished that a teaspoon of it would weigh as much as a mountain. They spin super fast—some spin hundreds of times per second!"
  },
  "big bang": {
    scientific: "The Big Bang theory describes the universe's expansion from an extremely hot, dense initial state ~13.8 billion years ago. Evidence includes cosmic microwave background radiation, abundance of light elements, and Hubble's law of cosmic expansion. Not an explosion 'in' space but an expansion of space itself.",
    simplified: "The Big Bang was the start of EVERYTHING! 💥 About 14 billion years ago, the entire universe was squished into a tiny dot, then it started expanding super fast. It's still expanding today!"
  },
  "gravitational wave": {
    scientific: "Gravitational waves are ripples in spacetime caused by accelerating masses, predicted by Einstein in 1916 and directly detected by LIGO in 2015. They travel at the speed of light and are generated by cataclysmic events like merging black holes or neutron stars.",
    simplified: "Gravitational waves are space ripples! 🌊 When huge things like black holes crash together, they make waves in space itself—like ripples when you throw a stone in a pond. We can detect them now!"
  },
  "supernova": {
    scientific: "A supernova is a stellar explosion occurring at the end of a star's life. Type II supernovae result from core collapse in massive stars (>8 M☉). Type Ia supernovae occur in binary systems when a white dwarf exceeds the Chandrasekhar limit. They can outshine entire galaxies and produce heavy elements.",
    simplified: "A supernova is a star's grand finale! 🎆 When a big star runs out of fuel, it explodes SO bright it can outshine a whole galaxy! It's like the biggest firework in the universe."
  },
  "exoplanet": {
    scientific: "Exoplanets are planets orbiting stars outside our solar system. Over 5,000 confirmed as of 2024, detected via transit photometry, radial velocity, and direct imaging. Categories include hot Jupiters, super-Earths, and potentially habitable worlds in stellar habitable zones.",
    simplified: "Exoplanets are planets around other stars! 🪐 We've found thousands of them—some are giant gas balls, others are rocky like Earth. Some might even have water and could be home to alien life!"
  },
  "wormhole": {
    scientific: "Wormholes are hypothetical topological features of spacetime creating shortcuts between distant points. Predicted by general relativity as Einstein-Rosen bridges. Traversable wormholes would require exotic matter with negative energy density. Currently theoretical with no observational evidence.",
    simplified: "A wormhole is like a cosmic shortcut! 🕳️ Imagine folding a piece of paper so two dots touch—that's how a wormhole might connect far-away places in space. Great for sci-fi movies, but we haven't found one yet!"
  },
  default: {
    scientific: "That's a fascinating question about the cosmos! The universe contains countless mysteries from quantum scales to the cosmic web. Current research with instruments like the James Webb Space Telescope continues to expand our understanding of the early universe, exoplanets, and stellar evolution.",
    simplified: "Great question! ✨ The universe is full of amazing things we're still figuring out. Scientists are always discovering new secrets about space, stars, and how everything works together!"
  }
};

const getMockResponse = (message: string, simplified: boolean): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check for equation/calculation
  const equationResult = solveEquation(message);
  if (equationResult) {
    return simplified 
      ? `Here you go! 🧮\n\n${equationResult}`
      : `Mathematical result:\n\n${equationResult}`;
  }
  
  for (const [key, responses] of Object.entries(mockResponses)) {
    if (key !== "default" && lowerMessage.includes(key)) {
      return simplified ? responses.simplified : responses.scientific;
    }
  }
  
  return simplified ? mockResponses.default.simplified : mockResponses.default.scientific;
};

// Simulate smooth typewriter effect
const simulateTyping = async (
  text: string,
  onChunk: (chunk: string) => void,
  delayMs: number = 12
): Promise<void> => {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs + Math.random() * 8));
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
      await new Promise(r => setTimeout(r, 300)); // Brief thinking delay
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
        await new Promise(r => setTimeout(r, 300));
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
      console.warn("API unavailable, using mock response:", e);
      assistantContent = "";
      await new Promise(r => setTimeout(r, 300));
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
