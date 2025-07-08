// File: /frontend/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api'; // <-- asegúrate que lo tienes importado
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [noti, setNoti] = useState(0); // <--- NUEVO estado

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.role) {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      setUser(null);
    }
  }, [location]);

  // Nuevo useEffect para consultar notificaciones solo si es admin
  useEffect(() => {
    if (user?.role === "admin") {
      const token = localStorage.getItem("token");
      api.get("/actividad/notificaciones/no-leidas", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setNoti(res.data.noLeidas))
        .catch(() => setNoti(0));
    }
  }, [user, location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user || location.pathname === '/login') return null;

  // NO MODIFICAR TU CÓDIGO ACTUAL, SOLO SE AGREGA EL CONTADOR
  return (
    <nav className="navbar">
      {user.role === 'admin' && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/vehiculos">Vehículos</Link>
          <span style={{ position: "relative" }}>
            <Link to="/actividad">
              Actividad
              {noti > 0 && (
                <span style={{
                  position: "absolute",
                  top: -8,
                  right: -18,
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: 12,
                  padding: "2px 7px",
                  minWidth: 22,
                  textAlign: "center"
                }}>
                  {noti}
                </span>
              )}
            </Link>
          </span>
          <Link to="/deudas-admin">Deudas</Link>
          <Link to="/reportes">Reportes</Link>
          <Link to="/gastos/agregar">Gastos</Link>
          <Link to="/gastos/lista">Ver Gastos</Link>
          <Link to="/pagos-pendientes">Pagos Pendientes</Link>
        </>
      )}
      {user.role === 'conductor' && (
        <>
          <Link to="/conductor">PAGO</Link>
          <Link to="/historial">Mis pagos</Link>
          <Link to="/mis-deudas">📅 Mis Deudas</Link>
        </>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
}

export default Navbar;
