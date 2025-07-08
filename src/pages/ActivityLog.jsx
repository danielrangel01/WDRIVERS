import { useEffect, useState } from 'react';
import api from '../services/api';

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetch = async () => {
      const res = await api.get('/actividad', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    };
    fetch();
    api.post("/actividad/marcar-leidas", {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(() => {
    // Opcional: actualizar contador global
  });
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");
  api.post("/actividad/marcar-leidas", {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(() => {
    // Opcional: actualizar contador global
  });
}, []);


  

  return (
    <div className="container">
      <h2>Actividad</h2>
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            <strong>{log.usuario?.username}</strong> - {log.descripcion} <br />
            <small>{new Date(log.fecha).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;