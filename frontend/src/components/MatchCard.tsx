import { Link } from "react-router-dom";
import type { Match } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  match: Match;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function MatchCard({ match }: Props) {
  const getScoreGradient = () => {
    if (match.homeScore > match.awayScore)
      return "from-purple-500/20 to-purple-600/10";
    if (match.awayScore > match.homeScore)
      return "from-cyan-500/20 to-teal-500/10";
    return "from-slate-600/20 to-slate-700/10";
  };

  return (
    <Link
      to={`/matches/${match.id}`}
      className="group block rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-glow card-hover"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
            {match.sport}
          </p>
          <h3 className="mt-2 text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-cyan-200 transition-all">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
        </div>
        <StatusBadge status={match.status} />
      </div>

      <div
        className={`mt-4 rounded-xl bg-gradient-to-r ${getScoreGradient()} p-4 border border-white/5`}
      >
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xs uppercase text-slate-400 mb-1">Home</p>
            <p className="text-2xl font-bold text-white">{match.homeScore}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400">vs</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-xs uppercase text-slate-400 mb-1">Away</p>
            <p className="text-2xl font-bold text-white">{match.awayScore}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-lg bg-white/5 border border-purple-500/10 p-3">
          <p className="text-xs uppercase text-slate-500">Kickoff</p>
          <p className="mt-1 text-sm text-slate-300">
            {formatTime(match.startTime)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300 transition">
        <span>Ends {formatTime(match.endTime)}</span>
        <span className="transition group-hover:translate-x-1">
          View details →
        </span>
      </div>
    </Link>
  );
}
