import { Service } from "../types";
import { StatusBadge } from "./StatusBadge";
import { LatencyChart } from "./LatencyChart";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const formatLatency = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms}ms`;
  };

  return (
    <div className="bg-white dark:bg-[#1c1b18] rounded-xl border border-[#e8e6dc] dark:border-[#2c2b27] p-6 transition-all hover:border-[#d97757]/40 hover:shadow-lg hover:shadow-[#d97757]/5 h-full min-h-[200px] flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-base font-semibold text-[#141413] dark:text-[#faf9f5] truncate">
            {service.name}
          </h3>
          <p className="text-xs text-[#b0aea5] dark:text-[#8a8780] truncate mt-0.5">
            {service.url}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(service)}
            className="p-2 rounded-lg hover:bg-[#e8e6dc] dark:hover:bg-[#2c2b27] text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(service)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-[#b0aea5] hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={service.lastCheck?.status} />
        {service.lastCheck ? (
          <span className="text-sm font-medium text-[#141413] dark:text-[#faf9f5]">
            {formatLatency(service.lastCheck.latency)}
          </span>
        ) : (
          <span className="text-sm text-[#b0aea5]">Checking...</span>
        )}
        <span className="text-xs text-[#b0aea5] ml-auto">
          Every 10s
        </span>
      </div>

      <LatencyChart history={service.history} />
    </div>
  );
}
