import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  let user = null as ReturnType<typeof useAuth>["user"] | null;
  let logout: () => void = () => {};

  try {
    const ctx = useAuth();
    user = ctx.user;
    logout = ctx.logout;
  } catch {
    // affiche juste Accueil / Se connecter
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg">
          Accueil
        </Link>

        <div className="flex items-center gap-4">
          {user && <Link to="/simulate" className="text-slate-300 hover:text-white">Simulation</Link>}
          {user && <Link to="/history" className="text-slate-300 hover:text-white">Historique</Link>}
          
          {!user ? (
            <Link to="/account" className="text-white hover:text-cyan-400">Se connecter</Link>
          ) : (
            <button onClick={logout} className="text-white hover:text-cyan-400">
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
