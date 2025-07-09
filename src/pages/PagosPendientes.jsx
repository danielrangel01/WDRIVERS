import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertaGlobal from '../components/AlertaGlobal';

// Cambia esto por la URL de tu backend en producción
const BACKEND_URL = "https://wdrivers-backend-production.up.railway.app";

function PagosPendientes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, message: '', severity: 'info' });

  // Para confirmar (simple)
  const [confirmar, setConfirmar] = useState({ open: false, cb: null, texto: "" });

  // Nuevo: para rechazar (modal motivo)
  const [rechazando, setRechazando] = useState(null); // { tipo, id }
  const [motivo, setMotivo] = useState("");

  const mostrarAlerta = (message, severity = 'info') => {
    setAlerta({ open: true, message, severity });
  };

  const fetchPendientes = async () => {
    const token = localStorage.getItem('token');
    try {
      const res1 = await api.get('/solicitudes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(res1.data);

      const res2 = await api.get('/pagos/deudas-pendientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeudas(res2.data);
    } catch {
      mostrarAlerta("Error al cargar pendientes", "error");
    }
  };

  useEffect(() => {
    fetchPendientes();
    // eslint-disable-next-line
  }, []);

  const aprobar = (id) => {
    setConfirmar({
      open: true,
      texto: "¿Aprobar este pago manual?",
      cb: async (ok) => {
        setConfirmar({ open: false, cb: null, texto: "" });
        if (!ok) return;
        const token = localStorage.getItem('token');
        try {
          await api.post(`/solicitudes/${id}/aprobar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          mostrarAlerta("✅ Pago aprobado", "success");
          fetchPendientes();
        } catch {
          mostrarAlerta("❌ Error al aprobar pago", "error");
        }
      }
    });
  };

  const aprobarDeuda = (id) => {
    setConfirmar({
      open: true,
      texto: "¿Aprobar pago de deuda?",
      cb: async (ok) => {
        setConfirmar({ open: false, cb: null, texto: "" });
        if (!ok) return;
        const token = localStorage.getItem('token');
        try {
          await api.post(`/pagos/deudas/${id}/aprobar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          mostrarAlerta("✅ Pago de deuda aprobado", "success");
          fetchPendientes();
        } catch {
          mostrarAlerta("❌ Error al aprobar deuda", "error");
        }
      }
    });
  };

  // NUEVO: Rechazar pago manual o deuda (abre modal motivo)
  const rechazar = (tipo, id) => {
    setRechazando({ tipo, id });
    setMotivo('');
  };

  const confirmarRechazo = async () => {
    if (!motivo || motivo.trim().length < 3) {
      mostrarAlerta("Debes indicar un motivo válido", "warning");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      if (rechazando.tipo === "solicitud") {
        await api.post(
          `/solicitudes/${rechazando.id}/rechazar`,
          { motivo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post(
          `/pagos/deudas/${rechazando.id}/rechazar`,
          { motivo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      mostrarAlerta("Pago rechazado", "warning");
      setRechazando(null);
      setMotivo('');
      fetchPendientes();
    } catch {
      mostrarAlerta("Error al rechazar pago", "error");
    }
  };

  return (
    <div className="container">
      {/* ALERTA GLOBAL */}
      <AlertaGlobal
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />

      {/* CONFIRMACIÓN SIMPLE */}
      {confirmar.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 2px 12px #0003',
            minWidth: 320, textAlign: 'center'
          }}>
            <p style={{ fontWeight: "bold" }}>{confirmar.texto}</p>
            <button onClick={() => confirmar.cb(true)} style={{ margin: 8, background: "#1976d2", color: "#fff", border: "none", padding: "0.5rem 1.3rem", borderRadius: 6 }}>Sí</button>
            <button onClick={() => confirmar.cb(false)} style={{ margin: 8, background: "#eee", color: "#333", border: "none", padding: "0.5rem 1.3rem", borderRadius: 6 }}>No</button>
          </div>
        </div>
      )}

      {/* MODAL RECHAZO */}
      {rechazando && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.32)', zIndex: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form
            style={{
              background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 2px 16px #0003',
              minWidth: 320, textAlign: 'center'
            }}
            onSubmit={e => { e.preventDefault(); confirmarRechazo(); }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Rechazar pago</h3>
            <p>Escribe el motivo del rechazo:</p>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              required
              minLength={3}
              style={{ width: "100%", minHeight: 70, marginBottom: 12, padding: 8 }}
              placeholder="Motivo"
            />
            <div>
              <button type="submit" style={{ background: "red", color: "#fff", marginRight: 8 }}>
                Confirmar rechazo
              </button>
              <button type="button" onClick={() => setRechazando(null)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <h2>Pagos Manuales Pendientes</h2>
      {solicitudes.length === 0 ? (
        <p>No hay pagos manuales pendientes</p>
      ) : (
        <ul>
          {solicitudes.map((s) => (
            <li key={s._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <p><strong>Monto:</strong> ${s.monto}</p>
              <p><strong>Vehículo:</strong> {s.vehiculo?.placa || "Sin placa"}</p>
              <p><strong>Usuario:</strong> {s.usuario?.username || "Sin usuario"}</p>
              <a href={`${BACKEND_URL}/${s.evidencia}`} target="_blank" rel="noopener noreferrer">
                Ver Comprobante
              </a>
              <br />
              <button onClick={() => aprobar(s._id)}>Aprobar</button>
              <button style={{ color: "red", marginLeft: 10 }} onClick={() => rechazar("solicitud", s._id)}>
                Rechazar
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: "2rem" }}>Pagos de Deudas Pendientes</h2>
      {deudas.length === 0 ? (
        <p>No hay pagos de deudas pendientes</p>
      ) : (
        <ul>
          {deudas.map((d) => (
            <li key={d._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <p><strong>Monto:</strong> ${d.monto}</p>
              <p><strong>Vehículo:</strong> {d.vehiculo?.placa || "Sin placa"}</p>
              <p><strong>Usuario:</strong> {d.usuario?.username || "Sin usuario"}</p>
              <p><strong>Fecha deuda:</strong> {new Date(d.fecha).toLocaleDateString()}</p>
              {d.comprobante &&
                <a href={`${BACKEND_URL}/${d.comprobante}`} target="_blank" rel="noopener noreferrer">
                  Ver Comprobante
                </a>
              }
              <br />
              <button onClick={() => aprobarDeuda(d._id)}>Aprobar deuda</button>
              <button style={{ color: "red", marginLeft: 10 }} onClick={() => rechazar("deuda", d._id)}>
                Rechazar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PagosPendientes;
