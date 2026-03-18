import { Header } from "@/components/Header";
import { ChatInput } from "@/components/ChatInput";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background noise-bg">
      <Header />

      <section className="flex flex-col items-center gap-16 text-center z-10">
        {/* Central Branding Section - Brutalist */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-8xl md:text-9xl font-black lowercase tracking-tighter text-white drop-shadow-[4px_4px_0_rgba(204,255,0,1)]">
            extr0
          </h1>
          <div className="bg-obsidian sharp-border px-6 py-2">
            <p className="text-sm font-mono tracking-widest uppercase text-acid-green max-w-prose">
              Intelligent LLM Gateway: Analyze. Route. Optimize.
            </p>
          </div>
        </div>

        <ChatInput />
      </section>

      {/* Footer Decoration or Small Text */}
      <footer className="absolute bottom-6 text-slate-600 text-[10px] font-mono uppercase tracking-widest pointer-events-none z-10">
        Powered by AI Router 1.0 — 2026
      </footer>
    </main>
  );
}
