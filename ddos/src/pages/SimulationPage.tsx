import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SAFE_MIN_PACKET_BYTES = 1;     // taille paquet mini (octets)
const SAFE_MAX_PACKET_BYTES = 256;   // [MODIF] taille paquet maxi (octets)
const SAFE_MIN_DURATION_SEC  = 1;    // durée mini (secondes)
const SAFE_MAX_DURATION_SEC  = 10;   // [MODIF] durée maxi (secondes)

//Utilitaires détection local / URL Socket.IO
function isHostLocal(host: string) {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("::1") ||
    host.startsWith("192.168") ||
    host.startsWith("10.") ||
    host.startsWith("172.")
  );
}

function getSocketURL() {
  const host = window.location.hostname; // Utilise hostname au lieu de host
  const isLocal = isHostLocal(host);
  const socketURL = isLocal ? `http://localhost:3000` : "/";
  console.log("🌐 Socket URL configurée:", socketURL);
  console.log("🔍 Host détecté:", host, "- Local:", isLocal);
  return socketURL;
}

//Client Socket.IO avec reconnexion
const socket = io(getSocketURL(), {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Logs connexion Socket.IO
socket.on("connect", () => {
  console.log("✅ Socket.IO connecté - ID:", socket.id);
  console.log("🔗 URL de connexion:", socket.io.uri);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket.IO déconnecté - Raison:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Erreur de connexion Socket.IO:", error.message);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log("🔄 Tentative de reconnexion #", attempt);
});

interface ConfigProps {
  onClose: () => void;
}

//Modale "Configuration" (proxies / user-agents) – optionnelle
function ConfigureProxiesAndAgentsView({ onClose }: ConfigProps) {
  const [loadingConfiguration, setLoadingConfiguration] = useState(false);
  const [configuration, setConfiguration] = useState<string[]>(["", ""]);

  async function retrieveConfiguration(): Promise<string[]> {
    try {
      const response = await fetch(`http://localhost:3000/configuration`);
      const information = (await response.json()) as {
        proxies: string;
        uas: string;
      };
      const proxies = atob(information.proxies);
      const uas = atob(information.uas);
      return [proxies, uas];
    } catch (error) {
      console.error("Error loading configuration:", error);
      return ["", ""];
    }
  }

  useEffect(() => {
    if (!loadingConfiguration) {
      setLoadingConfiguration(true);
      retrieveConfiguration().then((config) => {
        setLoadingConfiguration(false);
        setConfiguration(config);
      });
    }
  }, [loadingConfiguration]);

  function saveConfiguration() {
    const obj = {
      proxies: btoa(configuration[0]),
      uas: btoa(configuration[1]),
    };

    fetch(`http://localhost:3000/configuration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then(() => {
        alert("Configuration enregistrée avec succès");
        onClose();
      })
      .catch((error) => {
        console.error("Error saving configuration:", error);
        alert("Erreur lors de l'enregistrement");
      });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl p-8">
        {loadingConfiguration ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Chargement de la configuration...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Proxies (proxies.txt)
              </label>
              <textarea
                value={configuration[0]}
                onChange={(e) =>
                  setConfiguration([e.target.value, configuration[1]])
                }
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="socks5://0.0.0.0&#10;socks4://user:pass@0.0.0.0:12345"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                User Agents (uas.txt)
              </label>
              <textarea
                value={configuration[1]}
                onChange={(e) =>
                  setConfiguration([configuration[0], e.target.value])
                }
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Mozilla/5.0 (Linux; Android 10; K)..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveConfiguration}
                className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//Page Simulation – UI + logique Socket.IO
function SimulationPage() {
  const [isAttacking, setIsAttacking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [port, setPort] = useState(8080);
  const [attackMethod, setAttackMethod] = useState("http_flood");

  // [MODIF] valeurs par défaut déjà compatibles avec les limites
  const [packetSize, setPacketSize] = useState(SAFE_MAX_PACKET_BYTES);
  const [duration, setDuration] = useState(SAFE_MAX_DURATION_SEC);

  const [packetDelay, setPacketDelay] = useState(100);
  const [stats, setStats] = useState({
    pps: 0,
    bots: 0,
    totalPackets: 0,
  });

  // Timer de sécurité local : stop auto au-delà de la durée
  const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Écoute des événements “stats” et “attackEnd” émis par le serveur
  useEffect(() => {
    console.log("🎯 Configuration des listeners Socket.IO");

    socket.on("stats", (data) => {
      console.log("📊 Stats reçues du serveur:", data);
      setStats((old) => ({
        pps: data.pps || old.pps,
        bots: data.bots || old.bots,
        totalPackets: data.totalPackets || old.totalPackets,
      }));
      if (data.log) {
        console.log("📝 Log reçu:", data.log);
        addLog(data.log);
      }
    });

    socket.on("attackEnd", () => {
      console.log("🛑 Événement 'attackEnd' reçu du serveur");
      setIsAttacking(false);
      addLog("✓ Simulation terminée");
      
      // Nettoyer le timer si l'attaque se termine normalement
      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = null;
        console.log("⏱️ Timer de sécurité annulé");
      }
    });

    // Log tout événement reçu (debug)
    socket.onAny((eventName, ...args) => {
      console.log(`📨 Événement reçu: ${eventName}`, args);
    });

    // Cleanup listeners au démontage
    return () => {
      console.log("🧹 Nettoyage des listeners Socket.IO");
      socket.off("stats");
      socket.off("attackEnd");
      socket.offAny();
    };
  }, []);

  /* Ajout d'un message dans la console pédagogique */
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  //Lancer la simulation + [MODIF] validations fortes (taille paquet / durée) + clamp inputs
  const startAttack = () => {
    // validations simples
    if (!target.trim()) {
      alert("Veuillez entrer une cible !");
      return;
    }
    // Port valide
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      alert("Veuillez saisir un port valide (1–65535).");
      return;
    }
    // [MODIF] Taille paquet bornée côté front (sécurité pédagogique)
    if (packetSize < SAFE_MIN_PACKET_BYTES || packetSize > SAFE_MAX_PACKET_BYTES) {
      alert(`Taille des paquets invalide. Autorisé: ${SAFE_MIN_PACKET_BYTES}–${SAFE_MAX_PACKET_BYTES} octets.`);
      return;
    }
    // [MODIF] Durée bornée côté front
    if (duration < SAFE_MIN_DURATION_SEC || duration > SAFE_MAX_DURATION_SEC) {
      alert(`Durée invalide. Autorisé: ${SAFE_MIN_DURATION_SEC}–${SAFE_MAX_DURATION_SEC} secondes.`);
      return;
    }

    console.log("🚀 Démarrage de l'attaque");
    console.log("🔌 Socket connecté:", socket.connected);
    console.log("🆔 Socket ID:", socket.id);

    if (!socket.connected) {
      console.error("❌ Socket non connecté! Tentative de reconnexion...");
      addLog("❌ Erreur: Socket non connecté");
      socket.connect();
      return;
    }

    setIsAttacking(true);
    setStats({ pps: 0, bots: 0, totalPackets: 0 });
    setLogs([]);
    addLog("⚡ Initialisation de la simulation...");

    const attackData = {
      target,
      port,
      packetSize,
      duration,
      packetDelay,
      attackMethod,
    };

    console.log("📤 Envoi de 'startAttack' avec:", attackData);
    
    // Timer de sécurité côté client (durée + marge)
    attackTimerRef.current = setTimeout(() => {
      console.log("⏰ Timer de sécurité déclenché - Arrêt automatique après", duration, "secondes");
      setIsAttacking(false);
      addLog("⏰ Simulation terminée (timer local)");
      attackTimerRef.current = null;
    }, (duration + 2) * 1000); // +2 secondes de marge

    console.log("⏱️ Timer de sécurité configuré pour", duration + 2, "secondes");

    // Émission avec ack/timeout (meilleure UX)
    socket.timeout(5000).emit("startAttack", attackData, (err, response) => {
      if (err) {
        console.error("❌ Timeout lors de l'envoi de startAttack:", err);
        addLog("❌ Erreur: Pas de réponse du serveur");
      } else {
        console.log("✅ Accusé de réception du serveur:", response);
        addLog("✅ Commande envoyée au serveur");
      }
    });
  };

  /* Arrêt manuel */
  const stopAttack = () => {
    console.log("🛑 Arrêt manuel de l'attaque");
    
    // Nettoyer le timer local
    if (attackTimerRef.current) {
      clearTimeout(attackTimerRef.current);
      attackTimerRef.current = null;
      console.log("⏱️ Timer de sécurité annulé");
    }

    socket.timeout(5000).emit("stopAttack", (err, response) => {
      if (err) {
        console.error("❌ Timeout lors de l'envoi de stopAttack:", err);
      } else {
        console.log("✅ Confirmation d'arrêt:", response);
      }
    });
    
    setIsAttacking(false);
    addLog("⏹ Simulation arrêtée manuellement");
  };

  // Nettoyage du timer au démontage du composant
  useEffect(() => {
    return () => {
      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tests de sécurité
          </h1>
          <p className="text-gray-600">Simulateur pédagogique de tests réseau</p>
        </div>

        {/* Main Layout - 2 colonnes */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration du test */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configuration du test</h2>

            <div className="space-y-6">
              {/* Adresse IP */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Adresse IP
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                />
              </div>

              {/* Port */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                  min={1}
                  max={65535}
                  step={1}
                />
              </div>

              {/* Méthode de test */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Méthode de test
                </label>
                <select
                  value={attackMethod}
                  onChange={(e) => setAttackMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                >
                  <option value="">Sélectionner une méthode</option>
                  <option value="http_flood">HTTP Flood</option>
                  <option value="http_bypass">HTTP Bypass</option>
                  <option value="http_slowloris">HTTP Slowloris</option>
                  <option value="tcp_flood">TCP Flood</option>
                  <option value="minecraft_ping">Minecraft Ping</option>
                </select>
              </div>

              {/* Taille des paquets */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Taille des paquets (octets)
                </label>
                {/* [MODIF] clamp + bornes UI 1..256 */}
                <input
                  type="number"
                  value={packetSize}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    const clamped = Math.max(SAFE_MIN_PACKET_BYTES, Math.min(SAFE_MAX_PACKET_BYTES, n));
                    setPacketSize(clamped);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                  min={SAFE_MIN_PACKET_BYTES}
                  max={SAFE_MAX_PACKET_BYTES}
                  step={1}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Limité à {SAFE_MAX_PACKET_BYTES} octets (démo pédagogique).
                </p>
              </div>

              {/* Durée */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Durée (secondes)
                </label>
                {/* [MODIF] clamp + bornes UI 1..10 */}
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    const clamped = Math.max(SAFE_MIN_DURATION_SEC, Math.min(SAFE_MAX_DURATION_SEC, n));
                    setDuration(clamped);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                  min={SAFE_MIN_DURATION_SEC}
                  max={SAFE_MAX_DURATION_SEC}
                  step={1}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Limité à {SAFE_MAX_DURATION_SEC} secondes (démo pédagogique).
                </p>
              </div>

              {/* Bouton Lancer / Arrêter */}
              <button
                onClick={() => (isAttacking ? stopAttack() : startAttack())}
                className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-colors ${
                  isAttacking
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAttacking ? "Arrêter la simulation" : "Lancer la simulation"}
              </button>
            </div>
          </div>

          {/* Console de résultats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Console de résultats</h2>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.pps.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Paquets/sec</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.bots.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Bots actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.totalPackets.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total paquets</div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto">
              <div className="font-mono text-sm space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400">
                    {">"} {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-gray-500 italic">
                    {">"} En attente de simulation...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 text-center text-sm">
            ⚠️ Usage éducatif uniquement - Testez sur vos serveurs autorisés
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimulationPage;
