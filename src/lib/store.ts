import { atom } from "jotai";

export type RequestLog = {
  id: string;
  user_id: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_cost: number;
  latency_ms: number;
  model_used: string;
  intent_category: string;
  was_fallback: boolean;
  created_at: string;
};

// Global state for request logs
export const logsAtom = atom<RequestLog[]>([]);

// Derived atoms for the Dashboard metrics
export const metricsAtom = atom((get) => {
  const logs = get(logsAtom);
  
  if (logs.length === 0) {
    return {
      totalRequests: 0,
      totalSavings: 0,
      avgLatency: 0,
      totalCost: 0
    };
  }

  let hypotheticalCost = 0;
  let actualCost = 0;
  let totalLatency = 0;
  
  logs.forEach(log => {
    actualCost += log.total_cost || 0;
    // Assuming worst case scenario is always running GPT-4o
    // ($5.00 per 1M prompt, $15.00 per 1M completion)
    const gpt4oCost = ((log.prompt_tokens || 0) / 1000000) * 5 + ((log.completion_tokens || 0) / 1000000) * 15;
    hypotheticalCost += gpt4oCost;
    totalLatency += log.latency_ms || 0;
  });
  
  return {
    totalRequests: logs.length,
    totalSavings: hypotheticalCost - actualCost,
    avgLatency: Math.round(totalLatency / logs.length),
    totalCost: actualCost
  };
});
