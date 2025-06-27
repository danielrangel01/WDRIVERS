import { useEffect, useState } from 'react';
import api from '../services/api';

function Reportes() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/reportes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data);
    };
    fetchReport();
  }, []);

  return (
    <div className="container">
      <h2>Reporte de utilidades</h2>
      {report ? (
        <div>
          <p>Total ingresos: ${report.totalIngresos}</p>
          <p>Total gastos: ${report.totalGastos}</p>
          <p>Utilidad neta: ${report.utilidad}</p>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default Reportes;
