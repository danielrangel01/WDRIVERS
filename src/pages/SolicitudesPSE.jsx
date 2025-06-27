import { useEffect, useState } from 'react';
import api from '../services/api';

function SolicitudesPSE() {
  const [solicitudes, setSolicitudes] = useState([]);

  const fetchSolicitudes = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/solicitudes-pago', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSolicitudes(res.data);
  };

  const aprobar = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/solicitudes-pago/${id}/aprobar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Pago aprobado');
      fetchSolicitudes();
    } catch {
      alert('❌ Error al aprobar');
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const getColor = (estado) => {
    switch (estado) {
      case 'aprobado': return '#4CAF50';
      case 'rechazado': return '#F44336';
      default: return '#ccc'; // pendiente
    }
  };

  return (
    <div className="container">
      <h2>Solicitudes de Pago PSE</h2>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {solicitudes.map((s) => (
            <div key={s._id} style={{
              padding: '1rem',
              border: `2px solid ${getColor(s.estado)}`,
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              backgroundColor: '#fff'
            }}>
              <p><strong>Estado:</strong> <span style={{ color: getColor(s.estado), textTransform: 'capitalize' }}>{s.estado}</span></p>
              <p><strong>Conductor:</strong> {s.usuario?.username}</p>
              <p><strong>Vehículo:</strong> {s.vehiculo?.placa} - {s.vehiculo?.modelo}</p>
              <p><strong>Monto:</strong> ${s.monto}</p>
              <p><strong>Fecha:</strong> {new Date(s.fecha).toLocaleString()}</p>

              {s.estado === 'pendiente' && (
                <button
                  onClick={() => aprobar(s._id)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Aprobar pago
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SolicitudesPSE;
