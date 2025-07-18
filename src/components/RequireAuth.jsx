import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const userName = localStorage.getItem('userName');
  return userName ? children : <Navigate to="/login" />;
}
