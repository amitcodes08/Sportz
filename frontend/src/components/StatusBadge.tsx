import type { MatchStatus } from "../types";

const statusStyles: Record<MatchStatus, string> = {
  scheduled:
    "bg-blue-500/20 text-blue-200 ring-blue-500/40 border border-blue-500/30",
  live: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 ring-red-500/40 border border-red-500/30 animate-pulse",
  finished:
    "bg-emerald-500/20 text-emerald-200 ring-emerald-500/40 border border-emerald-500/30",
};

interface Props {
  status: MatchStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status === "scheduled"
        ? "Scheduled"
        : status === "live"
          ? "🔴 Live"
          : "Completed"}
    </span>
  );
}
