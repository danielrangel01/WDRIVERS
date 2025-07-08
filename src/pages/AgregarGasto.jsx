import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertaGlobal from '../components/AlertaGlobal';

function AgregarGasto() {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [vehiculosList, setVehiculosList] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, message: '', severity: 'info' });

  const mostrarAlerta = (message, severity = 'info') => {
    setAlerta({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchVehiculos = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get('/vehiculos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehiculosList(res.data);
      } catch {
        mostrarAlerta('❌ Error al cargar vehículos', 'error');
      }
    };
    fetchVehiculos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post(
        '/gastos',
        { monto, descripcion, vehiculo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarAlerta('✅ Gasto registrado', 'success');
      setMonto('');
      setDescripcion('');
      setVehiculo('');
    } catch (err) {
      console.log(err);
      mostrarAlerta('❌ Error al registrar gasto', 'error');
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
      <h2>Registrar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <label>Vehículo:</label>
        <select value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} required>
          <option value="">Seleccione</option>
          {vehiculosList.map((v) => (
            <option key={v._id} value={v._id}>
              {v.placa} - {v.modelo}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">Guardar Gasto</button>
      </form>
    </div>
  );
}

export default AgregarGasto;
