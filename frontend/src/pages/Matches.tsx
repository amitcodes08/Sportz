import { useEffect, useMemo, useState } from "react";
import { getMatches } from "../api/matches";
import MatchCard from "../components/MatchCard";
import type { MatchStatus, Match } from "../types";

const tabs: Array<{ label: string; value: MatchStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Live", value: "live" },
  { label: "Completed", value: "finished" },
];

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | MatchStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getMatches(100)
      .then((data) => {
        setMatches(data);
        setError(null);
      })
      .catch((err) => setError(err.message || "Unable to load matches"))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredMatches = useMemo(() => {
    return matches
      .filter((match) => {
        if (activeFilter !== "all" && match.status !== activeFilter) {
          return false;
        }

        const normalized = searchTerm.toLowerCase();
        if (!normalized) return true;

        return [match.sport, match.homeTeam, match.awayTeam].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      })
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );
  }, [activeFilter, matches, searchTerm]);

  return (
    <main className="px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 animate-slideIn">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                Matches
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200">
                All schedules, live action, and results in one place.
              </h1>
              <p className="max-w-2xl text-slate-400">
                Filter by status, search by team or sport, and open any match to
                follow the live scorecard with commentary below.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-1 border border-purple-500/20 shadow-xl">
              <label className="sr-only" htmlFor="search">
                Search matches
              </label>
              <input
                id="search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search teams or sport"
                className="w-full rounded-[1.125rem] border border-purple-500/10 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-6 shadow-glow backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeFilter === tab.value
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-glow hover:shadow-glow-lg"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-purple-500/30"
                }`}
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-16 text-center text-slate-400 shadow-glow backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" />
              <div
                className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span className="ml-2">Loading matches…</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-10 text-center text-pink-200 shadow-glow backdrop-blur-xl">
            <p className="font-semibold mb-2">Unable to Load Matches</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-16 text-center text-slate-400 shadow-glow backdrop-blur-xl">
            No matches found for your filter.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMatches.map((match, idx) => (
              <div
                key={match.id}
                style={{
                  animation: `slideIn 0.6s ease-out ${idx * 0.05}s both`,
                }}
              >
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
