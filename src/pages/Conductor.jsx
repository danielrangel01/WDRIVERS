import { useEffect, useState } from 'react';
import api from '../services/api';

function Conductor() {
  const [vehiculo, setVehiculo] = useState(null);
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('pse');
  const [comprobante, setComprobante] = useState(null);

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/conductor/vehiculo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehiculo(res.data);
      } catch {
        alert('❌ Error al cargar el vehículo');
      }
    };

    fetchVehiculo();
  }, []);

  const registrarPago = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!vehiculo) return alert('❌ No tienes vehículo asignado');
    if (!monto) return alert('❌ Ingresa un monto');

    try {
      if (metodo === 'pse') {
        const res = await api.post('/pagos/solicitar-pago', { monto }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.href = res.data.checkoutUrl;
      } else {
        const formData = new FormData();
        formData.append('monto', monto);
        formData.append('comprobante', comprobante);

        await api.post('/pagos/pagos-manual', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        alert('✅ Pago manual enviado. Esperando aprobación del administrador.');
        setMonto('');
        setComprobante(null);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error al registrar el pago');
    }
  };

  return (
    <div className="container">
      <h2>Mi Vehículo</h2>

      {vehiculo ? (
        <div>
          <p><strong>Placa:</strong> {vehiculo.placa}</p>
          <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
          <p><strong>Tipo:</strong> {vehiculo.tipo}</p>

          <form onSubmit={registrarPago} style={{ marginTop: '1.5rem' }}>
            <input
              type="text"
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
                Pago Manual (con comprobante)
              </label>
            </div>

            {metodo === 'manual' && (
              <div style={{ marginBottom: '1rem' }}>
                <label>Sube tu comprobante de pago:</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setComprobante(e.target.files[0])}
                  required
                />
              </div>
            )}

            <button type="submit">Enviar Pago</button>
          </form>
        </div>
      ) : (
        <p>Cargando información del vehículo...</p>
      )}
    </div>
  );
}

export default Conductor;
