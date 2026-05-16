import type { Commentary, Match } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const WS_URL =
  import.meta.env.VITE_WS_URL ?? API_BASE.replace(/^http/, "ws") + "/ws";

async function getMatches(limit = 100): Promise<Match[]> {
  const response = await fetch(`${API_BASE}/matches?limit=${limit}`);

  if (!response.ok) {
    throw new Error("Unable to load matches");
  }

  const json = await response.json();
  return json.data as Match[];
}

async function getMatchById(matchId: number): Promise<Match | null> {
  const matches = await getMatches(100);
  return matches.find((match) => match.id === matchId) ?? null;
}

async function getCommentary(
  matchId: number,
  limit = 100,
): Promise<Commentary[]> {
  const response = await fetch(
    `${API_BASE}/matches/${matchId}/commentary?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load commentary");
  }

  const json = await response.json();
  return json.data as Commentary[];
}

export { API_BASE, WS_URL, getMatches, getMatchById, getCommentary };
