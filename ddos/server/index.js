import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// CORS global pour les routes REST
app.use(
  cors({
    origin: (origin, cb) => {
      // Autorise les appels sans origin (même host / tests)
      if (!origin) return cb(null, true);
      // En prod, on se base sur CORS_ORIGIN
      const ALLOWED_ORIGIN = process.env.CORS_ORIGIN;
      if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
        return cb(null, true);
      }
      // En dev, on autorise localhost / LAN:5173
      const devAllowed =
        /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|172\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+):5173$/.test(
          origin
        );
      if (devAllowed) return cb(null, true);

      return cb(new Error("CORS not allowed for origin: " + origin), false);
    },
    methods: ["GET", "POST"],
    credentials: false,
  })
);

app.use(express.json());

const httpServer = createServer(app);

// Même logique CORS côté Socket.IO
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN;

const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
        return cb(null, true);
      }

      const devAllowed =
        /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|172\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+):5173$/.test(
          origin
        );
      if (devAllowed) return cb(null, true);

      return cb(new Error("CORS not allowed for origin: " + origin), false);
    },
    methods: ["GET", "POST"],
    credentials: false,
  },
});

// util base64 côté Node
const b64 = (s = "") => Buffer.from(s, "utf8").toString("base64");

// Endpoint de configuration (REST)
app.get("/configuration", (req, res) => {
  res.json({
    proxies: b64(""), // Vide par défaut
    uas: b64(""),
  });
});

app.post("/configuration", (req, res) => {
  console.log("Configuration saved:", req.body);
  res.json({ success: true });
});

// stocker timers par socket pour bien nettoyer
const running = new Map(); // socket.id -> { intervalId, timeoutId }

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("startAttack", (data = {}, ack) => {
    console.log("Attack started:", data);

    // garde-fous pédagogiques côté serveur
    const SAFE_MAX_PACKET_BYTES = 256; // non utilisé ici mais gardé pour future extension
    const SAFE_MAX_DURATION_SEC = 10;

    let duration = Number(data.duration) || 5;
    if (duration < 1) duration = 1;
    if (duration > SAFE_MAX_DURATION_SEC) duration = SAFE_MAX_DURATION_SEC;

    // Simuler des stats toutes les secondes
    const intervalId = setInterval(() => {
      socket.emit("stats", {
        pps: Math.floor(Math.random() * 10000),
        bots: Math.floor(Math.random() * 100),
        totalPackets: Math.floor(Math.random() * 1000000),
        log: `Sending packets to ${data.target || "target"}...`,
      });
    }, 1000);

    // Arrêter après la durée spécifiée (bornée)
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      socket.emit("attackEnd");
      running.delete(socket.id);
    }, duration * 1000);

    // stocke pour pouvoir stopper plus tard
    running.set(socket.id, { intervalId, timeoutId });

    if (typeof ack === "function") ack({ ok: true });
  });

  socket.on("stopAttack", (ack) => {
    console.log("Attack stopped by user");
    const r = running.get(socket.id);
    if (r) {
      clearInterval(r.intervalId);
      clearTimeout(r.timeoutId);
      running.delete(socket.id);
    }
    socket.emit("attackEnd");
    if (typeof ack === "function") ack({ ok: true });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    const r = running.get(socket.id);
    if (r) {
      clearInterval(r.intervalId);
      clearTimeout(r.timeoutId);
      running.delete(socket.id);
    }
  });
});

// IMPORTANT : utiliser le port fourni par Railway / Render
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
