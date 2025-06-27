import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={btnStyle}>
      Cerrar sesión
    </button>
  );
}

const btnStyle = {
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default LogoutButton;
