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
      try {
        const oldAttack = activeAttacks.get(socket.id);
        if (oldAttack) {
          clearInterval(oldAttack.interval);
          clearTimeout(oldAttack.timeout);
        }

        const interval = setInterval(() => {
          socket.emit('stats', {
            pps: Math.floor(Math.random() * 10000),
            bots: Math.floor(Math.random() * 100),
            totalPackets: 0,
            log: data && data.target ? `Sending packets to ${data.target}` : 'Sending packets...'
          });
        }, 100);

        const duration = data && data.duration ? data.duration : 1;
        const timeout = setTimeout(() => {
          clearInterval(interval);
          activeAttacks.delete(socket.id);
          socket.emit('attackEnd');
        }, duration * 1000);

        activeAttacks.set(socket.id, { interval, timeout });
      } catch (error) {
        console.error('Error in startAttack:', error);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('stopAttack', () => {
      const attack = activeAttacks.get(socket.id);
      if (attack) {
        clearInterval(attack.interval);
        clearTimeout(attack.timeout);
        activeAttacks.delete(socket.id);
      }
      socket.emit('attackEnd');
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
  activeAttacks.clear();
});

describe('⚠️ Tests de Gestion d\'Erreurs - Données manquantes', () => {
  test('startAttack avec objet vide ne doit pas crasher', (done) => {
    clientSocket.emit('startAttack', {});
    
    // Le serveur ne doit pas crasher
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  }, 2000);

  test('startAttack sans target', (done) => {
    const attackData = {
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('stats', (data) => {
      expect(data.log).toBeDefined();
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });

  test('startAttack sans port', (done) => {
    const attackData = {
      target: '192.168.1.1',
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('attackEnd', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 2000);

  test('startAttack sans duration (doit utiliser défaut)', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    const startTime = Date.now();

    clientSocket.on('attackEnd', () => {
      const elapsed = Date.now() - startTime;
      // Doit utiliser durée par défaut (1 seconde)
      expect(elapsed).toBeGreaterThanOrEqual(900);
      expect(elapsed).toBeLessThan(1500);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 3000);

  test('startAttack avec null', (done) => {
    clientSocket.emit('startAttack', null);
    
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });

  test('startAttack avec undefined', (done) => {
    clientSocket.emit('startAttack', undefined);
    
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });
});

describe('⚠️ Tests de Gestion d\'Erreurs - Données invalides', () => {
  test('startAttack avec duration négative', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: -5,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('attackEnd', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 2000);

  test('startAttack avec port invalide', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 999999,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('attackEnd', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 2000);

  test('startAttack avec target qui n\'est pas une string', (done) => {
    const attackData = {
      target: 12345,
      port: 80,
      duration: 1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('stats', (data) => {
      expect(data).toBeDefined();
      done();
    });

    clientSocket.emit('startAttack', attackData);
  });

  test('startAttack avec duration = 0', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 0,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.on('attackEnd', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.emit('startAttack', attackData);
  }, 2000);

  test('startAttack avec duration très grande', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 999999,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.emit('startAttack', attackData);
    
    // Arrêter immédiatement
    setTimeout(() => {
      clientSocket.emit('stopAttack');
    }, 100);

    clientSocket.on('attackEnd', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  }, 2000);
});

describe('⚠️ Tests de Gestion d\'Erreurs - Types incorrects', () => {
  test('startAttack avec une string au lieu d\'un objet', (done) => {
    clientSocket.emit('startAttack', 'invalid data');
    
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });

  test('startAttack avec un array', (done) => {
    clientSocket.emit('startAttack', ['192.168.1.1', 80, 1]);
    
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });

  test('startAttack avec un nombre', (done) => {
    clientSocket.emit('startAttack', 12345);
    
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });

  test('startAttack avec une fonction', (done) => {
    clientSocket.emit('startAttack', () => {});
    
    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });
});

describe('⚠️ Tests de Gestion d\'Erreurs - stopAttack', () => {
  test('stopAttack sans attaque active', (done) => {
    clientSocket.on('attackEnd', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.emit('stopAttack');
  });

  test('Multiples stopAttack rapides', (done) => {
    for (let i = 0; i < 10; i++) {
      clientSocket.emit('stopAttack');
    }

    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });

  test('stopAttack avec paramètres invalides', (done) => {
    clientSocket.emit('stopAttack', { invalid: 'data' });

    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });
});

describe('⚠️ Tests de Gestion d\'Erreurs - Événements inexistants', () => {
  test('Émettre un événement qui n\'existe pas', (done) => {
    clientSocket.emit('nonExistentEvent', { data: 'test' });

    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });

  test('Émettre plusieurs événements invalides', (done) => {
    clientSocket.emit('fakeEvent1', {});
    clientSocket.emit('fakeEvent2', {});
    clientSocket.emit('fakeEvent3', {});

    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 200);
  });
});

describe('⚠️ Tests de Gestion d\'Erreurs - Scénarios extrêmes', () => {
  test('Lancer 100 attaques simultanément', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 0.5,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    for (let i = 0; i < 100; i++) {
      clientSocket.emit('startAttack', attackData);
    }

    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      // Doit avoir seulement 1 attaque active (la dernière)
      expect(activeAttacks.size).toBe(1);
      done();
    }, 200);
  }, 3000);

  test('Alterner rapidement startAttack et stopAttack', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 10,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    for (let i = 0; i < 20; i++) {
      clientSocket.emit('startAttack', attackData);
      clientSocket.emit('stopAttack');
    }

    setTimeout(() => {
      expect(clientSocket.connected).toBe(true);
      expect(activeAttacks.size).toBe(0);
      done();
    }, 500);
  }, 2000);

  test('Déconnexion et reconnexion rapide', (done) => {
    clientSocket.disconnect();
    
    setTimeout(() => {
      clientSocket.connect();
      
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });
    }, 100);
  }, 2000);
});