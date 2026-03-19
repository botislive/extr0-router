"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";
import { Session } from "@supabase/supabase-js";

export function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.02em] lowercase text-white hover:text-white/80 transition-colors duration-200 antialiased"
          >
            extr0
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-[13px] font-medium tracking-[0.01em] text-white/50 hover:text-white transition-colors duration-200 antialiased"
          >
            API Docs
          </Link>
          
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium tracking-[0.01em] text-white/50 hover:text-white transition-colors duration-200 antialiased"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className={cn(
                  "button-base text-[13px] font-medium tracking-[0.01em] px-3 py-1.5",
                  "bg-white/[0.04] hover:bg-white/[0.08] text-white",
                  "border border-white/[0.08] hover:border-white/[0.12]",
                  "antialiased transition-all duration-200 active:scale-[0.98]"
                )}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                "button-base text-[13px] font-medium tracking-[0.01em] px-3 py-1.5",
                "bg-white/[0.04] hover:bg-white/[0.08] text-white",
                "border border-white/[0.08] hover:border-white/[0.12]",
                "antialiased transition-all duration-200 active:scale-[0.98]"
              )}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
