import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

type Simulation = {
  id: number;
  ip: string;
  port: number;
  method: string;
  packet_size: number | null;
  duration_planned: number | null;
  duration_actual: number | null;
  max_pps: number | null;
  total_packets_sent: number | null;
  status: string;
  summary: string | null;
  console?: string | null;  // <-- ajouté
  created_at: string;
};

export default function HistoryPage() {
  const { user, isAdmin } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSimulations = async () => {
    if (!user) {
      console.log("❌ Pas d'utilisateur connecté");
      setLoading(false);
      return;
    }

    console.log("🔍 Chargement historique pour user:", user.id);

    let query: any = supabase
      .from("simulations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Erreur chargement:", error);
    } else {
      console.log("✅ Données chargées:", data?.length, "simulations");
      console.log("📊 Détails:", data);
      setSimulations(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSimulations();

    // ✅ REALTIME : Écoute des nouvelles simulations
    if (!user) return;

    console.log("🔔 Abonnement Realtime activé");

    const channel = supabase
      .channel('simulations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'simulations',
          filter: isAdmin ? undefined : `user_id=eq.${user.id}`
        },
        (payload: any) => {
          console.log("🆕 Nouvelle simulation:", payload);
          setSimulations((prev) => [payload.new as Simulation, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'simulations',
          filter: isAdmin ? undefined : `user_id=eq.${user.id}`
        },
        (payload: any) => {
          console.log("🔄 Simulation mise à jour:", payload);
          setSimulations((prev) =>
            prev.map((sim) =>
              sim.id === payload.new.id ? (payload.new as Simulation) : sim
            )
          );
        }
      )
      .subscribe((status: any) => {
        console.log("📡 Statut Realtime:", status);
      });

    return () => {
      console.log("🧹 Désabonnement Realtime");
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h2>
          <p className="text-gray-600">Vous devez être connecté pour voir l'historique.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdmin ? "Historique global" : "Mon historique"}
            </h1>
            <p className="text-gray-600">
              Consultez l'historique de vos tests de sécurité réseau
            </p>
          </div>

          {/* Indicateur temps réel */}
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span>Mise à jour en temps réel</span>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="text-sm text-gray-600">Total simulations</div>
            <div className="text-2xl font-bold text-gray-900">{simulations.length}</div>
          </div>

          {simulations.length > 0 && (
            <>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600">Dernière simulation</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(simulations[0].created_at).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600">Méthode la plus utilisée</div>
                <div className="text-lg font-semibold text-gray-900">
                  {(() => {
                    const methodCount = simulations.reduce((acc, r) => {
                      acc[r.method] = (acc[r.method] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    const mostUsed = Object.entries(methodCount).sort((a, b) => b[1] - a[1])[0];
                    return mostUsed ? mostUsed[0].replace('_', ' ') : '-';
                  })()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tableau */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date / Heure
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cible
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Config
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {simulations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-2">
                        <svg 
                          className="w-12 h-12 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <p className="text-lg font-medium text-gray-500">
                          Aucune simulation enregistrée
                        </p>
                        <p className="text-sm text-gray-400">
                          Lancez votre première simulation pour voir l'historique
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  simulations.map((sim, index) => (
                    <tr 
                      key={sim.id} 
                      className={`hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50' : ''}`}
                    >
                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(sim.created_at).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(sim.created_at).toLocaleTimeString("fr-FR")}
                          </span>
                        </div>
                      </td>

                      {/* Cible */}
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-mono font-medium text-gray-900">
                            {sim.ip}
                          </span>
                          <span className="text-xs text-gray-500">
                            Port: {sim.port}
                          </span>
                        </div>
                      </td>

                      {/* Méthode */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sim.method.replace("_", " ")}
                        </span>
                      </td>

                      {/* Config */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span>{sim.packet_size || '-'} octets</span>
                          <span>{sim.duration_planned || '-'}s prévus</span>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sim.max_pps || sim.total_packets_sent || sim.duration_actual ? (
                          <div className="flex flex-col gap-1">
                            {sim.max_pps != null && (
                              <span>Max PPS: {sim.max_pps.toLocaleString()}</span>
                            )}
                            {sim.total_packets_sent != null && (
                              <span>Paquets: {sim.total_packets_sent.toLocaleString()}</span>
                            )}
                            {sim.duration_actual != null && (
                              <span>Durée: {sim.duration_actual}s</span>
                            )}
                            {sim.console && (
                              <span
                                className="text-xs text-blue-600 underline cursor-pointer"
                                title={sim.console}
                              >
                                Voir logs (tooltip)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Pas de stats</span>
                        )}
                      </td>

                      {/* Statut */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sim.status === "success"
                              ? "bg-green-100 text-green-700"
                              : sim.status === "running"
                              ? "bg-yellow-100 text-yellow-700"
                              : sim.status === "vulnerable"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sim.status === "success"
                            ? "✓ Succès"
                            : sim.status === "running"
                            ? "⏳ En cours"
                            : sim.status === "vulnerable"
                            ? "⚠️ Vulnérable"
                            : sim.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info temps réel */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>💡 L'historique se met à jour automatiquement en temps réel</p>
        </div>
      </div>
    </div>
  );
}
