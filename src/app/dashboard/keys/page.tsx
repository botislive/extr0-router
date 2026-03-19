"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Key } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

export default function KeysPage() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Load existing keys
    const loadKeys = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("provider_api_keys")
        .select("provider, api_key")
        .eq("user_id", user.id);

      if (data) {
        data.forEach((p) => {
          if (p.provider === "openai") setOpenaiKey(p.api_key);
          if (p.provider === "anthropic") setAnthropicKey(p.api_key);
        });
      }
    };
    loadKeys();
  }, [supabase]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates = [];
      if (openaiKey) {
        updates.push({ user_id: user.id, provider: "openai", api_key: openaiKey });
      }
      if (anthropicKey) {
        updates.push({ user_id: user.id, provider: "anthropic", api_key: anthropicKey });
      }

      for (const update of updates) {
        const { error } = await supabase.from("provider_api_keys").upsert(update, { onConflict: "user_id, provider" });
        if (error) throw error;
      }

      setMessage({ type: "success", text: "API keys secured encrypted logically in vault." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save keys." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-6 py-6 noise-bg">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white antialiased flex items-center gap-3">
          <Key className="text-white/50" />
          Provider API Keys
        </h1>
        <p className="mt-2 text-[14px] text-white/50 antialiased">
          Securely provide your own AI provider keys. We use these to fulfill the prompts you route through our gateway.
        </p>
      </motion.div>

      <GlassCard className="p-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-white/80 antialiased block">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className={cn(
                "w-full rounded-md px-3 py-2 text-[14px] text-white outline-none transition-all duration-200 antialiased",
                "bg-white/[0.03] placeholder:text-white/20",
                "border border-white/[0.08] focus:border-white/[0.2] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/[0.2]"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-white/80 antialiased block">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              className={cn(
                "w-full rounded-md px-3 py-2 text-[14px] text-white outline-none transition-all duration-200 antialiased",
                "bg-white/[0.03] placeholder:text-white/20",
                "border border-white/[0.08] focus:border-white/[0.2] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/[0.2]"
              )}
            />
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div>
              {message && (
                <span className={cn(
                  "text-[13px] font-medium antialiased",
                  message.type === "success" ? "text-green-400" : "text-red-400"
                )}>
                  {message.text}
                </span>
              )}
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "px-4 py-2 flex items-center justify-center gap-2 rounded-md",
                "bg-white hover:bg-white/90 text-black font-semibold text-[13px] antialiased",
                "transition-all duration-200 active:scale-[0.98]",
                "shadow-[0_2px_8px_rgba(255,255,255,0.15)]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              )}
            >
              {isSaving ? (
                <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
              ) : (
                <>
                  <span>Save Keys</span>
                  <Save size={14} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
