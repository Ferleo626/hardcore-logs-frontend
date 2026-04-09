// REEMPLAZÁ SOLO EL RETURN POR ESTE

return (
  <div style={containerStyle}>
    
    {/* 🔥 HEADER ESTILO WORLD */}
    <h1 style={{ 
      fontSize: "3rem", 
      color: "#ffc800", 
      textShadow: "0 0 10px rgba(255, 200, 0, 0.7)", 
      letterSpacing: "3px", 
      fontWeight: "bold",
      textTransform: "uppercase",
      marginBottom: "10px"
    }}>
      🌍 MIS MUNDOS HARDCORE
    </h1>

    <p style={{ opacity: 0.7, marginBottom: "30px" }}>
      Hardcore Minecraft Tracker Dashboard
    </p>

    {/* 🔥 ESTADO LOADING */}
    {loading && (
      <h1 style={{ color: "#ffc800" }}>CARGANDO...</h1>
    )}

    {/* 🔥 ESTADO ERROR (ESTILO WORLD) */}
    {!loading && error && (
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#ffc800" }}>ERROR DE CONEXIÓN</h1>

        <button
          onClick={getWorlds}
          style={{
            padding: "12px 25px",
            background: "#ffc800",
            color: "#001030",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px",
            boxShadow: "0 0 10px rgba(255,200,0,0.6)"
          }}
        >
          🔄 REINTENTAR CONEXIÓN
        </button>
      </div>
    )}

    {/* 🔥 CONTENIDO SOLO SI NO HAY ERROR */}
    {!loading && !error && (
      <>
        {/* Crear mundo */}
        <div style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Nombre del nuevo mundo..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={createWorld}
            style={{
              padding: "12px 20px",
              background: "#ffc800",
              color: "#001030",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Crear
          </button>
        </div>

        {/* Lista */}
        {worlds.length === 0 ? (
          <p>No hay mundos todavía.</p>
        ) : (
          worlds.map((w) => (
            <div key={w._id} style={cardStyle}>
              <div
                onClick={() => navigate(`/world/${w._id}`)}
                style={{ cursor: "pointer", flex: 1, textAlign: "left" }}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  {w.name}
                </span>

                {w.active && (
                  <span style={{
                    marginLeft: "10px",
                    background: "#27ae60",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>
                    ACTIVO
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {!w.active && (
                  <button
                    onClick={() => activateWorld(w._id, w.name)}
                    style={{
                      padding: "8px 15px",
                      background: "#444",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Usar
                  </button>
                )}

                <button
                  onClick={() => deleteWorld(w._id)}
                  style={{
                    padding: "8px 15px",
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))
        )}

        <p style={{ marginTop: "20px", fontSize: "0.85rem", opacity: 0.7 }}>
          Haz clic en un mundo para ver detalles.
        </p>
      </>
    )}
  </div>
);