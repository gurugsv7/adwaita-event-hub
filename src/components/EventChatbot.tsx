import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Function to parse message content and make URLs clickable
const parseMessageContent = (content: string) => {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold/80 underline underline-offset-2 break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/event-chat`;

const EventChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 🎉 I'm ADWAITA AI, your fest guide! Ask me about events, registrations, delegate passes, or anything about ADWAITA 2026!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again! 🔄",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group",
          "w-12 h-12 sm:w-16 sm:h-16 rounded-full",
          "bg-gradient-to-br from-gold via-primary to-teal",
          "shadow-2xl shadow-gold/30",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "animate-pulse hover:animate-none",
          isOpen && "rotate-180 scale-90"
        )}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-7 sm:h-7 text-charcoal" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 text-charcoal" />
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-charcoal absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 animate-bounce" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50",
          "w-[300px] sm:w-[380px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-500 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        )}
      >
        <div className="bg-card/95 backdrop-blur-xl border-2 border-gold/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-gold/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-gold/20 via-primary/10 to-teal/20 border-b border-gold/20 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-card animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading text-base sm:text-lg text-foreground flex items-center gap-1.5 sm:gap-2">
                  ADWAITA AI
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                </h3>
                <p className="text-[10px] sm:text-xs text-silver/70">Your Fest Guide • Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[260px] sm:h-[350px] p-3 sm:p-4" ref={scrollRef}>
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2 sm:gap-3 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0",
                      message.role === "user"
                        ? "bg-gradient-to-br from-teal to-secondary"
                        : "bg-gradient-to-br from-gold to-primary"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-charcoal" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-charcoal" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[75%] px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed break-words overflow-hidden",
                      message.role === "user"
                        ? "bg-gradient-to-br from-teal/20 to-secondary/10 text-foreground rounded-tr-sm"
                        : "bg-gradient-to-br from-gold/10 to-primary/5 text-foreground rounded-tl-sm border border-gold/10"
                    )}
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                  >
                    {message.content ? (
                      <span className="whitespace-pre-wrap">{parseMessageContent(message.content)}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-gold" />
                        <span className="text-silver/70 text-xs sm:text-sm">Thinking...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-gold/20 p-3 sm:p-4 bg-background/50">
            <div className="flex gap-2 sm:gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about events..."
                className="flex-1 bg-background/80 border-gold/20 focus:border-gold rounded-lg sm:rounded-xl placeholder:text-silver/40 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-9 sm:w-12 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-gold to-primary text-charcoal hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
            <p className="text-[9px] sm:text-[10px] text-silver/40 text-center mt-2">
              Powered by ADWAITA AI
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventChatbot;
