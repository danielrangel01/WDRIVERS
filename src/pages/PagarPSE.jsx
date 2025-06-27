import { useState } from 'react';
import api from '../services/api';

function Pagar() {
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('pse');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (metodo === 'pse') {
      const res = await api.post('/solicitar-pago', { monto }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.checkoutUrl; // redirección a Wompi
    } else {
      await api.post('/pagos-manual', { monto }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Pago enviado para aprobación del administrador');
      setMonto('');
    }
  };

  return (
    <div className="container">
      <h2>Realizar Pago</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Monto del pago"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />

        <div style={{ margin: '1rem 0' }}>
          <label>
            <input
              type="radio"
              name="metodo"
              value="pse"
              checked={metodo === 'pse'}
              onChange={() => setMetodo('pse')}
            />
            Pago con PSE
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="metodo"
              value="manual"
              checked={metodo === 'manual'}
              onChange={() => setMetodo('manual')}
            />
            Pago Manual (efectivo, otro medio)
          </label>
        </div>

        <button type="submit">Enviar Pago</button>
      </form>
    </div>
  );
}

export default Pagar;
