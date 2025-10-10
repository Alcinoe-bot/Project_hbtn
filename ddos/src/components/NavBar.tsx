import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  let user = null as ReturnType<typeof useAuth>["user"] | null;
  let isAdmin = false;
  let logout: () => void = () => {};

  try {
    const ctx = useAuth();
    user = ctx.user;
    isAdmin = ctx.isAdmin;
    logout = ctx.logout;
  } catch {
    // affiche juste Accueil / Se connecter
  }

  return (
    <nav className="bg-primary text-white px-4 py-3 flex gap-6 items-center">
      <Link to="/">Accueil</Link>
      {user && <Link to="/simulate">Simulation</Link>}
      {user && <Link to="/history">Historique</Link>}
      {isAdmin && <span className="opacity-70 text-xs">ADMIN</span>}
      <div className="ml-auto flex items-center gap-4">
        {!user ? (
          <Link to="/account" className="underline">Se connecter</Link>
        ) : (
          <>
            <span className="opacity-80 text-sm">{user.email}</span>
            <button onClick={logout} className="rounded-md bg-white/10 px-3 py-1 hover:bg-white/20">
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
