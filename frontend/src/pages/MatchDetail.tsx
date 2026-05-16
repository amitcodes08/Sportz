import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCommentary, getMatchById } from "../api/matches";
import useMatchWebSocket from "../hooks/useMatchWebSocket";
import CommentaryList from "../components/CommentaryList";
import Scorecard from "../components/Scorecard";
import type { Commentary, Match } from "../types";

export default function MatchDetail() {
  const { id } = useParams();
  const matchId = Number(id ?? 0);
  const navigate = useNavigate();

  const [match, setMatch] = useState<Match | null>(null);
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appendCommentary = useCallback((comment: Commentary) => {
    setCommentary((current) => [comment, ...current]);
  }, []);

  const { connected } = useMatchWebSocket(matchId, appendCommentary);

  useEffect(() => {
    if (!matchId || Number.isNaN(matchId)) {
      setError("Invalid match ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([getMatchById(matchId), getCommentary(matchId, 100)])
      .then(([selectedMatch, commentaryList]) => {
        if (!selectedMatch) {
          throw new Error("Match not found.");
        }

        setMatch(selectedMatch);
        setCommentary(commentaryList);
        setError(null);
      })
      .catch((err) => setError(err.message || "Unable to load match details"))
      .finally(() => setLoading(false));
  }, [matchId]);

  const scorecard = useMemo(
    () => match && <Scorecard match={match} />,
    [match],
  );

  return (
    <main className="px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <button
          type="button"
          onClick={() => navigate("/matches")}
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-purple-400/60 hover:text-white"
        >
          ← Back to matches
        </button>

        {loading ? (
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
              <span className="ml-2">Loading match details…</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-10 text-center text-pink-200 shadow-glow backdrop-blur-xl">
            <p className="font-semibold mb-2">Unable to Load Match</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : match ? (
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-8 shadow-glow backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                    Match details
                  </p>
                  <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200">
                    {match.homeTeam} vs {match.awayTeam}
                  </h1>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-white/5 backdrop-blur-lg px-5 py-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-pulse"}`}
                  />
                  <span className="text-sm font-medium text-slate-300">
                    {connected
                      ? "Live updates connected"
                      : "Connecting to live feed..."}
                  </span>
                </div>
              </div>
            </div>

            {scorecard}

            <section className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-8 shadow-glow backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                    Match commentary
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    Live play-by-play feed
                  </h2>
                </div>
                <p className="rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 px-4 py-2 text-sm font-semibold text-slate-300">
                  Latest first
                </p>
              </div>
              <div className="mt-6">
                <CommentaryList commentary={commentary} />
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
