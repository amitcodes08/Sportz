import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../api/matches";
import type { Commentary } from "../types";

export default function useMatchWebSocket(
  matchId: number,
  onCommentary: (comment: Commentary) => void,
) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    function subscribe() {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "subscribe", matchId }));
      }
    }

    ws.addEventListener("open", () => {
      setConnected(true);
      subscribe();
    });

    ws.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (
          payload?.type === "commentary" &&
          payload.data?.matchId === matchId
        ) {
          onCommentary(payload.data as Commentary);
        }
      } catch {
        // ignore malformed WS updates
      }
    });

    ws.addEventListener("close", () => setConnected(false));
    ws.addEventListener("error", () => setConnected(false));

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", matchId }));
      }
      ws.close();
    };
  }, [matchId, onCommentary]);

  return { connected };
}
