import { HealthCheckResult } from "../types";

interface LatencyChartProps {
  history: HealthCheckResult[];
}

export function LatencyChart({ history }: LatencyChartProps) {
  const recentHistory = history.slice(-20);

  if (recentHistory.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center text-[#b0aea5] text-xs">
        Waiting for data...
      </div>
    );
  }

  const maxLatency = Math.max(...recentHistory.map((h) => h.latency), 100);

  return (
    <div className="flex items-end gap-[3px] h-16">
      {recentHistory.map((check, i) => {
        const height = Math.max((check.latency / maxLatency) * 100, 4);
        const color =
          check.status === "healthy"
            ? "bg-[#788c5d]"
            : check.status === "slow"
              ? "bg-[#d97757]"
              : "bg-red-500";

        return (
          <div
            key={i}
            className={`${color} rounded-t-sm transition-all duration-300 hover:opacity-80 flex-1 min-w-[4px]`}
            style={{ height: `${height}%` }}
            title={`${check.latency}ms - ${check.status}`}
          />
        );
      })}
    </div>
  );
}
