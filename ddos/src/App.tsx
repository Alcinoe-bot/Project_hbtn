import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SimulationPage from "./pages/SimulationPage";
import HistoryPage from "./pages/HistoryPage";
import AccountPage from "./pages/AccountPage";
import NotAllowed from "./pages/NotAllowed";
import { ProtectedRoute, useAuth } from "./context/AuthContext";

function AppShell() {
  // Affiche un écran de chargement le temps que Supabase hydrate la session
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-slate-600">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="p-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/not-allowed" element={<NotAllowed />} />

          {/* Protégées : redirection vers /account si non connecté */}
          <Route
            path="/simulate"
            element={
              <ProtectedRoute>
                <SimulationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
