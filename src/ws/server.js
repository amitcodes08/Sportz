import {WebSocket, WebSocketServer} from 'ws';

function sendJson(socket, payload) {
    if(socket.readyState !== WebSocket.OPEN) {
        return;
    }
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
    for(const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) {
          return;
        }
        sendJson(client, payload);
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 1024 * 1024 });

    wss.on('connection', (socket) => {
        
        sendJson(socket, { type: 'connection_success', message: 'Connected to WebSocket server' });

        socket.on('message', (message) => {
            console.log('Received message:', message);
            // Handle incoming messages from clients if needed
        });

        socket.on('close', () => {
            console.log('Client disconnected');
        });

        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    function broadcastMatchCreated(match) {
        broadcast(wss, { type: 'match_created', data: match });
    }

    function broadcastCommentary(commentary) {
        broadcast(wss, { type: 'new_commentary', data: commentary });
    }

    return { broadcastMatchCreated, broadcastCommentary };
}