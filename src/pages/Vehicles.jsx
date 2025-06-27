import { useEffect, useState } from 'react';
import api from '../services/api';

function Vehicles() {
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({ placa: '', modelo: '', tarifaDiaria: 0, tipo: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchVehiculos = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/vehiculos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVehiculos(res.data);
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    try {
      await api.post('/vehiculos',  { placa: formData.placa, modelo: formData.modelo, tarifaDiaria: 70000, tipo: formData.tipo }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ placa: '', modelo: '', tarifaDiaria: 0, tipo: '' });
      setShowForm(false);
      fetchVehiculos();
      alert('✅ Vehículo creado');
    } catch {
      alert('❌ Error al crear vehículo');
    }
  };

  return (
    <div className="container">
      <h2>Vehículos</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Crear Vehículo'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Placa"
            value={formData.placa}
            onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Modelo"
            value={formData.modelo}
            onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
            required
          />

          <input
          type="number"
          placeholder="tarifaDiaria"
          value={formData.tarifaDiaria}
          onChange={(e) => setFormData({ ...formData, tarifaDiaria: e.target.value })}
          required
          />
          
          <input
            type="text"
            placeholder="Tipo (ej: moto, carro)"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            required
          />
          <button type="submit">Guardar</button>
        </form>
      )}

      <ul style={{ marginTop: '1rem' }}>
        {vehiculos.map(v => (
          <li key={v._id}>{v.placa} - {v.modelo} ({v.tipo})</li>
        ))}
      </ul>
    </div>
  );
}

export default Vehicles;
