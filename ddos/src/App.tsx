import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SimulationPage from "./pages/SimulationPage";
import HistoryPage from "./pages/HistoryPage";
import UserPage from "./pages/UserPage";
import NotAllowed from "./pages/NotAllowed";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary">
        <NavBar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulate" element={<SimulationPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/not-allowed" element={<NotAllowed />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
