import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link 
          href="/" 
          className="text-2xl font-black tracking-tighter lowercase text-white hover:text-acid-green transition-colors drop-shadow-[2px_2px_0_rgba(204,255,0,0.5)]"
        >
          extr0
        </Link>
      </div>

      <nav className="flex items-center gap-8">
        <Link 
          href="/docs" 
          className="text-sm font-mono uppercase tracking-widest text-slate-400 hover:text-acid-green transition-colors"
        >
          API Docs
        </Link>
        <Link 
          href="/signin" 
          className={cn(
            "text-sm font-bold font-mono tracking-widest uppercase px-6 py-2 rounded-none",
            "bg-white text-black hover:bg-acid-green transition-colors tactile-click border-2 border-black",
            "shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0_rgba(204,255,0,1)]"
          )}
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}
