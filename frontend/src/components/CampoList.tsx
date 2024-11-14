import React, { useEffect, useState } from 'react';
import { Campo } from '../types/Campo';
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
} from '@mui/material';
import ClienteService from '../services/ClienteService';

interface CamposListProps {
  clienteId: string;
}

const CamposList: React.FC<CamposListProps> = ({ clienteId }) => {
  const [campos, setCampos] = useState<Campo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState<number>(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Elementos por página

  useEffect(() => {
    const fetchCampos = async () => {
      try {
        setLoading(true);
        const response = await ClienteService.getAllCamposByClienteId(clienteId);

        console.log('Response:', response);
        // Verificar si la respuesta tiene un campo "campos"
        if (response.data.campos && Array.isArray(response.data.campos)) {
          setCampos(response.data.campos); // Establecer los datos de los campos
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

    fetchCampos();
  }, [clienteId]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant='h6' color='primary' gutterBottom>
          Listado de Campos
        </Typography>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
