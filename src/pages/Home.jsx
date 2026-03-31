import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Home() {
  const [worlds, setWorlds] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const getWorlds = async () => {
    const res = await API.get("/worlds");
    setWorlds(res.data);
  };

  const createWorld = async () => {
    if (!name) return;

    await API.post("/worlds", { name });
    setName("");
    getWorlds();
  };

  useEffect(() => {
    getWorlds();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌍 Hardcore Logs</h1>

      <input
        type="text"
        placeholder="Nombre del mundo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createWorld}>Crear</button>

      <ul>
        {worlds.map((w) => (
          <li
            key={w._id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/world/${w._id}`)}
          >
            {w.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;