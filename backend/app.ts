import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// Сервер HTTP — щоб WebSocket працював через той самий порт
const server = http.createServer();
const wss = new WebSocketServer({ server });

const viewers = new Set<WebSocket>();
let lastFrame: Buffer | null = null;

wss.on('connection', (ws, req) => {
  const isClient = req.url === '/stream';
  const isViewer = req.url === '/view';

  if (isClient) {
    console.log('[+] Stream connected');

    ws.on('message', (data) => {
      if (Buffer.isBuffer(data)) {
        lastFrame = data;
        for (const viewer of viewers) {
          if (viewer.readyState === WebSocket.OPEN) {
            viewer.send(data);
          }
        }
      }
    });

    ws.on('close', () => {
      console.log('[-] Stream disconnected');
    });

  } else if (isViewer) {
    console.log('[+] Viewer connected');
    viewers.add(ws);

    if (lastFrame) {
      ws.send(lastFrame);
    }

    ws.on('close', () => {
      console.log('[-] Viewer disconnected');
      viewers.delete(ws);
    });
  } else {
    ws.close();
  }
});

server.listen(8080, () => {
  console.log('Server is running on ws://localhost:8080');
});
