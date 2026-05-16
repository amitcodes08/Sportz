import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
      <div className="relative mx-auto flex min-h-[calc(100vh-40px)] max-w-7xl flex-col justify-center gap-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <section className="space-y-8 animate-slideIn">
            <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 px-4 py-2 text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Live sports tracking with real-time commentary
            </div>
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200">
                Sportz Live
              </h1>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-300">
                Experience the modern scoreboard for every game. Discover
                upcoming fixtures, follow live match flow, and keep up with
                every play-by-play moment in a premium, animated interface built
                for speed and sports fans.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-4">
              <Link
                to="/matches"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-glow-lg"
              >
                Explore Matches
              </Link>
              <a
                href="#highlights"
                className="inline-flex items-center justify-center rounded-full border border-purple-500/30 bg-white/5 hover:bg-white/10 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-400/60 hover:text-white hover:shadow-glow-cyan"
              >
                See the experience
              </a>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-8 shadow-glow backdrop-blur-xl group card-hover">
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/10 blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-tr from-cyan-500/15 to-purple-500/10 blur-2xl" />
            <div className="relative space-y-6">
              <div className="rounded-[1.75rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-xl">
                <p className="text-xs uppercase tracking-[0.3em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                  Live event hub
                </p>
                <h2 className="mt-4 text-3xl font-bold text-white">
                  Next kickoff in minutes
                </h2>
                <p className="mt-3 text-slate-400">
                  Stay in the loop with schedules, live updates, and
                  ball-by-ball commentary in one elegant space.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-purple-500/15 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-5 shadow-xl hover:shadow-glow transition-all duration-300 hover:border-purple-500/30">
                  <p className="text-xs uppercase tracking-[0.3em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">
                    Team Spotlight
                  </p>
                  <p className="mt-4 text-lg font-semibold text-white">
                    Tigers vs Thunder
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    A high stakes match with live score tracking and play-feed
                    commentary.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-purple-500/15 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-5 shadow-xl hover:shadow-glow transition-all duration-300 hover:border-purple-500/30">
                  <p className="text-xs uppercase tracking-[0.3em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Fast UI
                  </p>
                  <p className="mt-4 text-lg font-semibold text-white">
                    Animated charts and glass panels
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Built to feel premium on desktop, tablet, and mobile alike.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section
          id="highlights"
          className="grid gap-8 rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-8 shadow-glow backdrop-blur-xl"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Fresh schedules",
                description: "All upcoming match dates and times in one view.",
                gradient: "from-purple-500/20 to-purple-600/10",
              },
              {
                title: "Live scorecards",
                description: "Instant live score updates and team details.",
                gradient: "from-cyan-500/20 to-teal-500/10",
              },
              {
                title: "Commentary feed",
                description:
                  "Real-time event commentary as the action unfolds.",
                gradient: "from-pink-500/20 to-purple-500/10",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-purple-500/15 bg-gradient-to-br ${item.gradient} p-6 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 group card-hover`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <p className="text-xs uppercase tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                  {item.title}
                </p>
                <p className="mt-4 text-base text-slate-300 group-hover:text-slate-200 transition-colors">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
