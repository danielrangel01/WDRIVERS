import { useState } from 'react';
import api from '../services/api';

function PagoPSEConductor({ vehiculoId, usuarioId }) {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePSEPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await api.post(
        '/pagoswompi/iniciar',
        { monto: parseInt(monto), vehiculoId, usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { url } = res.data;
      window.location.href = url; // Redirigir a Wompi
    } catch (err) {
      alert('Error al iniciar pago con Wompi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3>💳 Pago PSE con Wompi</h3>
      <form onSubmit={handlePSEPayment}>
        <input
          type="number"
          placeholder="Monto a pagar"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Pagar con PSE'}
        </button>
      </form>
    </div>
  );
}

export default PagoPSEConductor;
