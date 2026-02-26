const http = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const wsPathPrefix = "/ws";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function getRequestUrl(req) {
  return new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
}

function getDocName(requestUrl) {
  if (!requestUrl.pathname.startsWith(`${wsPathPrefix}/`)) {
    return "";
  }
  return decodeURIComponent(requestUrl.pathname.slice(wsPathPrefix.length + 1));
}

app
  .prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      if (req.url === "/healthz") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("ok");
        return;
      }

      const parsedUrl = parse(req.url || "/", true);
      handle(req, res, parsedUrl);
    });

    const wss = new WebSocket.Server({ noServer: true });

    server.on("upgrade", (req, socket, head) => {
      const requestUrl = getRequestUrl(req);
      if (!requestUrl.pathname.startsWith(`${wsPathPrefix}/`)) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (conn) => {
        wss.emit("connection", conn, req);
      });
    });

    wss.on("connection", (conn, req) => {
      const requestUrl = getRequestUrl(req);
      const docName = getDocName(requestUrl);

      if (!docName) {
        conn.close(1008, "Invalid document id");
        return;
      }

      console.log(`✓ WebSocket connection for document: ${docName}`);
      setupWSConnection(conn, req, {
        docName,
        gc: true,
      });
    });

    server.listen(port, hostname, () => {
      console.log(
        `✓ Combined server running at http://${hostname}:${port} (WebSocket path: ${wsPathPrefix})`
      );
    });

    const shutdown = (signal) => {
      console.log(`${signal} received: closing combined server`);
      for (const client of wss.clients) {
        client.close();
      }
      server.close(() => {
        console.log("Combined server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((error) => {
    console.error("Failed to start combined server:", error);
    process.exit(1);
  });
