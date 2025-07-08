import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatoPesos } from "../utils/formatNumber";


function Dashboard() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/dashboard/resumen', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumen(res.data);
    };
    fetchResumen();
  }, []);

  if (!resumen) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h2>Resumen General</h2>

      <ul>
        <li><strong>Ingresos hoy:</strong>{formatoPesos(resumen.ingresosHoy)}</li>
        <li><strong>Ingresos mes:</strong>{formatoPesos(resumen.ingresosMes)}</li>
        <li><strong>Conductores activos hoy:</strong> {resumen.conductoresHoy}</li>
        <li><strong>Utilidad del mes:</strong>{formatoPesos(resumen.utilidadMes)}</li>
        <li><strong>Deudas generadas mes:</strong>{formatoPesos(resumen.totalDeudasMes) || 0}</li>
      </ul>

      <h3 style={{ marginTop: '2rem' }}>Utilidades y Deudas por Vehículo</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Vehículo</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Ingresos</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Gastos</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Deudas</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Utilidad</th>
            </tr>
          </thead>
          <tbody>
            {resumen.utilidadesPorVehiculo.map((v, i) => (
              <tr key={i}>
                <td style={{ padding: '0.5rem' }}>{v.vehiculo}</td>
                <td style={{ padding: '0.5rem' }}>{formatoPesos(v.ingresos)}</td>
                <td style={{ padding: '0.5rem' }}>{formatoPesos(v.gastos)}</td>
                <td style={{ padding: '0.5rem' }}>{formatoPesos(v.deudas || 0)}</td>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{formatoPesos(v.utilidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
