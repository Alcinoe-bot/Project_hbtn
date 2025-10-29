import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "nav-link--active" : ""}`;

  const handleLogout = async () => {
    await logout();
    navigate("/account", { replace: true });
  };

  return (
    <nav className="navbar">
      <span className="brand">DDos service</span>

      {/* page */}
      <NavLink to="/" className={linkClass}>Accueil</NavLink>
      <NavLink to="/simulate" className={linkClass}>Simulation</NavLink>
      <NavLink to="/history" className={linkClass}>Historique</NavLink>
      {isAdmin && <NavLink to="/admin" className={linkClass}>Utilisateurs</NavLink>}

      <div className="ml-auto flex items-center gap-3">
        {!user ? (
          <NavLink to="/account" className="nav-link">Se connecter</NavLink>
        ) : (
          <>
            {/* 👉 lien page compte */}
            <NavLink to="/account" className="nav-link">Mon compte</NavLink>
            <span className="connected">
              {user.email?.split("@")[0]}
              {isAdmin && <span className="badge-admin">Admin</span>}
            </span>
            <button
              onClick={handleLogout}
              className="ml-1 rounded-md bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
