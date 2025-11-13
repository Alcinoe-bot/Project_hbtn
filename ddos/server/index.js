import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());                  // global CORS pour REST
app.use(express.json());

const httpServer = createServer(app);

// autoriser localhost ET IP LAN du front (dev)
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => {
      // Autorise localhost:5173 et n'importe quelle IP LAN:5173 en dev
      // (ex: http://192.168.x.x:5173). En prod: restreindre au domaine.
      if (!origin) return cb(null, true); // appels du même host / tests
      const allowed = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|172\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+):5173$/.test(origin);
      if (allowed) return cb(null, true);
      return cb(new Error('CORS not allowed for origin: ' + origin), false);
    },
    methods: ['GET', 'POST'],
    credentials: false
  }
});

// [CHANGES] util base64 côté Node (à la place de btoa)
const b64 = (s = '') => Buffer.from(s, 'utf8').toString('base64');

// Configuration endpoint (REST)
app.get('/configuration', (req, res) => {
  // [CHANGES] utilise Buffer, pas btoa
  res.json({
    proxies: b64(''), // Vide par défaut
    uas: b64('')
  });
});

app.post('/configuration', (req, res) => {
  console.log('Configuration saved:', req.body);
  res.json({ success: true });
});

// [CHANGES] stocker timers par socket pour bien nettoyer
const running = new Map(); // socket.id -> { intervalId, timeoutId }

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('startAttack', (data = {}, ack) => {
    console.log('Attack started:', data);

    // [CHANGES] garde-fous pédagogiques côté serveur
    const SAFE_MAX_PACKET_BYTES = 256;
    const SAFE_MAX_DURATION_SEC = 10;

    let duration = Number(data.duration) || 5;
    if (duration < 1) duration = 1;
    if (duration > SAFE_MAX_DURATION_SEC) duration = SAFE_MAX_DURATION_SEC;

    // Simuler des stats toutes les secondes
    const intervalId = setInterval(() => {
      socket.emit('stats', {
        pps: Math.floor(Math.random() * 10000),
        bots: Math.floor(Math.random() * 100),
        totalPackets: Math.floor(Math.random() * 1000000),
        log: `Sending packets to ${data.target || 'target'}...`
      });
    }, 1000);

    // Arrêter après la durée spécifiée (bornée)
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      socket.emit('attackEnd');
      running.delete(socket.id);
    }, duration * 1000);

    // stocke pour pouvoir stopper plus tard
    running.set(socket.id, { intervalId, timeoutId });

    if (typeof ack === 'function') ack({ ok: true });
  });

  socket.on('stopAttack', (ack) => {
    console.log('Attack stopped by user');
    const r = running.get(socket.id);
    if (r) {
      clearInterval(r.intervalId);
      clearTimeout(r.timeoutId);
      running.delete(socket.id);
    }
    socket.emit('attackEnd');
    if (typeof ack === 'function') ack({ ok: true });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const r = running.get(socket.id);
    if (r) {
      clearInterval(r.intervalId);
      clearTimeout(r.timeoutId);
      running.delete(socket.id);
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
