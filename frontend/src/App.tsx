import { useNavigate } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AppRoutes } from './types/AppRoutes';
import NotificationService from './utils/NotificationService';
import { jwtDecode } from 'jwt-decode';
const App: React.FC = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null && token !== undefined && token !== '') {
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token expirado
          localStorage.removeItem('token');
          logout();
          navigate('/');
          NotificationService.error('Token ha expirado');
        } else {
          // Token valido
          login();
        }                                                        // TODO: arreglar condicion
      } catch (error) {
        // Token invalido
        localStorage.removeItem('token');
        logout();
        navigate('/');
        NotificationService.error('Token no válido');
      }
    } else {
      const currentPath = window.location.pathname;
      if (
        currentPath !== AppRoutes.REGISTER &&
        currentPath !== AppRoutes.LOGIN
      ) {
        navigate('/');
        // NotificationService.error('Token no encontrado');
      }
    }
  }, [login, logout, navigate]);

  return <AppRouter />;
};

export default App;
// VERIFICAR VENCIMIENTO DEL TOKEN (SI VENCE EL TOKEN,BORRAR EL TOKEN DEL LOCALSTORAGE Y QUE ME DESLOGEE)
