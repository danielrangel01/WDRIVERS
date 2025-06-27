// File: /frontend/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Navbar.css';


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user || location.pathname === '/login') return null;

  {user?.role === 'conductor' && (
  <li></li>
)}


  return (
    <nav className="navbar">
      
      {user.role === 'admin' && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/vehiculos">Vehículos</Link>
          <Link to="/actividad">Actividad</Link>
          <Link to="/reportes">Reportes</Link>
          <Link to="/gastos/agregar">Gastos</Link>
          <Link to="/gastos/lista">Ver Gastos</Link>
          <Link to="/pagos-pendientes">Pagos Pendientes</Link>
          
        </>
      )}
      {user.role === 'conductor' && <><Link to="/conductor">PAGO</Link> <Link to="/historial">Mis pagos</Link> <Link to="/mis-deudas">📅 Mis Deudas</Link></>}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
}

export default Navbar;
