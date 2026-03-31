import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const cardStyle = {
  background: "#1e1e1e",
  padding: "10px 15px",
  borderRadius: "10px",
  color: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
};

function World() {
  const { id } = useParams();

  const [world, setWorld] = useState(null);
  const [events, setEvents] = useState([]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");

  // 📜 Formatear fecha
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // 📌 Iconos automáticos según tipo
  const getIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes("muerte")) return "💀";
    if (t.includes("diamante")) return "💎";
    if (t.includes("aldea")) return "🏘️";
    if (t.includes("nether")) return "🔥";
    if (t.includes("base")) return "🏠";
    return "📌";
  };

  const getEvents = async () => {
    const res = await API.get(`/events/${id}`);
    setEvents(res.data);
  };

  const getWorld = async () => {
    const res = await API.get(`/worlds/${id}`);
    setWorld(res.data);
  };

  // ✨ Crear evento con coordenadas como Number
  const createEvent = async () => {
    if (!type) return;

    await API.post("/events", {
      type,
      description,
      x: Number(x),
      y: Number(y),
      z: Number(z),
      worldId: id,
    });

    setType("");
    setDescription("");
    setX("");
    setY("");
    setZ("");

    getEvents();
  };

  useEffect(() => {
    getEvents();
    getWorld();
  }, [id]);

  // 📊 Estadísticas automáticas
  const getStats = () => {
    let muertes = 0;
    let diamantes = 0;

    events.forEach((e) => {
      const t = e.type.toLowerCase();
      if (t.includes("muerte")) muertes++;
      if (t.includes("diamante")) diamantes++;
    });

    return {
      muertes,
      diamantes,
      total: events.length,
    };
  };

  const stats = getStats();

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌍 {world ? world.name : "Cargando..."}</h1>

      {/* Crear evento */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tipo (diamante, muerte...)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "8px", margin: "5px" }}
        />

        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px", margin: "5px" }}
        />

        <input
          type="number"
          placeholder="X"
          value={x}
          onChange={(e) => setX(e.target.value)}
          style={{ width: "60px", margin: "5px" }}
        />

        <input
          type="number"
          placeholder="Y"
          value={y}
          onChange={(e) => setY(e.target.value)}
          style={{ width: "60px", margin: "5px" }}
        />

        <input
          type="number"
          placeholder="Z"
          value={z}
          onChange={(e) => setZ(e.target.value)}
          style={{ width: "60px", margin: "5px" }}
        />

        <button
          onClick={createEvent}
          style={{
            padding: "10px",
            margin: "5px",
            background: "#00c853",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Agregar evento
        </button>
      </div>

      {/* Estadísticas */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={cardStyle}>💀 Muertes: {stats.muertes}</div>
        <div style={cardStyle}>💎 Diamantes: {stats.diamantes}</div>
        <div style={cardStyle}>📦 Eventos: {stats.total}</div>
      </div>

      {/* Timeline tipo CARD */}
      <div style={{ marginTop: "20px" }}>
        {events.map((e) => (
          <div
            key={e._id}
            style={{
              border: "1px solid #333",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "10px",
              background: "#1e1e1e",
              color: "white",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            <h3>
              {getIcon(e.type)} {e.type}
            </h3>

            <p>{e.description}</p>

            <p>
              📍 X:{e.x} Y:{e.y} Z:{e.z}
            </p>

            <small>🕒 {formatDate(e.date)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default World;