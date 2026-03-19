"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ChatInput } from "@/components/ChatInput";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-clip noise-bg selection:bg-white/20 selection:text-white">
      <Header />

      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 pb-24 pt-28 text-center md:gap-10 md:px-8 md:pt-32">
        
        {/* Linear-style Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-md cursor-pointer hover:bg-white/[0.04] transition-colors duration-200"
        >
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 antialiased">
            <span>extr0 is now in beta</span>
            <ArrowRight size={14} className="text-white/40" />
          </span>
        </motion.div>

        {/* Hero Typography Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          className="flex flex-col items-center gap-6 w-full"
        >
          <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 antialiased max-w-[700px]">
            The intelligent routing engine for models and agents
          </h1>
          <p className="text-[17px] md:text-lg text-white/50 font-normal tracking-tight antialiased max-w-[560px] leading-relaxed">
            Instantly analyze prompts, compare latency, and route queries to the most cost-effective LLM without breaking a sweat.
          </p>
        </motion.div>

        {/* Primary Interaction Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
          className="mt-6 w-full md:mt-8"
        >
          <ChatInput />
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 w-full text-white/30 text-[13px] font-medium antialiased pointer-events-none z-10"
      >
        <span>extr0 bypasses manual selection</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>v1.0.0</span>
      </motion.footer>
    </main>
  );
}
