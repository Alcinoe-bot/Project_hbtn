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
          log: `Sending packets to ${data.target}`
        });
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        activeAttacks.delete(socket.id);
        socket.emit('attackEnd');
      }, data.duration * 1000);

      activeAttacks.set(socket.id, { interval, timeout });
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
  // S'assurer que la Map est vide
  activeAttacks.clear();
});

describe('💾 Tests de Gestion Mémoire - Attaques successives', () => {
  test('Deux attaques successives ne doivent pas créer de fuite', (done) => {
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
        
        // Vérifier que la Map est nettoyée
        expect(activeAttacks.has(serverSocket.id)).toBe(false);
        
        // Lancer une deuxième attaque
        clientSocket.emit('startAttack', attackData);
      } else {
        // Deuxième attaque terminée
        expect(activeAttacks.has(serverSocket.id)).toBe(false);
        done();
      }
    });

    // Première attaque
    clientSocket.emit('startAttack', attackData);
  }, 5000);

  test('10 attaques successives ne doivent pas augmenter la Map', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 0.5,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    let attackCount = 0;
    const totalAttacks = 10;

    clientSocket.on('attackEnd', () => {
      attackCount++;
      
      // Vérifier que la Map est toujours nettoyée
      expect(activeAttacks.size).toBeLessThanOrEqual(1);
      
      if (attackCount < totalAttacks) {
        clientSocket.emit('startAttack', attackData);
      } else {
        expect(activeAttacks.size).toBe(0);
        done();
      }
    });

    clientSocket.emit('startAttack', attackData);
  }, 10000);
});

describe('💾 Tests de Gestion Mémoire - Déconnexion', () => {
  test('Déconnexion doit nettoyer les ressources', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 10, // Longue durée
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    clientSocket.emit('startAttack', attackData);

    // Vérifier que l'attaque est dans la Map
    setTimeout(() => {
      expect(activeAttacks.has(serverSocket.id)).toBe(true);
      
      // Déconnecter le client
      const oldSocketId = serverSocket.id;
      clientSocket.disconnect();
      
      // Vérifier que la Map est nettoyée après déconnexion
      setTimeout(() => {
        expect(activeAttacks.has(oldSocketId)).toBe(false);
        done();
      }, 100);
    }, 200);
  }, 3000);

  test('Déconnexion pendant une attaque ne doit pas laisser d\'interval actif', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 10,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    const initialMapSize = activeAttacks.size;
    
    clientSocket.emit('startAttack', attackData);

    setTimeout(() => {
      const socketId = serverSocket.id;
      
      // Déconnecter
      clientSocket.disconnect();
      
      setTimeout(() => {
        // Vérifier que la Map n'a pas grandi
        expect(activeAttacks.size).toBe(initialMapSize);
        expect(activeAttacks.has(socketId)).toBe(false);
        done();
      }, 100);
    }, 200);
  }, 2000);
});

describe('💾 Tests de Gestion Mémoire - Multiples clients', () => {
  test('Plusieurs clients ne doivent pas interférer dans la Map', (done) => {
    const client2 = Client(`http://localhost:${httpServerAddr.port}`);
    const client3 = Client(`http://localhost:${httpServerAddr.port}`);

    let connectCount = 0;
    const checkConnect = () => {
      connectCount++;
      if (connectCount === 2) {
        runTest();
      }
    };

    client2.on('connect', checkConnect);
    client3.on('connect', checkConnect);

    const runTest = () => {
      const attackData = {
        target: '192.168.1.1',
        port: 80,
        duration: 1,
        packetSize: 64,
        attackMethod: 'http_flood'
      };

      // Les 3 clients lancent une attaque
      clientSocket.emit('startAttack', attackData);
      client2.emit('startAttack', attackData);
      client3.emit('startAttack', attackData);

      setTimeout(() => {
        // La Map doit contenir 3 entrées
        expect(activeAttacks.size).toBe(3);
        
        // Arrêter toutes les attaques
        clientSocket.emit('stopAttack');
        client2.emit('stopAttack');
        client3.emit('stopAttack');

        setTimeout(() => {
          // La Map doit être vide
          expect(activeAttacks.size).toBe(0);
          
          client2.disconnect();
          client3.disconnect();
          done();
        }, 200);
      }, 300);
    };
  }, 5000);

  test('Déconnexion d\'un client ne doit pas affecter les autres', (done) => {
    const client2 = Client(`http://localhost:${httpServerAddr.port}`);

    client2.on('connect', () => {
      const attackData = {
        target: '192.168.1.1',
        port: 80,
        duration: 5,
        packetSize: 64,
        attackMethod: 'http_flood'
      };

      // Les deux clients lancent une attaque
      clientSocket.emit('startAttack', attackData);
      client2.emit('startAttack', attackData);

      setTimeout(() => {
        expect(activeAttacks.size).toBe(2);
        
        // Déconnecter client1
        clientSocket.disconnect();

        setTimeout(() => {
          // La Map doit contenir 1 entrée (client2)
          expect(activeAttacks.size).toBe(1);
          
          // Client2 doit toujours recevoir des stats
          let receivedStats = false;
          client2.on('stats', () => {
            receivedStats = true;
          });

          setTimeout(() => {
            expect(receivedStats).toBe(true);
            client2.disconnect();
            done();
          }, 300);
        }, 200);
      }, 200);
    });
  }, 5000);
});

describe('💾 Tests de Gestion Mémoire - Stress test', () => {
  test('100 attaques rapides successives', (done) => {
    const attackData = {
      target: '192.168.1.1',
      port: 80,
      duration: 0.1,
      packetSize: 64,
      attackMethod: 'http_flood'
    };

    let count = 0;
    const maxCount = 100;

    clientSocket.on('attackEnd', () => {
      count++;
      
      if (count < maxCount) {
        clientSocket.emit('startAttack', attackData);
      } else {
        // Vérifier que la Map est vide à la fin
        setTimeout(() => {
          expect(activeAttacks.size).toBe(0);
          done();
        }, 200);
      }
    });

    clientSocket.emit('startAttack', attackData);
  }, 30000);

  test('Attaques simultanées puis arrêt', (done) => {
    const clients = [];
    const numClients = 5;
    let connectedCount = 0;

    for (let i = 0; i < numClients; i++) {
      const client = Client(`http://localhost:${httpServerAddr.port}`);
      clients.push(client);
      
      client.on('connect', () => {
        connectedCount++;
        if (connectedCount === numClients) {
          runTest();
        }
      });
    }

    const runTest = () => {
      const attackData = {
        target: '192.168.1.1',
        port: 80,
        duration: 5,
        packetSize: 64,
        attackMethod: 'http_flood'
      };

      // Tous les clients lancent une attaque
      clients.forEach(client => {
        client.emit('startAttack', attackData);
      });

      setTimeout(() => {
        expect(activeAttacks.size).toBe(numClients);
        
        // Tous les clients arrêtent
        clients.forEach(client => {
          client.emit('stopAttack');
        });

        setTimeout(() => {
          expect(activeAttacks.size).toBe(0);
          
          // Nettoyer
          clients.forEach(client => client.disconnect());
          done();
        }, 300);
      }, 500);
    };
  }, 10000);
});