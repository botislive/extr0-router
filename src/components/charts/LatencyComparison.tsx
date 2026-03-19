"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { RequestLog } from "@/lib/store";

export function LatencyComparison({ logs }: { logs: RequestLog[] }) {
  const chartData = useMemo(() => {
    const aggregate: Record<string, { totalLatency: number; count: number }> =
      {};

    logs.forEach((log) => {
      if (!log.model_used) return;
      if (!aggregate[log.model_used]) {
        aggregate[log.model_used] = { totalLatency: 0, count: 0 };
      }
      aggregate[log.model_used].totalLatency += log.latency_ms;
      aggregate[log.model_used].count += 1;
    });

    return Object.entries(aggregate)
      .map(([model, data]) => ({
        name: model
          .replace("gemini-1.5-", "G-")
          .replace("claude-3-5-", "C-")
          .replace("gpt-", "GPT-"),
        latency: Math.round(data.totalLatency / data.count),
        fullName: model,
      }))
      .sort((a, b) => a.latency - b.latency);
  }, [logs]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center text-white/40 text-sm font-medium antialiased">
        Awaiting Traffic...
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] relative">
      <div className="absolute top-0 right-0 text-[10px] text-white/40 font-medium antialiased z-10">
        Avg ms / Model
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            stroke="rgba(255, 255, 255, 0.1)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.1)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}ms`}
            tick={{ fill: "rgba(255, 255, 255, 0.4)" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.02)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card px-4 py-3 border border-white/[0.08] bg-black/80 backdrop-blur-md rounded-lg shadow-xl">
                    <p className="text-white/60 text-[11px] font-medium antialiased uppercase tracking-widest mb-1">
                      {payload[0].payload.fullName}
                    </p>
                    <p className="text-white text-lg font-semibold antialiased tracking-[-0.02em]">
                      {payload[0].value}ms
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="latency"
            fill="rgba(255, 255, 255, 0.85)"
            radius={[4, 4, 0, 0]}
            animationDuration={600}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
