import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertaGlobal from '../components/AlertaGlobal';

function Conductor() {
  const [vehiculo, setVehiculo] = useState(null);
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('manual');
  const [comprobante, setComprobante] = useState(null);

  // Alertas MUI
  const [alerta, setAlerta] = useState({ open: false, message: '', severity: 'info' });
  const mostrarAlerta = (message, severity = 'info') => {
    setAlerta({ open: true, message, severity });
  };

  // Definir límites y tipos permitidos
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/conductor/vehiculo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehiculo(res.data);
      } catch {
        mostrarAlerta('❌ Error al cargar el vehículo', 'error');
      }
    };

    fetchVehiculo();
  
  }, []);

  // Nueva función para validar archivo
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setComprobante(null);
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      mostrarAlerta("Solo se permiten imágenes jpg, jpeg, png o webp.", "warning");
      e.target.value = "";
      setComprobante(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      mostrarAlerta("El archivo debe ser menor a 2 MB.", "warning");
      e.target.value = "";
      setComprobante(null);
      return;
    }
    setComprobante(file);
  };

  const registrarPago = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!vehiculo) {
      mostrarAlerta('❌ No tienes vehículo asignado', 'error');
      return;
    }
    if (!monto) {
      mostrarAlerta('❌ Ingresa un monto', 'warning');
      return;
    }

    try {
      if (metodo === 'pse') {
        const res = await api.post('/pagos/solicitar-pago', { monto }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.href = res.data.checkoutUrl;
      } else {
        if (!comprobante) {
          mostrarAlerta('Debes subir un comprobante.', 'warning');
          return;
        }
        const formData = new FormData();
        formData.append('monto', monto);
        formData.append('comprobante', comprobante);

        await api.post('/pagos/pagos-manual', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        mostrarAlerta('✅ Pago manual enviado. Esperando aprobación del administrador.', 'success');
        setMonto('');
        setComprobante(null);
      }
    } catch (err) {
      console.error(err);
      mostrarAlerta('❌ Error al registrar el pago', 'error');
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
                  disabled
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
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFile}
                  required
                />
                <small>Máx 2MB. Solo jpg, jpeg, png, webp.</small>
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
