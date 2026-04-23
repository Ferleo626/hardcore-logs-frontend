import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import World from "./pages/World";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar"; // Asegurate de que el path sea correcto
import Footer from "./components/Footer"; // El componente que creamos recién
import AuthSuccess from "./pages/AuthSuccess";

function App() {
  return (
    /* Contenedor principal para que el Footer siempre esté al fondo */
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* La Navbar la podés dejar acá afuera si querés que aparezca siempre */}
      <Navbar />

      {/* El contenido principal crece para empujar al footer */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/world/:id"
            element={
              <ProtectedRoute>
                <World />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* 🔥 El Footer globalizado del Oso Xeneize */}
      <Footer />
    </div>
  );
}

export default App;