import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-primary text-white px-4 py-3 flex gap-6">
      <Link to="/">Accueil</Link>
      <Link to="/simulate">Simulation</Link>
      <Link to="/history">Historique</Link>
      <Link to="/users">Utilisateurs</Link>
    </nav>
  );
}
