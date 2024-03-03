// import { serve } from "@hono/node-server";
// import { Hono } from "hono";
// import { WebSocketServer, WebSocket } from "ws";
// const app = new Hono();

// function onSocketPreError(err: Error) {
//   console.error(err);
// }
// function onSocketPostError(err: Error) {
//   console.error(err);
// }

// const server = serve(app, (info) => {
//   console.log(`Listening on http://localhost:${info.port}`);
// });

// const wss = new WebSocketServer({ noServer: true });

// server.on("upgrade", (req, socket, head) => {
//   socket.on("error", onSocketPreError);

//   //perform auth
//   if (!!req.headers["BadAuth"]) {
//     socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
//     socket.destroy();
//     return;
//   }

//   wss.handleUpgrade(req, socket, head, (ws) => {
//     socket.removeListener("error", onSocketPreError);
//     wss.emit("connection", ws, req);
//   });
// });
// wss.on("connection", (ws, req) => {
//   ws.on("error", onSocketPostError);

//   ws.on("message", (msg, isBinary) => {
//     wss.clients.forEach((client) => {
//       // ws !== client
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(msg, { binary: isBinary });
//       }
//     });
//   });

//   ws.on("close", () => {
//     console.log("Connection closed");
//   });
// });
