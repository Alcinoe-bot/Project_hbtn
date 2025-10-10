import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  // page user après succès : /account
  const from = (location.state as any)?.from?.pathname ?? "/account";

  // Si déjà connecté, redirige vers la page user
  useEffect(() => {
    if (user) navigate("/account", { replace: true });
  }, [user, navigate]);

  const submit = async () => {
    setError(null); setInfo(null); setLoading(true);
    try {
      console.log("[LOGIN] start", { mode, email });
      const res = mode === "login"
        ? await login(email.trim(), password)
        : await register(email.trim(), password);

      console.log("[LOGIN] result", res);

      if (!res.ok) { setError(res.message ?? "Identifiants invalides."); return; }
      if (res.message) { setInfo(res.message); return; } // signUp avec confirm email activé

      // redirigé maintenant
      navigate("/account", { replace: true });

    } catch (e: any) {
      console.error("[LOGIN] exception", e);
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false); // arrête le "..."
    }
  };



  // Si connecté, on montre un petit récap (au cas où on arrive ici directement)
  if (user) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader><CardTitle>Mon compte</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p><b>Email :</b> {user.email}</p>
            <p><b>Rôle :</b> {user.role}</p>
            <Button onClick={logout}>Se déconnecter</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "login" ? "Connexion" : "Créer un compte"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Au moins 6 caractères.</p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {info && <p className="text-green-700 text-sm">{info}</p>}

          <div className="flex items-center gap-3">
            <Button onClick={submit} disabled={loading}>
              {loading ? "..." : mode === "login" ? "Se connecter" : "S'inscrire"}
            </Button>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
            >
              {mode === "login" ? "Créer un compte" : "J'ai déjà un compte"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
