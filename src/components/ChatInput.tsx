"use client";

import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6 px-4">
      <div className="relative w-full group">
        {/* The Hub Container (Brutalist style) */}
        <div 
          className={cn(
            "relative w-full min-h-[140px] p-4",
            "bg-obsidian sharp-border rounded-none",
            "transition-all duration-200 ease-out",
            "group-focus-within:ring-2 group-focus-within:ring-acid-green group-focus-within:border-acid-green",
            "flex flex-col justify-between shadow-[8px_8px_0_rgba(204,255,0,0.1)] group-focus-within:shadow-[8px_8px_0_rgba(204,255,0,0.5)]"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's your query? Analyze, Route, Optimize..."
            className={cn(
              "w-full bg-transparent border-none focus:ring-0",
              "text-white placeholder:text-slate-500/80",
              "resize-none overflow-hidden",
              "font-mono min-h-[80px] text-lg leading-relaxed placeholder:font-sans"
            )}
          />

          <div className="flex items-center justify-between mt-4">
            {/* Bottom-left: Attachments */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:text-acid-green transition-colors tactile-click rounded-none sharp-border bg-background">
                <Plus size={18} />
              </button>
              <button className="p-2 text-slate-500 hover:text-white transition-colors tactile-click">
                <Paperclip size={18} />
              </button>
            </div>

            {/* Bottom-right: Send */}
            <button 
              className={cn(
                "px-6 py-2 rounded-none flex items-center justify-center gap-2 transition-all duration-200",
                "bg-acid-green hover:bg-[#bbf000] text-black font-bold uppercase tracking-wider text-sm",
                "tactile-click border-2 border-black",
                !input.trim() && "opacity-50 grayscale cursor-not-allowed border-transparent"
              )}
              disabled={!input.trim()}
            >
              <span>Route</span>
              <SendHorizontal size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion Pills (Sharp Blocks) */}
      <div className="w-full flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2 px-1">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-none",
              "bg-obsidian sharp-border border-b-2",
              "text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white",
              "hover:bg-obsidian-lighter hover:border-acid-green hover:border-b-4",
              "transition-all duration-150 tactile-click"
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
