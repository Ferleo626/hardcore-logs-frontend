import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import World from "./pages/World";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/world/:id" element={<World />} />
    </Routes>
  );
}

export default App;