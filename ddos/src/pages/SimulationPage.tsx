import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const SAFE_MIN_PACKET_BYTES = 1;
const SAFE_MAX_PACKET_BYTES = 256;
const SAFE_MIN_DURATION_SEC = 1;
const SAFE_MAX_DURATION_SEC = 10;

const STORAGE_KEY = "simulation_form_data";

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
  const host = window.location.hostname;
  const isLocal = isHostLocal(host);
  const socketURL = isLocal ? `http://localhost:3000` : "/";
  console.log("🌐 Socket URL configurée:", socketURL);
  return socketURL;
}

// Validation de l'IP
function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

const socket = io(getSocketURL(), {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on("connect", () => {
  console.log("✅ Socket.IO connecté - ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket.IO déconnecté - Raison:", reason);
});

function SimulationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isAttacking, setIsAttacking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Erreur chargement localStorage:", e);
    }
    return null;
  };

  const saved = loadFromStorage();

  const [target, setTarget] = useState(saved?.target || "");
  const [port, setPort] = useState<number>(saved?.port || 8080);
  const [attackMethod, setAttackMethod] = useState(saved?.attackMethod || "http_flood");
  const [packetSize, setPacketSize] = useState<number>(saved?.packetSize || SAFE_MAX_PACKET_BYTES);
  const [duration, setDuration] = useState<number>(saved?.duration || SAFE_MAX_DURATION_SEC);
  const [packetDelay, setPacketDelay] = useState<number>(saved?.packetDelay || 100);

  const [stats, setStats] = useState({
    pps: 0,
    bots: 0,
    totalPackets: 0,
  });

  const maxPpsRef = useRef<number>(0);
  const totalPacketsRef = useRef<number>(0);
  const attackStartTimeRef = useRef<number | null>(null);
  const simulationIdRef = useRef<number | null>(null);
  const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // REF pour stocker les logs complets (persist seulement en mémoire pendant l'exécution)
  const consoleLogsRef = useRef<string[]>([]);
  const lastInsertSnapshotRef = useRef<any>(null);

  // Sauvegarder dans localStorage
  useEffect(() => {
    const data = { target, port, attackMethod, packetSize, duration, packetDelay };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [target, port, attackMethod, packetSize, duration, packetDelay]);

  const redirectToDefense = () => {
    const methodToRoute: Record<string, string> = {
      http_flood: "/defense/http-flood",
      http_bypass: "/defense/http-bypass",
      http_slowloris: "/defense/http-slowloris",
      tcp_flood: "/defense/tcp-flood",
      minecraft_ping: "/defense/minecraft-ping",
    };
    const route = methodToRoute[attackMethod];
    if (route) {
      setTimeout(() => navigate(route), 1200);
    }
  };

  const cleanupAttackState = () => {
    if (attackTimerRef.current) {
      clearTimeout(attackTimerRef.current);
      attackTimerRef.current = null;
    }
    maxPpsRef.current = 0;
    totalPacketsRef.current = 0;
    attackStartTimeRef.current = null;
    simulationIdRef.current = null;
    consoleLogsRef.current = [];
    lastInsertSnapshotRef.current = null;
  };

  useEffect(() => {
    socket.on("stats", (data: any) => {
      console.log("📊 Stats reçues:", data);

      setStats((old) => {
        const newStats = {
          pps: data.pps ?? old.pps,
          bots: data.bots ?? old.bots,
          totalPackets: data.totalPackets ?? old.totalPackets,
        };

        if (newStats.pps > maxPpsRef.current) {
          maxPpsRef.current = newStats.pps;
        }
        totalPacketsRef.current = newStats.totalPackets;

        return newStats;
      });

      if (data.log) addLog(data.log);
    });

    socket.on("attackEnd", async () => {
      console.log("🛑 Attaque terminée");
      setIsAttacking(false);
      addLog("✓ Attaque terminée");

      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = null;
      }

      // ✅ MISE À JOUR STATS FINALES
      if (simulationIdRef.current && attackStartTimeRef.current) {
        const durationActual = Math.floor((Date.now() - attackStartTimeRef.current) / 1000);
        const consoleBlob = consoleLogsRef.current.slice().reverse().join("\n");

        console.log("📊 Mise à jour stats:", {
          id: simulationIdRef.current,
          max_pps: maxPpsRef.current,
          total_packets: totalPacketsRef.current,
          duration_actual: durationActual
        });

        try {
          const { error } = await supabase
            .from("simulations")
            .update({
              duration_actual: durationActual,
              max_pps: maxPpsRef.current,
              total_packets_sent: totalPacketsRef.current,
              status: "success",
              console: consoleBlob,
            })
            .eq("id", simulationIdRef.current);

          if (error) {
            console.error("❌ Erreur update:", error);
            addLog("❌ Erreur: " + error.message);
          } else {
            console.log("✅ Stats + console sauvegardées");
            addLog("💾 Stats sauvegardées");
          }
        } catch (e: any) {
          console.error("❌ Exception:", e);
          addLog("❌ Exception: " + e.message);
        }
      }

      redirectToDefense();
      cleanupAttackState();
    });

    // ✅ NOUVEAU: Gestion des erreurs d'attaque
    socket.on("attackError", async (data: any) => {
      console.error("❌ Erreur attaque:", data);
      setIsAttacking(false);
      
      const errorMessage = data.message || data.error || "Échec de l'attaque";
      addLog("❌ Erreur: " + errorMessage);

      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = null;
      }

      // Mise à jour DB avec statut failed
      if (simulationIdRef.current && attackStartTimeRef.current) {
        const durationActual = Math.floor((Date.now() - attackStartTimeRef.current) / 1000);
        const consoleBlob = consoleLogsRef.current.slice().reverse().join("\n");

        try {
          const { error } = await supabase
            .from("simulations")
            .update({
              duration_actual: durationActual,
              max_pps: maxPpsRef.current,
              total_packets_sent: totalPacketsRef.current,
              status: "failed",
              console: consoleBlob,
            })
            .eq("id", simulationIdRef.current);

          if (error) {
            console.error("❌ Erreur update failed:", error);
          } else {
            console.log("✅ Statut 'failed' sauvegardé");
            addLog("💾 Erreur enregistrée");
          }
        } catch (e: any) {
          console.error("❌ Exception:", e);
        }
      }

      cleanupAttackState();
    });

    return () => {
      socket.off("stats");
      socket.off("attackEnd");
      socket.off("attackError");
    };
  }, [attackMethod, navigate]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const line = `[${timestamp}] ${message}`;
    consoleLogsRef.current = [line, ...consoleLogsRef.current].slice(0, 200); // conserver jusqu'à 200 lignes en mémoire
    setLogs((prev) => [line, ...prev].slice(0, 20));
  };

  const startAttack = async () => {
    // Validations
    if (!target.trim()) {
      alert("Veuillez entrer une cible !");
      return;
    }

    // ✅ NOUVELLE VALIDATION: Format IP valide
    if (!isValidIP(target.trim())) {
      alert("Format d'adresse IP invalide (ex: 192.168.1.100)");
      return;
    }

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      alert("Port invalide (1-65535)");
      return;
    }
    if (packetSize < SAFE_MIN_PACKET_BYTES || packetSize > SAFE_MAX_PACKET_BYTES) {
      alert(`Taille invalide (${SAFE_MIN_PACKET_BYTES}-${SAFE_MAX_PACKET_BYTES} octets)`);
      return;
    }
    if (duration < SAFE_MIN_DURATION_SEC || duration > SAFE_MAX_DURATION_SEC) {
      alert(`Durée invalide (${SAFE_MIN_DURATION_SEC}-${SAFE_MAX_DURATION_SEC}s)`);
      return;
    }

    if (!socket.connected) {
      addLog("❌ Socket non connecté");
      socket.connect();
      return;
    }

    setIsAttacking(true);
    setStats({ pps: 0, bots: 0, totalPackets: 0 });
    setLogs([]);
    maxPpsRef.current = 0;
    totalPacketsRef.current = 0;
    attackStartTimeRef.current = Date.now();

    addLog("⚡ Initialisation de l'attaque...");

    const attackData = {
      target,
      port,
      packetSize,
      duration,
      packetDelay,
      attackMethod,
    };

    // ✅ SAUVEGARDE DANS SUPABASE
    try {
      console.log("🔐 Récupération user...");
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();

      if (authErr) {
        console.error("❌ Erreur auth:", authErr);
        addLog("❌ Erreur authentification");
        return;
      }

      if (!authUser) {
        console.error("❌ Pas d'utilisateur");
        addLog("❌ Connexion requise");
        navigate("/account");
        return;
      }

      console.log("👤 User ID:", authUser.id);

      const insertData = {
        user_id: authUser.id,
        method: attackMethod,
        ip: target,
        port: port,
        packet_size: packetSize,
        duration_planned: duration,
        summary: `${attackMethod} vers ${target}:${port} (${duration}s, ${packetSize} octets)`,
        status: "running",
        console: "Initialisation de l'attaque...\n",
      };

      console.log("💾 Insertion données:", insertData);

      const { data, error } = await supabase
        .from("simulations")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("❌ Erreur insertion:", error);
        addLog("❌ Erreur DB: " + error.message);
      } else if (data) {
        simulationIdRef.current = data.id;
        lastInsertSnapshotRef.current = data;
        console.log("✅ Simulation #" + data.id + " créée");
        addLog("💾 Enregistré dans l'historique (ID: " + data.id + ")");
      }
    } catch (e: any) {
      console.error("❌ Exception:", e);
      addLog("❌ Exception: " + e.message);
    }

    // Timer sécurité
    attackTimerRef.current = setTimeout(() => {
      console.log("⏰ Timer local");
      setIsAttacking(false);
      addLog("⏰ Attaque terminée (timer local)");
      redirectToDefense();
    }, (duration + 2) * 1000);

    // Envoyer au serveur
    socket.timeout(5000).emit("startAttack", attackData, (err: any, response: any) => {
      if (err) {
        console.error("❌ Timeout");
        addLog("❌ Pas de réponse serveur (timeout)");
        setIsAttacking(false);
        
        if (attackTimerRef.current) {
          clearTimeout(attackTimerRef.current);
          attackTimerRef.current = null;
        }

        // Marquer comme failed dans la DB
        if (simulationIdRef.current) {
          supabase
            .from("simulations")
            .update({
              status: "failed",
              console: consoleLogsRef.current.slice().reverse().join("\n"),
            })
            .eq("id", simulationIdRef.current);
        }
      } else {
        console.log("✅ Serveur OK:", response);
        addLog("✅ Commande envoyée");
      }
    });
  };

  const stopAttack = async () => {
    if (attackTimerRef.current) {
      clearTimeout(attackTimerRef.current);
      attackTimerRef.current = null;
    }
    socket.timeout(5000).emit("stopAttack");
    setIsAttacking(false);
    addLog("⏹ Attaque arrêtée");

    // Mise à jour DB : canceled + console
    if (simulationIdRef.current && attackStartTimeRef.current) {
      const durationActual = Math.floor((Date.now() - attackStartTimeRef.current) / 1000);
      const consoleBlob = consoleLogsRef.current.slice().reverse().join("\n");

      try {
        const { error } = await supabase
          .from("simulations")
          .update({
            duration_actual: durationActual,
            max_pps: maxPpsRef.current,
            total_packets_sent: totalPacketsRef.current,
            status: "canceled",
            console: consoleBlob,
          })
          .eq("id", simulationIdRef.current);

        if (error) {
          console.error("❌ Erreur update stop:", error);
          addLog("❌ Erreur update: " + error.message);
        } else {
          addLog("💾 Sauvegarde stop OK");
        }
      } catch (e: any) {
        console.error("❌ Exception:", e);
        addLog("❌ Exception: " + e.message);
      }
    }

    cleanupAttackState();
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tests de sécurité
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configuration du test</h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Adresse IP
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  disabled={isAttacking}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  disabled={isAttacking}
                  min={1}
                  max={65535}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Méthode de test
                </label>
                <select
                  value={attackMethod}
                  onChange={(e) => setAttackMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  disabled={isAttacking}
                >
                  <option value="">Sélectionner</option>
                  <option value="http_flood">HTTP Flood</option>
                  <option value="http_bypass">HTTP Bypass</option>
                  <option value="http_slowloris">HTTP Slowloris</option>
                  <option value="tcp_flood">TCP Flood</option>
                  <option value="minecraft_ping">Minecraft Ping</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Taille des paquets (octets)
                </label>
                <input
                  type="number"
                  value={packetSize}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    const clamped = Math.max(SAFE_MIN_PACKET_BYTES, Math.min(SAFE_MAX_PACKET_BYTES, n));
                    setPacketSize(clamped);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  disabled={isAttacking}
                  min={SAFE_MIN_PACKET_BYTES}
                  max={SAFE_MAX_PACKET_BYTES}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Limité à {SAFE_MAX_PACKET_BYTES} octets
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Durée (secondes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    const clamped = Math.max(SAFE_MIN_DURATION_SEC, Math.min(SAFE_MAX_DURATION_SEC, n));
                    setDuration(clamped);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  disabled={isAttacking}
                  min={SAFE_MIN_DURATION_SEC}
                  max={SAFE_MAX_DURATION_SEC}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Limité à {SAFE_MAX_DURATION_SEC} secondes
                </p>
              </div>

              <button
                onClick={() => (isAttacking ? stopAttack() : startAttack())}
                className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-colors ${
                  isAttacking
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAttacking ? "Arrêter l'attaque" : "Lancer l'attaque"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Console de résultats</h2>

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

            <div className="bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto">
              <div className="font-mono text-sm space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400">
                    {">"} {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-gray-500 italic">
                    {">"} En attente...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
