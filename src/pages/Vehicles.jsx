import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertaGlobal from '../components/AlertaGlobal';

function Vehicles() {
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({ placa: '', modelo: '', tarifaDiaria: '', tipo: '' });
  const [showForm, setShowForm] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, message: '', severity: 'info' });

  const mostrarAlerta = (message, severity = 'info') => {
    setAlerta({ open: true, message, severity });
  };

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
      await api.post(
        '/vehiculos',
        { 
          placa: formData.placa, 
          modelo: formData.modelo, 
          tarifaDiaria: parseInt((formData.tarifaDiaria + '').replace(/\./g, "")) || 0, 
          tipo: formData.tipo 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFormData({ placa: '', modelo: '', tarifaDiaria: '', tipo: '' });
      setShowForm(false);
      fetchVehiculos();
      mostrarAlerta('✅ Vehículo creado', 'success');
    } catch {
      mostrarAlerta('❌ Error al crear vehículo', 'error');
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
            type="text"
            inputMode="numeric"
            placeholder="Tarifa diaria"
            value={formData.tarifaDiaria}
            onChange={e =>
              setFormData({
                ...formData,
                tarifaDiaria: e.target.value
                  .replace(/[^\d]/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              })
            }
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
