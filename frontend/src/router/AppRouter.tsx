import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../common/AppLayout';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import Register from '../pages/Register';
import { AppRoutes } from '../types/AppRoutes';
import MisClientes from '../pages/MisClientes';
import MisTrabajos from '../pages/MisTrabajos';
import NuevoTrabajo from '../pages/NuevoTrabajo';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.MIS_CLIENTES} element={<MisClientes />} />
        <Route path={AppRoutes.MIS_TRABAJOS} element={<MisTrabajos />} />
        <Route path={AppRoutes.NUEVO_TRABAJO} element={<NuevoTrabajo />} />
      </Route>
      <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
      <Route path={AppRoutes.REGISTER} element={<Register />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};
