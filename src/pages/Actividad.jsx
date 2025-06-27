import { useEffect, useState } from 'react';
import api from '../services/api';

function Actividad() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/actividad', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    };
    fetchLogs();
  }, []);

  return (
    <div className="container">
      <h2>Historial de actividad</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default Actividad;
