const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const PORT = process.env.WS_PORT || 1234;

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('WebSocket server for Yjs collaboration\n');
});

const wss = new WebSocket.Server({ server });

console.log('WebSocket server initialized');

wss.on('connection', (conn, req) => {
  const docName = req.url.slice(1).split('?')[0];
  console.log(`✓ New connection for document: ${docName}`);

  setupWSConnection(conn, req, {
    docName: docName,
    gc: true // Enable garbage collection
  });
});

server.listen(PORT, () => {
  console.log(`✓ WebSocket server running on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing WebSocket server');
  server.close(() => {
    console.log('WebSocket server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing WebSocket server');
  server.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});