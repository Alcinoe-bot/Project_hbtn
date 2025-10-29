import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { io as Client } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

let io, serverSocket, clientSocket, httpServer, httpServerAddr;
const activeAttacks = new Map();

beforeAll((done) => {
  httpServer = createServer();
  io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on('connection', (socket) => {
    serverSocket = socket;

    socket.on('startAttack', (data) => {
      // Nettoyer l'attaque précédente
      const oldAttack = activeAttacks.get(socket.id);
      if (oldAttack) {
        clearInterval(oldAttack.interval);
        clearTimeout(oldAttack.timeout);
      }

      // Simuler des stats
      let count = 0;
      const interval = setInterval(() => {
        socket.emit('stats', {
          pps: Math.floor(Math.random() * 10000),
          bots: Math.floor(Math.random() * 100),
          totalPackets: count * 1000,
          log: `Sending packets to ${data.target}`
        });
        count++;
      }, 100);

      // Arrêter après la durée
      const timeout = setTimeout(() => {
        clearInterval(interval);
        activeAttacks.delete(socket.id);
        socket.emit('attackEnd');
      }, data.duration * 1000);

      activeAttacks.set(socket.id, { interval, timeout });
    });

    socket.on('disconnect', () => {
      const attack = activeAttacks.get(socket.id);
      if (attack) {
        clearInterval(attack.interval);
        clearTimeout(attack.timeout);
        activeAttacks.delete(socket.id);
      }
    });
  });

  httpServer.listen(() => {
    httpServerAddr = httpServer.address();
    done();
  });
});

afterAll(() => {
  io.close();
  httpServer.close();
});

beforeEach((done) => {
  clientSocket = Client(`http://localhost:${httpServerAddr.port}`);
  clientSocket.on('connect', done);
});

afterEach(() => {
  if (clientSocket.connected) {
    clientSocket.disconnect();
  }
});

describe('🚀 Tests de startAttack - Réception', () => {
  test('Le serveur doit recevoir l\'événement startAttack', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    serverSocket.on('startAttack', (data) => {
      expect(data).toEqual(attackData);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });

  test('startAttack avec toutes les propriétés requises', (done) => {
    const attackData = {
      target: '10.0.0.1',
      port: 8080,
      duration: 2,
      packetSize: 128,
      attackMethod: 'tcp_flood',
      packetDelay: 100
    };

    serverSocket.on('startAttack', (data) => {
      expect(data.target).toBe('10.0.0.1');
      expect(data.port).toBe(8080);
      expect(data.duration).toBe(2);
      expect(data.packetSize).toBe(128);
      expect(data.attackMethod).toBe('tcp_flood');
      expect(data.packetDelay).toBe(100);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });
});

describe('📊 Tests de startAttack - Stats', () => {
  test('Le client doit recevoir des stats après startAttack', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('stats', (data) => {
      expect(data).toHaveProperty('pps');
      expect(data).toHaveProperty('bots');
      expect(data).toHaveProperty('totalPackets');
      expect(data).toHaveProperty('log');
      expect(typeof data.pps).toBe('number');
      expect(typeof data.bots).toBe('number');
      expect(typeof data.totalPackets).toBe('number');
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });

  test('Les stats doivent contenir la cible correcte', (done) => {
    const attackData = {
      target: '172.16.0.1',
      port: 443,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('stats', (data) => {
      expect(data.log).toContain('172.16.0.1');
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });

  test('Les valeurs des stats doivent être positives', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('stats', (data) => {
      expect(data.pps).toBeGreaterThanOrEqual(0);
      expect(data.bots).toBeGreaterThanOrEqual(0);
      expect(data.totalPackets).toBeGreaterThanOrEqual(0);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });

  test('Le client doit recevoir plusieurs stats pendant la durée', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    let statsCount = 0;

    clientSocket.on('stats', () => {
      statsCount++;
    });

    clientSocket.on('attackEnd', () => {
      expect(statsCount).toBeGreaterThan(5); // Au moins 5 stats en 1 seconde
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 2000);
});

describe('⏰ Tests de startAttack - Fin automatique', () => {
  test('attackEnd doit être émis après la durée spécifiée', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    const startTime = Date.now();

    clientSocket.on('attackEnd', () => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(900); // Au moins 900ms
      expect(elapsed).toBeLessThan(1200); // Moins de 1200ms
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 2000);

  test('attackEnd doit arrêter l\'émission des stats', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    let statsAfterEnd = false;

    clientSocket.on('attackEnd', () => {
      // Attendre 200ms après attackEnd
      setTimeout(() => {
        expect(statsAfterEnd).toBe(false);
        done();
      }, 200);
    });

    clientSocket.on('stats', () => {
      if (statsAfterEnd) {
        done.fail('Stats reçues après attackEnd');
      }
    });

    clientSocket.emit('startAttack', attackData);

    // Marquer qu'on est après attackEnd
    setTimeout(() => {
      statsAfterEnd = true;
    }, 1100);
  }, 2500);
});

describe('🔄 Tests de startAttack - Attaques multiples', () => {
  test('Deux attaques successives doivent fonctionner', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    let firstAttackEnded = false;

    clientSocket.on('attackEnd', () => {
      if (!firstAttackEnded) {
        firstAttackEnded = true;
        // Lancer une deuxième attaque
        clientSocket.emit('startAttack', attackData);
      } else {
        // Deuxième attaque terminée
        done();
      }
    });

    // Première attaque
    clientSocket.emit('startAttack', attackData);
  }, 5000);

  test('Une nouvelle attaque doit annuler la précédente', (done) => {
    const attack1 = {
      target: '192.168.1.1',
      port: 80,
      duration: 10, // Longue durée
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    const attack2 = {
      target: '10.0.0.1',
      port: 443,
      duration: 1,
      packetSize: 128,
      attackMethod: 'tcp_flood'
    };

    let receivedTarget2 = false;

    clientSocket.on('stats', (data) => {
      if (data.log.includes('10.0.0.1')) {
        receivedTarget2 = true;
      }
    });

    clientSocket.on('attackEnd', () => {
      expect(receivedTarget2).toBe(true);
      done();
    });

    // Lancer attack1
    clientSocket.emit('startAttack', attack1);

    // Après 200ms, lancer attack2
    setTimeout(() => {
      clientSocket.emit('startAttack', attack2);
    }, 200);
  }, 3000);
});