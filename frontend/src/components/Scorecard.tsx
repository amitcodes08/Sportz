import type { Match } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  match: Match;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Scorecard({ match }: Props) {
  const isHomeWinning = match.homeScore > match.awayScore;
  const isAwayWinning = match.awayScore > match.homeScore;

  return (
    <section className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-8 shadow-glow backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
            Live scoreboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {match.homeTeam} vs {match.awayTeam}
          </h1>
        </div>
        <StatusBadge status={match.status} />
      </div>

      <div className="mt-6 grid gap-6 rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div
          className={`text-center p-6 rounded-xl border transition-all ${isHomeWinning ? "border-purple-500/30 bg-purple-500/10" : "border-slate-600/20 bg-white/5"}`}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">
            Home
          </p>
          <p
            className={`mt-4 text-5xl font-bold ${isHomeWinning ? "text-purple-300" : "text-slate-100"}`}
          >
            {match.homeScore}
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] font-semibold text-slate-400">
            {match.homeTeam}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
            {match.homeScore}
            <span className="text-slate-400 mx-2">–</span>
            {match.awayScore}
          </span>
          <span className="text-xs text-slate-400">
            {formatTime(match.startTime)} • ends {formatTime(match.endTime)}
          </span>
        </div>

        <div
          className={`text-center p-6 rounded-xl border transition-all ${isAwayWinning ? "border-cyan-500/30 bg-cyan-500/10" : "border-slate-600/20 bg-white/5"}`}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">
            Away
          </p>
          <p
            className={`mt-4 text-5xl font-bold ${isAwayWinning ? "text-cyan-300" : "text-slate-100"}`}
          >
            {match.awayScore}
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] font-semibold text-slate-400">
            {match.awayTeam}
          </p>
        </div>
      </div>
    </section>
  );
}
