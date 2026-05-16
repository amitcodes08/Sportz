import type { Commentary } from "../types";

interface Props {
  commentary: Commentary[];
}

function formatMinute(entry: Commentary) {
  if (entry.minute !== undefined) {
    return `${entry.minute}' ${entry.period ? entry.period : ""}`.trim();
  }
  return entry.period ? `${entry.period}` : "Live";
}

const eventTypeColors: Record<string, string> = {
  goal: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  card: "from-pink-500/20 to-red-500/10 border-pink-500/30",
  substitution: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  injury: "from-red-500/20 to-orange-500/10 border-red-500/30",
  default: "from-slate-600/20 to-slate-700/10 border-slate-600/30",
};

function getEventColor(eventType?: string): string {
  if (!eventType) return eventTypeColors.default;
  const key = eventType.toLowerCase();
  return eventTypeColors[key] || eventTypeColors.default;
}

export default function CommentaryList({ commentary }: Props) {
  if (commentary.length === 0) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8 text-center text-slate-400">
        <p className="text-sm">No commentary available yet.</p>
        <p className="text-xs mt-2 text-slate-500">
          Updates will appear here as the match progresses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {commentary.map((entry, idx) => (
        <article
          key={entry.id}
          className={`rounded-xl border bg-gradient-to-r ${getEventColor(entry.eventType)} p-4 transition-all duration-300 hover:shadow-glow hover:translate-x-1`}
          style={{
            animation: `slideIn 0.6s ease-out ${idx * 0.05}s both`,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.24em] font-semibold text-slate-400 mb-2">
            <span className="bg-white/10 rounded-full px-2.5 py-1">
              {formatMinute(entry)}
            </span>
            {entry.eventType && (
              <span className="bg-white/10 rounded-full px-2.5 py-1">
                {entry.eventType}
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-100 leading-relaxed">
            {entry.message}
          </h4>
          {(entry.actor || entry.team || entry.tags?.length) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
              {entry.actor && (
                <span className="text-slate-300 font-medium">
                  {entry.actor}
                </span>
              )}
              {entry.team && <span>• {entry.team}</span>}
              {entry.tags?.length && <span>• {entry.tags.join(", ")}</span>}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
