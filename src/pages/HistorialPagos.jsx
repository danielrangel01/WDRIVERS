import { useEffect, useState } from 'react';
import api from '../services/api';

function HistorialPagos() {
  const [pagos, setPagos] = useState([]);
  const [rechazados, setRechazados] = useState([]); // nuevos

  // const [mes, setMes] = useState(new Date().getMonth() + 1);
  // const [año, setAño] = useState(new Date().getFullYear());

  const fetchPagos = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/pagos/mis-pagos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPagos(res.data);

    // También traemos los rechazados
    try {
      const resRech = await api.get('/pagos/mis-rechazados', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRechazados(resRech.data);
    } catch {
      setRechazados([]);
    }
  };

  useEffect(() => {
    fetchPagos();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <h2>Mis pagos realizados</h2>

      {pagos.length === 0 ? (
        <p>No hay pagos registrados</p>
      ) : (
        <ul style={{ marginTop: '1rem' }}>
          {pagos.map((p) => (
            <li key={p._id}>
              <strong>${p.monto}</strong> – {new Date(p.fecha).toLocaleDateString()}<br />
              Vehículo: {p.vehiculo?.placa || 'N/A'}
            </li>
          ))}
        </ul>
      )}

      {/* Mostramos también los rechazados */}
      {rechazados.length > 0 && (
        <>
          <h2 style={{ marginTop: 40, color: "crimson" }}>Pagos rechazados</h2>
          <ul style={{ marginTop: '1rem' }}>
            {rechazados.map((p) => (
              <li key={p._id} style={{ color: "#b91c1c" }}>
                <strong>${p.monto}</strong> – {new Date(p.fecha).toLocaleDateString()}
                <br />
                Vehículo: {p.vehiculo?.placa || 'N/A'}
                <br />
                <b>Estado:</b> Rechazado
                {p.motivoRechazo && (
                  <>
                    <br />
                    <span style={{ color: "#c2410c" }}>
                      <b>Motivo:</b> {p.motivoRechazo}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default HistorialPagos;
