"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { logsAtom, metricsAtom, RequestLog } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { GlassCard } from "@/components/GlassCard";
import { LatencyComparison } from "@/components/charts/LatencyComparison";
import { Activity, ShieldCheck, Zap, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [logs, setLogs] = useAtom(logsAtom);
  const [metrics] = useAtom(metricsAtom);

  useEffect(() => {
    // Initial fetch
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("request_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) setLogs(data as RequestLog[]);
    };
    fetchLogs();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel("live-traffic")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "request_logs" },
        (payload) => {
          setLogs((current) =>
            [payload.new as RequestLog, ...current].slice(0, 100)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setLogs]);

  return (
    <main className="min-h-screen w-full text-white font-sans pb-24 noise-bg">
      <Header />

      <section className="max-w-7xl mx-auto px-6 pt-24 mt-8 space-y-12 z-10 relative">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] text-white antialiased">
            Observability
          </h1>
          <p className="text-sm font-medium text-white/60 antialiased max-w-prose">
            Live Traffic & Intelligent Routing Engine Metrics
          </p>
        </motion.div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 [grid-auto-rows:1fr]">
          <KpiCard
            title="Requests Processed"
            value={metrics.totalRequests.toString()}
            icon={<Activity className="text-white/50" size={18} />}
            index={0}
          />
          <KpiCard
            title="Engine Savings"
            value={`$${metrics.totalSavings.toFixed(4)}`}
            icon={<Zap className="text-white/50" size={18} />}
            subtitle="vs baseline GPT-4o"
            index={1}
          />
          <KpiCard
            title="Avg Latency"
            value={`${metrics.avgLatency}ms`}
            icon={<ShieldCheck className="text-white/50" size={18} />}
            index={2}
          />
          <KpiCard
            title="Actual Cost"
            value={`$${metrics.totalCost.toFixed(4)}`}
            icon={<DollarSign className="text-white/50" size={18} />}
            index={3}
          />
        </div>

        {/* Intelligence Layer */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.2,
            }}
            className="xl:col-span-2 space-y-4"
          >
            <h2 className="text-xs font-medium text-white/60 antialiased">
              Latency Analysis (Live)
            </h2>
            <GlassCard className="p-6">
              <LatencyComparison logs={logs} />
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.3,
            }}
            className="space-y-4"
          >
            <h2 className="text-[13px] font-medium text-white/50 antialiased mb-2">
              Live Traffic Feed
            </h2>
            <div className="fade-mask-bottom h-[400px]">
              <GlassCard className="p-4 h-full overflow-y-auto no-scrollbar flex flex-col gap-2">
                {logs.length === 0 ? (
                  <div className="m-auto text-[13px] font-medium text-white/40 text-center antialiased">
                    Awaiting Requests...
                    <br />
                    <span className="text-[11px] text-white/30">
                      Send a prompt to the gateway
                    </span>
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        delay: idx * 0.02,
                      }}
                      className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 flex justify-between items-center hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors duration-200"
                    >
                      <div className="space-y-1">
                        <p
                          className="font-medium text-[13px] text-white/90 antialiased truncate max-w-[140px]"
                          title={log.model_used}
                        >
                          {log.model_used}
                        </p>
                        <p className="text-[11px] text-white/40 antialiased tracking-wide">
                          Tokens: {log.prompt_tokens + log.completion_tokens} | $
                          {log.total_cost.toFixed(6)}
                        </p>
                      </div>
                      <div className="text-right flex flex-col justify-center items-end gap-1">
                        <p className="text-[13px] text-white font-medium antialiased">
                          {log.latency_ms}ms
                        </p>
                        <p className="text-[10px] text-white/40 antialiased px-2 py-0.5 border border-white/[0.06] bg-white/[0.02] rounded hidden sm:inline-block">
                          {log.intent_category || "Semantic"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  index,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.05,
      }}
      className="h-full"
    >
      <GlassCard className="group relative flex h-full min-h-[176px] flex-col justify-between overflow-hidden p-6" hover>
        <div className="mb-5 flex min-h-[28px] items-start justify-between gap-3">
          <h3 className="text-xs font-medium text-white/60 antialiased leading-5">
            {title}
          </h3>
          <span className="shrink-0 pt-0.5">{icon}</span>
        </div>
        <div className="flex min-h-[66px] flex-col justify-end gap-2">
          <p className="text-3xl md:text-[44px] leading-none font-semibold tracking-[-0.02em] antialiased tabular-nums">
            {value}
          </p>
          <p className="min-h-[16px] text-[10px] font-medium text-white/50 antialiased leading-4">
            {subtitle ?? "\u00a0"}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
