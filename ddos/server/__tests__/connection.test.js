import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { io as Client } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

let io, serverSocket, clientSocket, httpServer, httpServerAddr;

beforeAll((done) => {
  httpServer = createServer();
  io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on('connection', (socket) => {
    serverSocket = socket;
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

describe('🔌 Tests de Connexion Socket.IO', () => {
  test('Le client doit se connecter au serveur', () => {
    expect(clientSocket.connected).toBe(true);
  });

  test('Le client doit recevoir un socket.id unique', () => {
    expect(clientSocket.id).toBeDefined();
    expect(typeof clientSocket.id).toBe('string');
    expect(clientSocket.id.length).toBeGreaterThan(0);
  });

  test('Le serveur doit détecter la connexion du client', () => {
    expect(serverSocket).toBeDefined();
    expect(serverSocket.id).toBe(clientSocket.id);
  });

  test('Le serveur doit détecter la déconnexion', (done) => {
    serverSocket.on('disconnect', () => {
      done();
    });
    
    clientSocket.disconnect();
  });

  test('Plusieurs clients peuvent se connecter simultanément', (done) => {
    const client2 = Client(`http://localhost:${httpServerAddr.port}`);
    
    client2.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      expect(client2.connected).toBe(true);
      expect(clientSocket.id).not.toBe(client2.id);
      
      client2.disconnect();
      done();
    });
  });

  test('Reconnexion après déconnexion', (done) => {
    const oldId = clientSocket.id;
    
    clientSocket.disconnect();
    
    setTimeout(() => {
      clientSocket.connect();
      
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        expect(clientSocket.id).not.toBe(oldId); // Nouvel ID
        done();
      });
    }, 100);
  });
});

describe('📊 Tests de Métriques de Connexion', () => {
  test('Le temps de connexion doit être rapide', (done) => {
    const startTime = Date.now();
    const newClient = Client(`http://localhost:${httpServerAddr.port}`);
    
    newClient.on('connect', () => {
      const connectionTime = Date.now() - startTime;
      expect(connectionTime).toBeLessThan(100); // < 100ms
      
      newClient.disconnect();
      done();
    });
  });

  test('Le nombre de clients connectés doit être correct', () => {
    expect(io.engine.clientsCount).toBeGreaterThan(0);
  });
});