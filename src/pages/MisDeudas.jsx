import { useEffect, useState } from "react";
import api from "../services/api";

function MisDeudas() {
  const [deudas, setDeudas] = useState([]);
  const [pagando, setPagando] = useState(null);
  const [metodo, setMetodo] = useState("pse");
  const [comprobante, setComprobante] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchDeudas = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/pagos/deudas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeudas(res.data);
  };

  useEffect(() => {
    fetchDeudas();
  }, []);

  const handlePagar = async (e) => {
    e.preventDefault();
    if (!pagando) return;
    setCargando(true);

    const token = localStorage.getItem("token");
    try {
      if (metodo === "pse") {
        const res = await api.post(
          `/pagos/pagar-deuda/${pagando._id}`,
          { metodo: "pse" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.checkoutUrl) {
          window.location.href = res.data.checkoutUrl;
        } else {
          alert("Error generando enlace PSE");
        }
      } else {
        if (!comprobante) {
          alert("Debes subir un comprobante.");
          setCargando(false);
          return;
        }
        const formData = new FormData();
        formData.append("metodo", "manual");
        formData.append("comprobante", comprobante);

        await api.post(
          `/pagos/pagar-deuda/${pagando._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Pago manual enviado. Espera aprobación del administrador.");
        setPagando(null);
        setComprobante(null);
        setMetodo("pse");
        fetchDeudas();
      }
    } catch (err) {
      console.log(err);
      alert("Error procesando pago");
    }
    setCargando(false);
  };

  return (
    <div className="container">
      <h2>Mis Deudas Pendientes</h2>
      {deudas.length === 0 && <p>No tienes deudas pendientes 🎉</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {deudas.map((d) => {
          // Chequea si está pendiente de aprobación manual
          
          const creada =
            d.metodo === "manual" &&
            !d.pagada &&
            d.estado === "creada";

          const pendienteAprobacion =
            d.metodo === "manual" &&
            !d.pagada &&
            d.estado === "pendiente";

          return (
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
              <span role="img" aria-label="alerta" style={{ fontSize: 24 }}>
                💸
              </span>
              <div style={{ flex: 1 }}>
                <strong>{new Date(d.fecha).toLocaleDateString()}</strong> — ${d.monto}
                <br />
                Vehículo: <b>{d.vehiculo?.placa || "Sin placa"}</b>
                {pendienteAprobacion && (
                  <div style={{ color: "#ff9900", fontWeight: "bold", fontSize: 14, marginTop: 4 }}>
                    ⏳ Pago manual pendiente de aprobación
                  </div>
                )}
              </div>
              {/* Solo mostrar botón si NO está pendiente de aprobación */}
              {creada && (
                <button onClick={() => setPagando(d)} disabled={pagando}>
                  Pagar
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Modal de pago */}
      {pagando && (
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
          onClick={() => !cargando && setPagando(null)}
        >
          <form
            onSubmit={handlePagar}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 10,
              minWidth: 300,
              position: "relative",
              boxShadow: "0 2px 16px #0002",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                fontWeight: "bold",
                border: "none",
                background: "transparent",
                fontSize: 22,
                cursor: "pointer",
              }}
              onClick={() => !cargando && setPagando(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3>
              Pagar deuda de <b>${pagando.monto}</b>
            </h3>
            <p>
              Día: <b>{new Date(pagando.fecha).toLocaleDateString()}</b>
              <br />
              Vehículo: <b>{pagando.vehiculo?.placa || "Sin placa"}</b>
            </p>
            <div style={{ margin: "1rem 0" }}>
              <label>
                <input
                  type="radio"
                  name="metodo"
                  value="pse"
                  checked={metodo === "pse"}
                  onChange={() => setMetodo("pse")}
                  disabled={cargando}
                />
                Pago con PSE
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="metodo"
                  value="manual"
                  checked={metodo === "manual"}
                  onChange={() => setMetodo("manual")}
                  disabled={cargando}
                />
                Pago manual (con comprobante)
              </label>
            </div>
            {metodo === "manual" && (
              <div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setComprobante(e.target.files[0])}
                  required
                  disabled={cargando}
                />
              </div>
            )}
            <button type="submit" disabled={cargando} style={{ marginTop: "1rem" }}>
              {cargando ? "Procesando..." : "Confirmar pago"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MisDeudas;
