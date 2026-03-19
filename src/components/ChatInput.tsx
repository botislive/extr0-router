"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { Plus, SendHorizontal, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputAtom } from "@/store/chat";

const SUGGESTIONS = [
  "Analyze Prompt Complexity",
  "Compare Latency",
  "Enable Cost-Cutting Mode",
  "Summarize Model Differences",
];

export function ChatInput() {
  const [input, setInput] = useAtom(inputAtom);
  const [isFocused, setIsFocused] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 400);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4 mx-auto">
      {/* The Command Center */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full"
      >
        <div
          className={cn(
            "relative w-full min-h-[140px] p-4 md:p-6",
            "glass-card",
            "transition-all duration-300 ease-out",
            isFocused
              ? "border-white/20 shadow-[0_0_24px_rgba(255,255,255,0.05)] bg-white/[0.02]"
              : "border-white/[0.08] bg-white/[0.01]",
            "flex flex-col justify-between",
            isThinking && "pulse-border"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What would you like to route today?"
            className={cn(
              "w-full bg-transparent border-none focus:ring-0 focus:outline-none",
              "text-white/90 placeholder:text-white/30",
              "resize-none overflow-y-auto no-scrollbar",
              "font-medium text-[15px] leading-relaxed antialiased",
              "max-h-[400px]"
            )}
            spellCheck={false}
          />

          <div className="flex items-center justify-between mt-4 md:mt-6 gap-2 border-t border-white/[0.04] pt-4">
            {/* Bottom-left: Attachments */}
            <div className="flex items-center gap-1.5">
              <button
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                  "text-white/40 hover:text-white/90 hover:bg-white/[0.06]"
                )}
                aria-label="Add attachment"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
              <button
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                  "text-white/40 hover:text-white/90 hover:bg-white/[0.06]"
                )}
                aria-label="Upload file"
              >
                <Paperclip size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Bottom-right: Send Button */}
            <button
              className={cn(
                "px-4 py-2 flex items-center justify-center gap-2 rounded-md",
                "bg-white hover:bg-white/90 text-black font-semibold text-[13px] antialiased",
                "transition-all duration-200 active:scale-[0.98]",
                "shadow-[0_2px_8px_rgba(255,255,255,0.15)]",
                !input.trim() && "opacity-40 cursor-not-allowed hover:bg-white active:scale-100 shadow-none"
              )}
              disabled={!input.trim()}
            >
              <span>Route</span>
              <SendHorizontal size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Suggestion Pills */}
      <div className="w-full flex flex-wrap justify-center gap-2 py-2">
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
            onClick={() => setInput(suggestion)}
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
    </div>
  );
}
