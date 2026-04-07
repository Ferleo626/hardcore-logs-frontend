import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

// 🔥 ESTILOS NUEVOS
import styles from "./World.module.css";

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
  const [socket, setSocket] = useState(null);

  // Estados para el formulario de creación manual
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");

  // --- FUNCIONES DE FORMATEO Y ESTILO ---

  const formatDate = (date) => {
    if (!date) return "Fecha desconocida";
    return new Date(date).toLocaleString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getIcon = (type) => { 
    switch (type) {
      case "DEATH": return "🐻‍❄️🕶️"; 
      case "DIAMOND": return "💎";
      case "ANCIENT_DEBRIS": return "🔥";
      case "NETHER": return "🌋";
      case "END": return "🌌";
      case "DRAGON": return "🐉";
      case "KILL_ZOMBIE": return "🧟";
      case "KILL_CREEPER": return "💣";
      case "KILL_SKELETON": return "🏹";
      case "LOW_HP": return "❤️";
      case "TOTEM": return "🧿";
      default: return "📌";
    }
  };

  const getDescription = (event) => {
    switch (event.type) {
      case "DEATH": return "Murió 💀 (El Oso cayó)";
      case "DIAMOND": return "Encontró diamante 💎";
      case "ANCIENT_DEBRIS": return "Encontró Ancient Debris 🔥";
      case "NETHER": return "Entró al Nether 🔥";
      case "END": return "Entró al End 🌌";
      case "DRAGON": return "Mató al dragón 🐉";
      case "KILL_ZOMBIE": return "Mató un Zombie 🧟";
      case "KILL_CREEPER": return "Mató un Creeper 💣";
      case "KILL_SKELETON": return "Mató un Esqueleto 🏹";
      case "LOW_HP": return "Estuvo al borde de la muerte ❤️";
      default: return event.description || "Evento detectado";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "DEATH": return "#ff4d4d";
      case "DIAMOND": return "#00ffff";
      case "ANCIENT_DEBRIS": return "#ff9900";
      case "DRAGON": return "#a64dff";
      case "TOTEM": return "#ffd700";
      default: return "white";
    }
  };

  const getDimensionName = (dim) => {
    switch (dim) {
      case "THE_NETHER": return "🔥 Nether";
      case "THE_END": return "🌌 End";
      default: return "🌿 Overworld";
    }
  };

  const getDimensionStyle = (dim) => {
    switch (dim) {
      case "THE_NETHER": return { color: "#ff4d4d", fontWeight: "bold" };
      case "THE_END": return { color: "#a64dff", fontWeight: "bold" };
      default: return { color: "#55ff55", fontWeight: "bold" };
    }
  };

  // --- LLAMADAS A API ---

  const getEvents = async () => {
    if (!id) return;
    try {
      const res = await API.get(`/events/${id}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  };

  const getWorld = async () => {
    if (!id) return;
    try {
      const res = await API.get(`/worlds/${id}`);
      setWorld(res.data);
    } catch (err) {
      console.error("Error al obtener mundo:", err);
    }
  };

  const createEvent = async () => {
    if (!type) return;
    try {
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
    } catch (err) {
      console.error("Error al crear evento:", err);
    }
  };

  // --- SOCKETS Y EFECTOS ---

  useEffect(() => {
    if (!id) return;
    const newSocket = io("http://localhost:4000", {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });
    newSocket.on("connect", () => console.log("✅ Conectado!"));
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    const handleNewEvent = (event) => {
      if (String(event.worldId) === String(id)) {
        setEvents((prev) => {
          if (prev.some(e => e._id === event._id)) return prev;
          return [event, ...prev];
        });
      }
    };
    socket.on("newEvent", handleNewEvent);
    return () => socket.off("newEvent", handleNewEvent);
  }, [socket, id]);

  useEffect(() => {
    if (!id) return;
    getWorld();
    getEvents();
  }, [id]);

  // --- CONTADORES ---
  const deaths = events.filter(e => e.type === "DEATH").length;
  const diamonds = events.filter(e => e.type === "DIAMOND").length;
  const zombieKills = events.filter(e => e.type === "KILL_ZOMBIE").length;
  const creeperKills = events.filter(e => e.type === "KILL_CREEPER").length;
  const skeletonKills = events.filter(e => e.type === "KILL_SKELETON").length;
  const debris = events.filter(e => e.type === "ANCIENT_DEBRIS").length;

  return (
    <div className={styles.container}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        
        {/* HEADER */}
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>
            🌍 {world ? world.name.toUpperCase() : "CARGANDO..."}
          </h1>
          <p className={styles.headerSubtitle}>Real-Time Minecraft Hardcore Event Tracker & Dashboard</p>
        </header>

        
        <div className={styles.statItem} style={{ marginBottom: "30px", borderLeft: "5px solid #ffd700" }}>
          <h3 style={{marginTop: 0}}>➕ Registrar Evento Manual</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input className={styles.input} type="text" placeholder="Tipo (DEATH, DIAMOND...)" value={type} onChange={(e) => setType(e.target.value)} />
            <input className={styles.input} type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input className={styles.inputShort} type="number" placeholder="X" value={x} onChange={(e) => setX(e.target.value)} />
            <input className={styles.inputShort} type="number" placeholder="Y" value={y} onChange={(e) => setY(e.target.value)} />
            <input className={styles.inputShort} type="number" placeholder="Z" value={z} onChange={(e) => setZ(e.target.value)} />
            <button className={styles.button} onClick={createEvent}>Agregar</button>
          </div>
        </div>

       {/* --- GRID DE ESTADÍSTICAS --- */}
<div className={styles.statsGrid}>
  
  <div className={styles.statItem} style={{ borderLeft: "5px solid #ff4d4d" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
      <div className={styles.statLabel}>CAÍDAS DEL OSO</div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateAreas: '"icon"', 
        justifyItems: 'center', 
        alignItems: 'center', 
        width: '40px', 
        height: '40px' 
      }}>
        
        <span style={{ gridArea: 'icon', fontSize: '2rem', zIndex: 1 }}>
          🐻‍❄️
        </span>
        
        <span style={{ 
          gridArea: 'icon', 
          fontSize: '1.2rem', 
          zIndex: 2, 
          marginTop: '5px', 
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))' 
        }}>
          🕶️
        </span>
      </div>
    </div>
    <div className={styles.statValue} style={{ color: "#ff4d4d" }}>{deaths}</div>
  </div>

  <div className={styles.statItem} style={{ borderLeft: "5px solid #00ffff" }}>
    <div className={styles.statLabel}>DIAMANTES 💎</div>
    <div className={styles.statValue} style={{ color: "#00ffff" }}>{diamonds}</div>
  </div>

  <div className={styles.statItem} style={{ borderLeft: "5px solid #ff9900" }}>
    <div className={styles.statLabel}>NETHERITE 🔥</div>
    <div className={styles.statValue} style={{ color: "#ff9900" }}>{debris}</div>
  </div>

  <div className={styles.statItem} style={{ borderLeft: "5px solid #55ff55" }}>
    <div className={styles.statLabel}>ZOMBIES 🧟</div>
    <div className={styles.statValue}>{zombieKills}</div>
  </div>
</div>
{/* LISTA DE EVENTOS */}
<div className={styles.eventList}>
  {[...events]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .map((e) => (
      <div key={e._id} className={styles.card} style={{ borderLeft: `6px solid ${getColor(e.type)}` }}>
        <div className={styles.eventInfo}>
          
          {/* CONTENEDOR DEL ICONO: Grid de Superposición */}
          <div className={styles.eventIcon} style={{ 
            display: 'grid', 
            gridTemplateAreas: "icon", 
            justifyItems: 'center', 
            alignItems: 'center', 
            width: '80px', 
            height: '80px' 
          }}>
            {e.type === "DEATH" ? (
              <>
                
                <span style={{ 
                  gridArea: 'icon',
                  fontSize: '3rem', 
                  position: 'relative', 
                  zIndex: 1 
                }}>
                  🐻‍❄️
                </span>
                
                <span style={{ 
                  gridArea: 'icon',
                  fontSize: '2rem', 
                  position: 'relative', 
                  zIndex: 2,
                  margin: '0', 
                  padding: '0', 
                  marginTop: '10px',
                  filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))' 
                }}>
                  🕶️
                </span>
              </>
            ) : (
              <span style={{ fontSize: '2.5rem', gridArea: 'icon' }}>{getIcon(e.type)}</span>
            )}
          </div>

          <div>
            <h4 className={styles.eventTitle} style={{ color: getColor(e.type) }}>
              {e.type.replace(/_/g, " ")}
            </h4>
            <p className={styles.eventDescription}>{getDescription(e)}</p>
            <div className={styles.eventMeta}>
              <span style={getDimensionStyle(e.dimension)}>{getDimensionName(e.dimension)}</span>
              <span className={styles.coords}>X: {e.x} | Y: {e.y} | Z: {e.z}</span>
              {e.dimension === "THE_NETHER" && (
                <span style={{ color: "#aaa" }}> (OW: X:{e.x * 8} Z:{e.z * 8})</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.eventTimeContainer}>
          <div className={styles.eventTime}>{formatDate(e.createdAt || e.date)}</div>
        </div>
      </div>
    ))}
</div>

      </div>
    </div>
  );
};

export default World;