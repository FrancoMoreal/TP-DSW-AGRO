import { Box } from '@mui/material';
import SideBar from '../components/SideBar';
import { NavBar } from './NavBar';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export const AppLayout: React.FC<{}> = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const showSideBar = isAuthenticated && location.pathname !== '/';
  return (
    <div>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {showSideBar && <SideBar />}
        {/* Contenedor principal que incluye el Sidebar y el contenido, debajo de la NavBar */}
        <div
          style={{
            display: 'flex',
            marginTop: '64px',

            height: 'calc(100vh - 64px)',
            width: '100%',
          }}
        >
          <Outlet />
        </div>
      </Box>
      <Footer />
    </div>
  );
};
