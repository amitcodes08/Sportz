import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, X, Play, Bell, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || `${API_URL.replace(/^http/, 'ws')}/ws`;

function App() {
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, disconnected
  const [matches, setMatches] = useState({});
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [newMatchesCount, setNewMatchesCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [loadingCommentary, setLoadingCommentary] = useState(false);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '00:00 PM';
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '00:00 PM';
    }
  };

  const formatTimeWithSeconds = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '00:00:00 PM';
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return '00:00:00 PM';
    }
  };

  useEffect(() => {
    function connectWS() {
      setConnectionStatus('connecting');
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('🔌 WebSocket Connected');
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📥 WS Message Received:', message);

          switch (message.type) {
            case 'welcome':
              console.log('Welcome received');
              break;

            case 'initial_state':
              if (Array.isArray(message.data)) {
                const initialMap = {};
                message.data.forEach((match) => {
                  initialMap[match.id] = match;
                });
                setMatches(initialMap);
              }
              break;

            case 'match_created':
              if (message.data && message.data.id) {
                setMatches((prev) => ({
                  ...prev,
                  [message.data.id]: message.data
                }));
                setNewMatchesCount((prev) => prev + 1);
                setShowBanner(true);
              }
              break;

            case 'score_update':
              if (message.data && message.data.matchId !== undefined) {
                const { matchId, homeScore, awayScore } = message.data;
                setMatches((prev) => {
                  if (!prev[matchId]) return prev;
                  return {
                    ...prev,
                    [matchId]: {
                      ...prev[matchId],
                      homeScore,
                      awayScore
                    }
                  };
                });
              }
              break;

            case 'commentary':
              if (message.data && message.data.matchId === selectedMatchId) {
                setCommentary((prev) => [message.data, ...prev]);
              }
              break;

            case 'subscribed':
              console.log(`Subscribed to match ${message.matchId}`);
              break;

            case 'unsubscribed':
              console.log(`Unsubscribed from match ${message.matchId}`);
              break;

            default:
              break;
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('❌ WebSocket Disconnected');
        setConnectionStatus('disconnected');
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWS();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        ws.close();
      };
    }

    connectWS();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [selectedMatchId]);

  const handleWatchLive = async (matchId) => {
    if (selectedMatchId === matchId) return;

    if (selectedMatchId && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        matchId: selectedMatchId
      }));
    }

    setSelectedMatchId(matchId);
    setCommentary([]);
    setLoadingCommentary(true);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'subscribe',
        matchId: matchId
      }));
    }

    try {
      const response = await fetch(`${API_URL}/matches/${matchId}/commentary?limit=50`);
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json.data)) {
          setCommentary(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching matches commentary:', err);
    } finally {
      setLoadingCommentary(false);
    }
  };

  const handleCloseWatch = () => {
    if (selectedMatchId && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        matchId: selectedMatchId
      }));
    }
    setSelectedMatchId(null);
    setCommentary([]);
  };

  const matchesList = Object.values(matches).sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-neoBg p-4 sm:p-6 md:p-8 selection:bg-neoYellow selection:text-black">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Header */}
        <header className="mb-6 flex flex-col items-stretch justify-between gap-4 border-4 border-black bg-neoYellow p-6 rounded-2xl shadow-neo md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
              Sportz
            </h1>
            <p className="mt-1 text-lg font-bold text-black opacity-80">
              Real-time match data demo
            </p>
          </div>

          <div className="flex items-center self-start md:self-auto">
            <div className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 font-black rounded-xl shadow-neoActive">
              <span className={`h-3.5 w-3.5 rounded-full border border-black ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-spin border-dashed' :
                'bg-neoRed'
              }`} />
              <span className="text-sm tracking-wider uppercase">
                {connectionStatus === 'connected' ? 'LIVE CONNECTED' :
                 connectionStatus === 'connecting' ? 'CONNECTING...' :
                 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </header>

        {/* Notification Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between border-4 border-black bg-neoYellow p-4 rounded-xl shadow-neo">
                <div className="flex items-center gap-3">
                  <div className="border border-black bg-white p-1 rounded-lg">
                    <Bell className="h-5 w-5" />
                  </div>
                  <span className="font-extrabold text-black">
                    {newMatchesCount} {newMatchesCount === 1 ? 'new match' : 'new matches'} added
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowBanner(false);
                    setNewMatchesCount(0);
                  }}
                  className="border-2 border-black bg-white px-4 py-1.5 text-xs font-black uppercase rounded-lg shadow-neoActive hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info row with Title and Counters */}
        <div className="mb-6 flex items-center justify-between border-b-2 border-dashed border-black pb-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 bg-sky-400 inline-block border border-black rounded-full" />
            <h2 className="text-2xl font-black tracking-tight">Current Matches</h2>
          </div>
          <div className="border-2 border-black bg-black px-3 py-1 font-bold text-white rounded-lg text-xs uppercase tracking-widest">
            API: {matchesList.length}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Column (Match Grid) */}
          <div className="lg:col-span-8">
            {matchesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-4 border-dashed border-black bg-white p-12 text-center rounded-2xl">
                <AlertTriangle className="h-12 w-12 text-neoYellow animate-bounce mb-4 stroke-2" />
                <h3 className="text-xl font-bold">No Matches Available</h3>
                <p className="mt-2 text-gray-600 max-w-sm">
                  We are waiting for matches data to load from the server. Ensure the database is seeded.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {matchesList.map((match) => {
                  const isActive = selectedMatchId === match.id;
                  return (
                    <div
                      key={match.id}
                      className={`flex flex-col justify-between border-4 border-black bg-white p-5 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'ring-4 ring-neoYellow shadow-[6px_6px_0_0_rgba(0,0,0,1)] scale-[1.01]'
                          : 'shadow-neo hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)]'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <span className="border-2 border-black bg-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-full">
                          {match.sport}
                        </span>
                        
                        {match.status === 'live' && (
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-neoRed border border-black animate-blink" />
                            <span className="text-xs font-black uppercase text-neoRed">Live</span>
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-lg font-black text-black leading-tight">
                            {match.homeTeam}
                          </span>
                          <span className={`flex h-10 w-10 items-center justify-center border-2 border-black font-extrabold text-black rounded-lg ${
                            isActive && Number(match.homeScore) >= Number(match.awayScore) ? 'bg-neoYellow' : 'bg-white'
                          }`}>
                            {match.homeScore}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-lg font-black text-black leading-tight">
                            {match.awayTeam}
                          </span>
                          <span className={`flex h-10 w-10 items-center justify-center border-2 border-black font-extrabold text-black rounded-lg ${
                            isActive && Number(match.awayScore) >= Number(match.homeScore) ? 'bg-neoYellow' : 'bg-white'
                          }`}>
                            {match.awayScore}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="border-t border-dashed border-gray-300 pt-4 flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-500">
                          {formatTime(match.startTime)}
                        </span>

                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <>
                              <button
                                disabled
                                className="border-2 border-black bg-sky-200 px-3 py-1.5 text-xs font-black uppercase rounded-xl shadow-neoActive cursor-default"
                              >
                                Watching Live
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseWatch();
                                }}
                                className="border-2 border-black bg-white p-1.5 text-black hover:bg-neoRed hover:text-white rounded-xl shadow-neoActive hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-100"
                                title="Close feed"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleWatchLive(match.id)}
                              className="border-2 border-black bg-neoYellow px-4 py-1.5 text-xs font-black uppercase rounded-xl shadow-neoActive hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
                            >
                              Watch Live
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (Commentary Panel) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
            
            {/* Empty State */}
            {selectedMatchId === null ? (
              <div className="flex flex-col items-center justify-center border-4 border-dashed border-black bg-white p-8 text-center rounded-2xl min-h-[400px]">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-black bg-neoYellow rounded-full shadow-neoActive mb-4">
                  <Camera className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-extrabold text-black">No Match Selected</h3>
                <p className="mt-2 text-sm font-bold text-gray-500 max-w-[240px] leading-relaxed">
                  Select a match from the list to view live commentary and real-time updates.
                </p>
              </div>
            ) : (
              
              /* Active State */
              <div className="flex flex-col border-4 border-black bg-white rounded-2xl shadow-neo overflow-hidden max-h-[75vh]">
                
                {/* Commentary Header */}
                <div className="flex items-center justify-between border-b-4 border-black bg-neoBlue p-4">
                  <div>
                    <h3 className="font-extrabold text-black text-lg">Live Commentary</h3>
                    <p className="text-xs font-bold text-black opacity-75">
                      {matches[selectedMatchId] ? `${matches[selectedMatchId].homeTeam} vs ${matches[selectedMatchId].awayTeam}` : 'Loading...'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 border-2 border-black bg-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse border border-black" />
                    <span>Real-time</span>
                  </div>
                </div>

                {/* Commentary Feed List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
                  {loadingCommentary ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <RefreshCw className="h-8 w-8 text-black animate-spin mb-2" />
                      <span className="text-xs font-bold text-gray-500">Loading Commentary...</span>
                    </div>
                  ) : commentary.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm font-bold text-gray-500">No commentary events yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Updates will appear as the match progresses.</p>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {commentary.map((event) => {
                        const isWicket = String(event.eventType).toUpperCase() === 'WICKET';
                        const isSix = String(event.eventType).toUpperCase() === 'SIX';
                        const isFour = String(event.eventType).toUpperCase() === 'FOUR';
                        const isRun = String(event.eventType).toUpperCase() === 'RUN';
                        const isGoal = String(event.eventType).toUpperCase() === 'GOAL';

                        let badgeColorClass = 'bg-gray-200 text-black border border-black';
                        if (isWicket || isSix) {
                          badgeColorClass = 'bg-neoYellow text-black border border-black';
                        } else if (isFour) {
                          badgeColorClass = 'bg-green-400 text-black border border-black';
                        } else if (isGoal) {
                          badgeColorClass = 'bg-neoRed text-white border border-black';
                        }

                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            className="border-2 border-black p-3.5 rounded-xl bg-white shadow-neoActive flex flex-col gap-2"
                          >
                            {/* Top row */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 font-bold">
                              <span>{formatTimeWithSeconds(event.createdAt)}</span>
                              
                              {event.minute !== null && event.minute !== undefined && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="border border-black bg-white px-1.5 py-0.5 rounded text-black font-extrabold">{event.minute}'</span>
                                </>
                              )}

                              {event.sequence !== null && event.sequence !== undefined && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span>Seq {event.sequence}</span>
                                </>
                              )}

                              {event.period && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="capitalize">{event.period}</span>
                                </>
                              )}

                              {event.eventType && (
                                <span className={`ml-auto uppercase text-[9px] font-black px-2 py-0.5 rounded-full ${badgeColorClass}`}>
                                  {event.eventType}
                                </span>
                              )}
                            </div>

                            {/* Second row (Actor & Team name) */}
                            {(event.actor || event.team) && (
                              <div className="text-xs font-black text-black">
                                {event.actor && <span>{event.actor}</span>}
                                {event.actor && event.team && <span className="mx-1 text-gray-400">•</span>}
                                {event.team && <span className="text-gray-600">{event.team}</span>}
                              </div>
                            )}

                            {/* Third row (Commentary Text) */}
                            <div className="border border-black bg-gray-100 p-2.5 rounded-lg text-sm text-black font-bold">
                              {event.message}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* Footer panel close */}
                <div className="border-t-4 border-black p-3 bg-gray-50 text-right">
                  <button
                    onClick={handleCloseWatch}
                    className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase rounded-lg shadow-neoActive hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-100"
                  >
                    Close Watch
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
