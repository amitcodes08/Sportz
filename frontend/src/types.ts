export type MatchStatus = "scheduled" | "live" | "finished";

export interface Match {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  startTime: string;
  endTime: string;
  homeScore: number;
  awayScore: number;
}

export interface Commentary {
  id: number;
  matchId: number;
  minute?: number;
  sequence?: number;
  period?: string;
  eventType?: string;
  actor?: string;
  team?: string;
  message: string;
  tags?: string[];
  createdAt: string;
}

export interface WsMessage {
  type: string;
  matchId?: number;
  data?: any;
}
