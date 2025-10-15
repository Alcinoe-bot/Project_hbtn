import { useEffect, useState } from "react";
import { io } from "socket.io-client";

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
  const host = window.location.host.split(":")[0];
  const isLocal = isHostLocal(host);
  const socketURL = isLocal ? `http://${host}:3000` : "/";
  return socketURL;
}

const socket = io(getSocketURL());

interface ConfigProps {
  onClose: () => void;
}

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

function SimulationPage() {
  const [isAttacking, setIsAttacking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [attackMethod, setAttackMethod] = useState("http_flood");
  const [packetSize, setPacketSize] = useState(64);
  const [duration, setDuration] = useState(60);
  const [packetDelay, setPacketDelay] = useState(100);
  const [stats, setStats] = useState({
    pps: 0,
    bots: 0,
    totalPackets: 0,
  });
  const [openedConfig, setOpenedConfig] = useState(false);

  useEffect(() => {
    socket.on("stats", (data) => {
      setStats((old) => ({
        pps: data.pps || old.pps,
        bots: data.bots || old.bots,
        totalPackets: data.totalPackets || old.totalPackets,
      }));
      if (data.log) addLog(data.log);
    });

    socket.on("attackEnd", () => {
      setIsAttacking(false);
      addLog("✓ Simulation terminée");
    });

    return () => {
      socket.off("stats");
      socket.off("attackEnd");
    };
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 20));
  };

  const startAttack = () => {
    if (!target.trim()) {
      alert("Veuillez entrer une cible !");
      return;
    }

    setIsAttacking(true);
    setStats({ pps: 0, bots: 0, totalPackets: 0 });
    setLogs([]);
    addLog("⚡ Initialisation de la simulation...");

    socket.emit("startAttack", {
      target,
      packetSize,
      duration,
      packetDelay,
      attackMethod,
    });
  };

  const stopAttack = () => {
    socket.emit("stopAttack");
    setIsAttacking(false);
    addLog("⏹ Simulation arrêtée");
  };

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
                  value={8080}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
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
                <input
                  type="number"
                  value={packetSize}
                  onChange={(e) => setPacketSize(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                  min="1"
                  max="1500"
                />
              </div>

              {/* Durée */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Durée (secondes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isAttacking}
                  min="1"
                  max="300"
                />
              </div>

              {/* Bouton Lancer */}
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

              {/* Bouton Config */}
              <button
                onClick={() => setOpenedConfig(true)}
                className="w-full py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Configuration avancée
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

      {openedConfig && (
        <ConfigureProxiesAndAgentsView onClose={() => setOpenedConfig(false)} />
      )}
    </div>
  );
}

export default SimulationPage;
