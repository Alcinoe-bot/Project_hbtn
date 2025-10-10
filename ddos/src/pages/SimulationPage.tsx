import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { runLocalSimulation, saveSimulationSupabase, SimulationMethod } from "../lib/simulation";

const schema = z.object({
  ip: z.string().min(7, "IP invalide").max(50),
  port: z.coerce.number().int().min(1).max(65535),
  method: z.enum(["DDOS", "BRUTE_FORCE", "SQL_INJECTION"]),
  packetSize: z.coerce.number().int().min(1).max(65535),
  durationSec: z.coerce.number().int().min(1).max(120),
});
type FormValues = z.infer<typeof schema>;

export default function SimulationPage() {
  const { user } = useAuth();
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ip: "192.168.0.10", port: 443, method: "DDOS", packetSize: 1024, durationSec: 15 },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    setConsoleLines([]);
    setSummary(null);

    const result = runLocalSimulation({
      userId: user.id,
      method: values.method as SimulationMethod,
      ip: values.ip,
      port: values.port,
      packetSize: values.packetSize,
      durationSec: values.durationSec,
    });

    // Affichage
    for (const line of result.console) {
      setConsoleLines(prev => [...prev, line]);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 10));
    }

    setSaving(true);
    try {
      await saveSimulationSupabase(result);
      setSummary(result.summary);
    } catch (e: any) {
      setSummary(`Erreur de sauvegarde: ${e?.message ?? "inconnue"}`);
    } finally {
      setSaving(false);
    }
    reset({ ...values });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader><CardTitle>Lancer une attaque</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">IP cible</label>
              <input className="w-full rounded-md border px-3 py-2" {...register("ip")} />
              {errors.ip && <p className="text-sm text-red-600">{errors.ip.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Port</label>
              <input type="number" className="w-full rounded-md border px-3 py-2" {...register("port")} />
              {errors.port && <p className="text-sm text-red-600">{errors.port.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Méthode</label>
              <select className="w-full rounded-md border px-3 py-2" {...register("method")}>
                <option value="DDOS">DDoS</option>
                <option value="BRUTE_FORCE">Brute-force</option>
                <option value="SQL_INJECTION">SQL Injection</option>
              </select>
              {errors.method && <p className="text-sm text-red-600">{errors.method.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Taille paquets</label>
              <input type="number" className="w-full rounded-md border px-3 py-2" {...register("packetSize")} />
              {errors.packetSize && <p className="text-sm text-red-600">{errors.packetSize.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Durée (s)</label>
              <input type="number" className="w-full rounded-md border px-3 py-2" {...register("durationSec")} />
              {errors.durationSec && <p className="text-sm text-red-600">{errors.durationSec.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>Lancer la simulation</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Console simulée</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 overflow-auto rounded-md bg-black text-green-300 p-3 font-mono text-sm">
            {consoleLines.length === 0 ? (
              <p className="opacity-60">Aucune sortie pour le moment…</p>
            ) : (
              consoleLines.map((l, i) => <div key={i}>{l}</div>)
            )}
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
          <CardContent>
            <p>{summary}</p>
            <p className="text-xs opacity-70 mt-2">⚠️ Attaque réelle.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
