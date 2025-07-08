import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertaGlobal from '../components/AlertaGlobal';

function Users() {
  const [users, setUsers] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'conductor',
    assignedVehicle: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, message: '', severity: 'info' });

  const mostrarAlerta = (message, severity = 'info') => {
    setAlerta({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  const fetchVehiculos = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/vehiculos/disponibles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVehiculos(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchVehiculos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/usuarios', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ username: '', password: '', role: 'conductor', assignedVehicle: '' });
      setShowForm(false);
      fetchUsers();
      mostrarAlerta('✅ Usuario creado', 'success');
    } catch {
      mostrarAlerta('❌ Error al crear usuario', 'error');
    }
  };

  return (
    <div className="container">
      <AlertaGlobal
        open={alerta.open}
        message={alerta.message}
        severity={alerta.severity}
        onClose={() => setAlerta({ ...alerta, open: false })}
      />

      <h2>Usuarios</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Crear Usuario'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="conductor">Conductor</option>
            <option value="admin">Administrador</option>
          </select>
          <select
            value={formData.assignedVehicle}
            onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
          >
            <option value="">-- Seleccionar vehículo --</option>
            {vehiculos.map(v => (
              <option key={v._id} value={v._id}>{v.placa} - {v.modelo}</option>
            ))}
          </select>
          <button type="submit">Crear usuario</button>
        </form>
      )}

      <ul style={{ marginTop: '1rem' }}>
        {users.map(u => (
          <li key={u._id}>{u.username} ({u.role})</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
