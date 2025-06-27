import { useEffect, useState } from 'react';
import api from '../services/api';

function HistorialPagos() {
  const [pagos, setPagos] = useState([]);
 // const [mes, setMes] = useState(new Date().getMonth() + 1);
 // const [año, setAño] = useState(new Date().getFullYear());

  const fetchPagos = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/pagos/mis-pagos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPagos(res.data);
  };

  useEffect(() => {
    fetchPagos();
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
    </div>
  );
}

export default HistorialPagos;
