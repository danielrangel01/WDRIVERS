import { useEffect, useState } from "react";
import api from "../services/api";
import AlertaGlobal from "../components/AlertaGlobal";

function MisDeudas() {
  const [deudas, setDeudas] = useState([]);
  const [pagando, setPagando] = useState(null);
  const [metodo, setMetodo] = useState("pse");
  const [comprobante, setComprobante] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Estado para alertas
  const [alerta, setAlerta] = useState({ open: false, message: "", severity: "info" });
  const mostrarAlerta = (message, severity = "info") => {
    setAlerta({ open: true, message, severity });
  };

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

  // Nuevo handler robusto para validar archivo
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setComprobante(null);
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      mostrarAlerta("Solo se permiten imágenes jpg, jpeg, png o webp.", "warning");
      e.target.value = "";
      setComprobante(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      mostrarAlerta("El archivo debe ser menor a 2 MB.", "warning");
      e.target.value = "";
      setComprobante(null);
      return;
    }
    setComprobante(file);
  };

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
          mostrarAlerta("Error generando enlace PSE", "error");
        }
      } else {
        if (!comprobante) {
          mostrarAlerta("Debes subir un comprobante.", "warning");
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
        mostrarAlerta("Pago manual enviado. Espera aprobación del administrador.", "success");
        setPagando(null);
        setComprobante(null);
        setMetodo("pse");
        fetchDeudas();
      }
    } catch (err) {
      console.log(err);
      mostrarAlerta("Error procesando pago", "error");
    }
    setCargando(false);
  };

  return (
    <div className="container">
      {/* Alerta global MUI */}
      <AlertaGlobal
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />

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
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFile}
                  required
                  disabled={cargando}
                />
                <small>Máx 2MB. Solo jpg, jpeg, png, webp.</small>
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
