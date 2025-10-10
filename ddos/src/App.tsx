import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SimulationPage from "./pages/SimulationPage";
import HistoryPage from "./pages/HistoryPage";
import AccountPage from "./pages/AccountPage";
import NotAllowed from "./pages/NotAllowed";
import { ProtectedRoute } from "./context/AuthContext";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary">
        <NavBar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />

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

            <Route path="/account" element={<AccountPage />} />
            <Route path="/not-allowed" element={<NotAllowed />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
