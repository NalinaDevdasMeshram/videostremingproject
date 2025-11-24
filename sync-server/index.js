const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

// If running under docker-compose with volume, this path will point to hls-output
const HLS_PLAYLIST = path.join("/var/www/hls/main/playlist.m3u8");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => res.send("Sync server running"));

io.on("connection", (socket) => {
  console.log("client connected", socket.id);
});

function getMediaSequence() {
  try {
    const data = fs.readFileSync(HLS_PLAYLIST, "utf8");
    const match = data.match(/EXT-X-MEDIA-SEQUENCE:(\d+)/);
    if (match) return parseInt(match[1], 10);
  } catch (e) {
    // ignore read errors
  }
  return null;
}

setInterval(() => {
  const payload = {
    serverTime: Date.now(),
    mediaSequence: getMediaSequence(),
  };
  io.emit("sync", payload);
}, 500);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Sync server listening on ${PORT}`));
