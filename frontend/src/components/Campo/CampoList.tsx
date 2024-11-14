import React, { useEffect, useState } from 'react';
import { Campo } from '../../types/Campo';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CampoService from '../../services/CampoService';
import NotificationService from '../../utils/NotificationService';
import ActualizarCampo from './ActualizarCampo';
import { Add } from '@mui/icons-material';
import NuevoCampo from './NuevoCampo';
import useConfirm from '../../hooks/useConfirm';
import ConfirmDialog from '../ConfirmDialog';

interface CamposListProps {
  clienteId: string;
}

const CamposList: React.FC<CamposListProps> = ({ clienteId }) => {
  const [campos, setCampos] = useState<Campo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [campoSeleccionado, setCampoSeleccionado] = useState<Campo | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const { isOpen, message, confirm, cancel, confirmAction } = useConfirm();

  // Paginación
  const [page, setPage] = useState<number>(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Elementos por página

  const fetchCampos = async () => {
    try {
      setLoading(true);
      const response = await CampoService.getAllCamposByClienteId(clienteId);

      console.log('Response:', response.data);
      // Verificar si la respuesta tiene un campo "campos"
      if (response.data && Array.isArray(response.data)) {
        setCampos(response.data); // Establecer los datos de los campos
      } else {
        throw new Error('Los campos no están en el formato esperado');
      }
    } catch (err) {
      console.error('Error al cargar los campos:', err);
      setError('Hubo un problema al cargar los campos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campo: Campo) => {
    setCampoSeleccionado(campo);
    setOpenEditModal(true);
  };

  const handleUpdateCampo = async (campoId: number, updatedCampo: Campo) => {
    try {
      // Llamada al servicio para actualizar el campo
      await CampoService.updateCampo(campoId, updatedCampo);

      // Notificación de éxito
      NotificationService.info('Campo actualizado exitosamente');

      // Actualizar la lista de campos localmente
      fetchCampos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el campo';
      NotificationService.error(errorMessage);
      console.error('Error al actualizar el campo:', error);
    } finally {
      setOpenEditModal(false);
    }
  };

  const handleDelete = async (campoId: number) => {
    const onConfirm = async () => {
      try {
        // Llamada al servicio para eliminar el campo
        await CampoService.deleteCampo(campoId);

        // Notificación de éxito
        NotificationService.info('Campo eliminado exitosamente');

        // Actualizar la lista de campos localmente
        fetchCampos();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el campo';
        NotificationService.error(errorMessage);
        console.error('Error al eliminar el campo:', error);
      }
    };
    confirm('¿Estás seguro de que deseas eliminar este campo?', onConfirm);
  };

  useEffect(() => {
    fetchCampos();
  }, [clienteId]);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volver a la primera página cuando se cambian los elementos por página
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error)
    return (
      <Typography color='error' sx={{ textAlign: 'center', marginTop: '20px' }}>
        {error}
      </Typography>
    );

  // Paginación de los campos
  const paginatedCampos = campos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ padding: 3, boxShadow: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant='h6' color='primary' gutterBottom>
          Listado de Campos
        </Typography>
        <Button variant='contained' color='primary' onClick={handleOpenModal} sx={{ marginRight: 2 }}>
          Campo <Add />
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ubicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCampos.map((campo) => (
              <TableRow key={campo.campoId}>
                <TableCell>{campo.campoNombre}</TableCell>
                <TableCell>{campo.campoUbicacion}</TableCell>
                <TableCell>
                  {/* Botón de edición */}
                  <IconButton onClick={() => handleEdit(campo)} color='primary'>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {/* Botón de eliminación */}
                  <IconButton onClick={() => handleDelete(campo.campoId)} color='error'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <NuevoCampo open={openModal} onClose={handleCloseModal} onCampoCreado={fetchCampos} clienteId={clienteId} />
        <ActualizarCampo
          campo={campoSeleccionado}
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onSave={(updatedCampo) => handleUpdateCampo(updatedCampo.campoId, updatedCampo)}
        />
      </TableContainer>

      {/* Modal reutilizable para confirmar la eliminación */}
      <ConfirmDialog
        open={isOpen}
        message={message}
        onClose={cancel} // Cierra el modal
        onConfirm={confirmAction} // Realiza la acción de confirmación
      />

      {/* Paginación */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5]} // Solo 5 elementos por página
          component='div'
          count={campos.length} // Total de elementos
          rowsPerPage={rowsPerPage} // Elementos por página
          page={page} // Página actual
          onPageChange={handleChangePage} // Cambiar de página
          onRowsPerPageChange={handleChangeRowsPerPage} // Cambiar el número de elementos por página
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-actions': {
              fontSize: '0.875rem',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default CamposList;
