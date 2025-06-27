import { useEffect, useState } from 'react';
import api from '../services/api';

function PagosPendientes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [deudas, setDeudas] = useState([]);

  const fetchPendientes = async () => {
    const token = localStorage.getItem('token');
    // Solicitudes manuales normales
    const res1 = await api.get('/solicitudes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSolicitudes(res1.data);

    // Deudas manuales pendientes
    const res2 = await api.get('/pagos/deudas-pendientes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDeudas(res2.data);
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const aprobar = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Aprobar este pago manual?')) return;
    try {
      await api.post(`/solicitudes/${id}/aprobar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Pago aprobado');
      fetchPendientes();
    } catch {
      alert('❌ Error al aprobar pago');
    }
  };

  const aprobarDeuda = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Aprobar pago de deuda?')) return;
    try {
      await api.post(`/pagos/deudas/${id}/aprobar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Pago de deuda aprobado');
      fetchPendientes();
    } catch {
      alert('❌ Error al aprobar deuda');
    }
  };

  return (
    <div className="container">
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
              <a href={`http://localhost:4000/${s.evidencia}`} target="_blank" rel="noopener noreferrer">
                Ver Comprobante
              </a>
              <br />
              <button onClick={() => aprobar(s._id)}>Aprobar</button>
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
                <a href={`http://localhost:4000/${d.comprobante}`} target="_blank" rel="noopener noreferrer">
                  Ver Comprobante
                </a>
              }
              <br />
              <button onClick={() => aprobarDeuda(d._id)}>Aprobar deuda</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PagosPendientes;
