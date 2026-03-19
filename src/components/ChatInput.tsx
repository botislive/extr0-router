"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, SendHorizontal, Paperclip, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Analyze Prompt Complexity",
  "Compare Latency",
  "Enable Cost-Cutting Mode",
  "Summarize Model Differences",
];

export function ChatInput() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const safeInput = input.trim();
  const isLoading = status === "submitted" || status === "streaming";
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeInput || isLoading) return;
    await sendMessage({ text: safeInput });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  const getMessageText = (parts: unknown) => {
    if (!Array.isArray(parts)) return "";
    return parts.filter(isTextUIPart).map((part) => part.text).join("");
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6 mx-auto h-full max-h-[80vh]">
      {/* Chat Messages Area */}
      {messages.length > 0 && (
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col gap-6 px-4 pb-4">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex w-full gap-4",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "p-4 rounded-xl max-w-[85%] text-[14px] leading-relaxed antialiased",
                    m.role === "user"
                      ? "bg-white/[0.08] text-white border border-white/[0.12]"
                      : "bg-transparent text-white/90"
                  )}
                >
                  {m.role !== "user" && (
                    <div className="flex items-center gap-2 mb-2 select-none opacity-50">
                      <Bot size={14} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        extr0
                      </span>
                    </div>
                  )}
                  {getMessageText(m.parts)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="w-full shrink-0">
        <form onSubmit={onSubmit} className="relative w-full">
          <div
            className={cn(
              "relative w-full min-h-[120px] p-4 md:p-6 glass-card",
              "transition-all duration-300 ease-out",
              isFocused
                ? "border-white/20 shadow-[0_0_24px_rgba(255,255,255,0.05)] bg-white/[0.02]"
                : "border-white/[0.08] bg-white/[0.01]",
              "flex flex-col justify-between"
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to route today?"
              className={cn(
                "w-full bg-transparent border-none focus:ring-0 focus:outline-none",
                "text-white/90 placeholder:text-white/30",
                "resize-none overflow-y-auto no-scrollbar",
                "font-medium text-[15px] leading-relaxed antialiased",
                "max-h-[200px]"
              )}
              spellCheck={false}
            />

            <div className="flex items-center justify-between mt-4 md:mt-6 gap-2 border-t border-white/[0.04] pt-4">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                    "text-white/40 hover:text-white/90 hover:bg-white/[0.06]"
                  )}
                  aria-label="Add attachment"
                >
                  <Plus size={16} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                    "text-white/40 hover:text-white/90 hover:bg-white/[0.06]"
                  )}
                  aria-label="Upload file"
                >
                  <Paperclip size={16} strokeWidth={2} />
                </button>
              </div>

              <button
                type="submit"
                className={cn(
                  "px-4 py-2 flex items-center justify-center gap-2 rounded-md",
                  "bg-white text-black font-semibold text-[13px] antialiased",
                  "transition-all duration-200 active:scale-[0.98]",
                  "shadow-[0_2px_8px_rgba(255,255,255,0.15)]",
                  (!safeInput || isLoading) &&
                    "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-white"
                )}
                disabled={!safeInput || isLoading}
              >
                <span>{isLoading ? "Routing..." : "Route"}</span>
                <SendHorizontal size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </form>

        {messages.length === 0 && (
          <div className="w-full flex flex-wrap justify-center gap-2 py-4">
            {SUGGESTIONS.map((suggestion, idx) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: idx * 0.05,
                }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors duration-200",
                  "bg-white/[0.03] hover:bg-white/[0.08]",
                  "border border-white/[0.06] hover:border-white/[0.12]",
                  "text-[12px] font-medium text-white/50 hover:text-white/90 antialiased"
                )}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
