import { ServiceStatus } from "../types";

interface StatusBadgeProps {
  status: ServiceStatus | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) {
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#e8e6dc] dark:bg-[#2c2b27] text-[#b0aea5]">
        Pending
      </span>
    );
  }

  const styles = {
    healthy: "bg-[#788c5d]/15 text-[#788c5d] border-[#788c5d]/30",
    down: "bg-red-500/15 text-red-500 border-red-500/30",
    slow: "bg-[#d97757]/15 text-[#d97757] border-[#d97757]/30",
  };

  const labels = {
    healthy: "Healthy",
    down: "Down",
    slow: "Slow",
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
