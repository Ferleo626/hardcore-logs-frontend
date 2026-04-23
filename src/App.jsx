import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import World from "./pages/World";
import AuthSuccess from "./pages/AuthSuccess";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>

          {/* 🔐 LOGIN ÚNICO DEL MOD */}
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* 🏠 HOME PROTEGIDO */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* 🌍 WORLD PROTEGIDO */}
          <Route
            path="/world/:id"
            element={
              <ProtectedRoute>
                <World />
              </ProtectedRoute>
            }
          />

          {/* 🚫 CUALQUIER RUTA INVALIDA */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

      <Footer />

    </div>
  );
}

export default App;