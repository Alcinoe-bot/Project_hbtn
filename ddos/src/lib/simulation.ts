import { supabase } from "./supabaseClient";

export type SimulationMethod = "DDOS" | "BRUTE_FORCE" | "SQL_INJECTION";

export type SimulationInput = {
  userId: string;       // UUID Supabase
  method: SimulationMethod;
  ip: string;
  port: number;
  packetSize: number;
  durationSec: number;
};

export type SimulationResult = {
  userId: string;
  method: SimulationMethod;
  ip: string;
  port: number;
  packetSize: number;
  durationSec: number;
  summary: string;
  console: string[];
};

export function runLocalSimulation(input: SimulationInput): SimulationResult {
  const lines: string[] = [];
  const total = Math.max(5, Math.min(100, Math.floor(input.durationSec * 3)));
  for (let i = 1; i <= total; i++) {
    const sec = String(i).padStart(2, "0");
    const latency = 20 + Math.floor(Math.random() * 80);
    if (input.method === "DDOS") {
      lines.push(`[00:${sec}] Packet ${i} envoyé → latence ~${latency}ms`);
    } else if (input.method === "BRUTE_FORCE") {
      const user = ["admin", "root", "guest"][i % 3];
      lines.push(`[00:${sec}] Tentative #${i} sur ${user} → ${latency > 60 ? "échec" : "bloqué"}`);
    } else {
      lines.push(`[00:${sec}] Requête simulée: SELECT * FROM users WHERE email='test${i}@x.io' --`);
    }
  }

  const summary =
    input.method === "DDOS"
      ? `DDoS simulé pendant ${input.durationSec}s (${lines.length} événements).`
      : input.method === "BRUTE_FORCE"
      ? `Brute-force simulée pendant ${input.durationSec}s (${lines.length} tentatives).`
      : `Injection SQL simulée pendant ${input.durationSec}s (${lines.length} requêtes).`;

  return {
    userId: input.userId,
    method: input.method,
    ip: input.ip,
    port: input.port,
    packetSize: input.packetSize,
    durationSec: input.durationSec,
    summary,
    console: lines,
  };
}

export async function saveSimulationSupabase(result: SimulationResult) {
  const payload = {
    user_id: result.userId,
    method: result.method,
    ip: result.ip,
    port: result.port,
    packet_size: result.packetSize,
    duration_sec: result.durationSec,
    summary: result.summary,
    console: result.console,
  };
  const { error } = await supabase.from("simulations").insert(payload);
  if (error) throw error;
}
