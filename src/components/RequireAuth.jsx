import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  //const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;


  return children;
}

export default RequireAuth;