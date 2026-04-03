import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import World from "./pages/World";
import Login from "./pages/Login";
import Register from "./pages/Register"; // 👈 si lo vas a usar
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
  );
}

export default App;