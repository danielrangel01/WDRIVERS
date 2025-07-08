import { useEffect, useState } from "react";
import api from "../services/api";


function DeudasAdmin() {
  const [deudas, setDeudas] = useState([]);
  const [editando, setEditando] = useState(null); // { _id, monto }
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [eliminando, setEliminando] = useState(null); // { _id }
  const [motivo, setMotivo] = useState("");

  const fetchDeudas = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/pagos/deudas-admin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeudas(res.data);
  };

  useEffect(() => {
    fetchDeudas();
  }, []);

  const handleEditar = (deuda) => {
    setEditando(deuda);
    setNuevoMonto(deuda.monto.toLocaleString("es-CO"));
  };

  const confirmarEditar = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/pagos/deuda/${editando._id}`,
        { monto: parseInt(nuevoMonto.replace(/\./g, "")) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditando(null);
      fetchDeudas();
    } catch (e) {
      console.log(e);    
      alert("Error editando monto");
    }
  };

  const handleEliminar = (deuda) => {
    setEliminando(deuda);
    setMotivo("");
  };

  const confirmarEliminar = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/pagos/deuda/${eliminando._id}`, {
        data: { motivo },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEliminando(null);
      fetchDeudas();
    } catch (e) {
      console.log(e);
      alert("Error eliminando deuda");
    }
  };

  return (
    <div className="container">
      <h2>Deudas de Conductores</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {deudas.map((d) => (
          <li
            key={d._id}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              padding: "0.5rem 0",
              gap: "1rem",
            }}
          >
            <span role="img" aria-label="deuda" style={{ fontSize: 24 }}>
              💸
            </span>
            <div style={{ flex: 1 }}>
              <strong>{new Date(d.fecha).toLocaleDateString()}</strong> — ${d.monto.toLocaleString("es-CO")}
              <br />
              Vehículo: <b>{d.vehiculo?.placa || "Sin placa"}</b>
              <br />
              Usuario: <b>{d.usuario?.username || "Sin usuario"}</b>
              <br />
              Estado: <b>{d.pagada ? "Pagada" : d.estado || "Pendiente"}</b>
              {d.eliminada && (
                <span style={{ color: "red", marginLeft: 8 }}>
                  (Eliminada)
                </span>
              )}
            </div>
            {!d.pagada && !d.eliminada && (
              <>
                <button onClick={() => handleEditar(d)}>Editar</button>
                <button style={{ color: "red" }} onClick={() => handleEliminar(d)}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Modal Editar */}
      {editando && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setEditando(null)}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              confirmarEditar();
            }}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 10,
              minWidth: 300,
              position: "relative",
              boxShadow: "0 2px 16px #0002",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Editar Monto Deuda</h3>
            <input
              type="text"
              value={nuevoMonto}
              onChange={e =>
                setNuevoMonto(
                  e.target.value
                    .replace(/[^\d]/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                )
              }
              style={{ fontSize: 18, width: "100%", marginBottom: 12 }}
              required
            />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setEditando(null)} style={{ marginLeft: 8 }}>
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Modal Eliminar */}
      {eliminando && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setEliminando(null)}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              confirmarEliminar();
            }}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 10,
              minWidth: 320,
              position: "relative",
              boxShadow: "0 2px 16px #0002",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Eliminar Deuda</h3>
            <p>Motivo de eliminación:</p>
            <input
              type="text"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 12 }}
            />
            <button type="submit" style={{ background: "red", color: "#fff" }}>
              Eliminar
            </button>
            <button type="button" onClick={() => setEliminando(null)} style={{ marginLeft: 8 }}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DeudasAdmin;
