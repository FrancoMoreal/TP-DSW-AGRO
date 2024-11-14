import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { Cliente } from '../types/Cliente';
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';
import NuevoCliente from '../components/NuevoCliente';
import ActualizarCliente from '../components/ActualizarCliente';

import { useNavigate } from 'react-router-dom';
import ClienteService from '../services/ClienteService';
import NotificationService from '../utils/NotificationService';

const MisClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const navigate = useNavigate();
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEdit = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setOpenEditModal(true);
  };

  const handleUpdateCliente = (updatedCliente: Cliente) => {
    (async () => {
      try {
        await ClienteService.updateCliente(updatedCliente.clienteId, updatedCliente);
        fetchClientes();
        NotificationService.info('Cliente actualizado correctamente');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el cliente';
        NotificationService.error(errorMessage);
        console.log('Error al actualizar el cliente:', error);
      } finally {
        setOpenEditModal(false);
      }
    })();
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await ClienteService.getAllClientes();

      // Si es correcto, asignamos los clientes a la variable de estado
      setClientes(response.data);

      //  NotificationService.info('Clientes cargados correctamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los clientes';

      NotificationService.error(errorMessage);
      console.error('Error al cargar los clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clienteId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await ClienteService.deleteCliente(clienteId);

        NotificationService.info('Cliente eliminado exitosamente');

        fetchClientes();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el cliente';
        NotificationService.error(errorMessage);
        console.error('Error al eliminar el cliente:', error);
      }
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }
  const handleViewCliente = (clienteId: number) => {
    navigate(`/app/mis-clientes/${clienteId}`);
  };

  return (
    <TableContainer component={Paper} sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant='h6' component='div'>
          Lista de Clientes
        </Typography>
        <Button variant='contained' color='primary' onClick={handleOpenModal} sx={{ marginRight: 2 }}>
          Cliente <Add />
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Localidad</TableCell>
            <TableCell>Provincia</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.clienteId}>
              <TableCell>{cliente.clienteNombre}</TableCell>
              <TableCell>{cliente.clienteEmail}</TableCell>
              <TableCell>{cliente.clienteTelefono}</TableCell>
              <TableCell>{cliente.clienteDireccion}</TableCell>
              <TableCell>{cliente.clienteLocalidad}</TableCell>
              <TableCell>{cliente.clienteProvincia}</TableCell>
              <TableCell>
                <Stack direction='row' spacing={1}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleEdit(cliente)}
                    sx={{
                      minWidth: '40px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleDelete(cliente.clienteId)}
                    sx={{
                      minWidth: '40px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Delete />
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleViewCliente(cliente.clienteId)}
                    sx={{
                      minWidth: '40px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Visibility />
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <NuevoCliente open={openModal} onClose={handleCloseModal} onClienteCreado={fetchClientes} />
      <ActualizarCliente
        cliente={clienteSeleccionado}
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleUpdateCliente}
      />
    </TableContainer>
  );
};

export default MisClientes;
