import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

type Row = {
  id: number;
  user_id: string;
  method: string;
  ip: string;
  port: number;
  summary: string;
  created_at: string;
};

export default function HistoryPage() {
  const { user, isAdmin } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      let query = supabase
        .from("simulations")
        .select("id,user_id,method,ip,port,summary,created_at")
        .order("created_at", { ascending: false });

      if (!isAdmin) query = query.eq("user_id", user!.id);

      const { data, error } = await query;
      if (!error && data) setRows(data);
      setLoading(false);
    };
    if (user) load();
  }, [user, isAdmin]);

  if (loading) return <p>Chargement…</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isAdmin ? "Historique global" : "Mon historique"}</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              {isAdmin && <th className="text-left px-4 py-2">User</th>}
              <th className="text-left px-4 py-2">Méthode</th>
              <th className="text-left px-4 py-2">IP:Port</th>
              <th className="text-left px-4 py-2">Résumé</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                {isAdmin && <td className="px-4 py-2">{r.user_id}</td>}
                <td className="px-4 py-2">{r.method}</td>
                <td className="px-4 py-2">{r.ip}:{r.port}</td>
                <td className="px-4 py-2">{r.summary}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={isAdmin ? 5 : 4}>
                  Aucun enregistrement.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
