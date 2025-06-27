import { useEffect, useState } from 'react';
import api from '../services/api';

function AgregarGasto() {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [vehiculosList, setVehiculosList] = useState([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/vehiculos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehiculosList(res.data);
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
      alert('✅ Gasto registrado');
      setMonto('');
      setDescripcion('');
      setVehiculo('');
    } catch (err) {
        console.log(err);
        alert('❌ Error al registrar gasto');
    }
  };

  return (
    <div className="container">
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
