import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Configuration endpoint
app.get('/configuration', (req, res) => {
  // Retourne la config encodée en base64
  res.json({
    proxies: btoa(""), // Vide par défaut
    uas: btoa("")
  });
});

app.post('/configuration', (req, res) => {
  console.log('Configuration saved:', req.body);
  res.json({ success: true });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('startAttack', (data) => {
    console.log('Attack started:', data);
    
    // Simuler des stats toutes les secondes
    const interval = setInterval(() => {
      socket.emit('stats', {
        pps: Math.floor(Math.random() * 10000),
        bots: Math.floor(Math.random() * 100),
        totalPackets: Math.floor(Math.random() * 1000000),
        log: `Sending packets to ${data.target}...`
      });
    }, 1000);

    // Arrêter après la durée spécifiée
    setTimeout(() => {
      clearInterval(interval);
      socket.emit('attackEnd');
    }, data.duration * 1000);
  });

  socket.on('stopAttack', () => {
    console.log('Attack stopped by user');
    socket.emit('attackEnd');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
