import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  TablePagination,
} from '@mui/material';
import { useOrdenesTrabajo } from '../hooks/useOrdenesTrabajo';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const OrdenesTrabajoList: React.FC = () => {
  const { ordenes, loading, error } = useOrdenesTrabajo();
  const [orderAsc, setOrderAsc] = useState(true); // Estado para controlar el orden de la lista
  const [filterType, setFilterType] = useState(''); // Estado para el tipo de filtro

  // Paginación
  const [page, setPage] = useState<number>(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Elementos por página

  if (loading) return <CircularProgress />;
  if (error) return <Typography color='error'>{error}</Typography>;

  // Filtrar ordenes por tipo si se selecciona uno
  const filteredOrdenes = filterType ? ordenes.filter((orden) => orden.tipo === filterType) : ordenes;

  // Ordenar las ordenes filtradas por fecha, ascendente o descendente según el estado
  const sortedOrdenes = [...filteredOrdenes].sort((a, b) => {
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    return orderAsc ? dateA - dateB : dateB - dateA;
  });

  // Alterna el orden entre ascendente y descendente
  const toggleOrder = () => {
    setOrderAsc(!orderAsc);
  };

  // Maneja el cambio de filtro con el tipo de evento especificado
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  // Maneja el cambio de página
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Maneja el cambio de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volver a la primera página cuando se cambian los elementos por página
  };

  // Paginación de las órdenes
  const paginatedOrdenes = sortedOrdenes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant='h6' component='div'>
          Mis Trabajos
        </Typography>
        <FormControl variant='outlined' size='small' sx={{ minWidth: 150, ml: 2 }}>
          <InputLabel shrink>Filtrar por Tipo</InputLabel>
          <Select value={filterType} onChange={handleFilterChange} label='Filtrar por Tipo'>
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='cosecha'>Cosecha</MenuItem>
            <MenuItem value='siembra'>Siembra</MenuItem>
            <MenuItem value='fumigacion'>Fumigación</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#555' }}>
              Fecha
              <IconButton onClick={toggleOrder} size='small'>
                {orderAsc ? <ArrowUpward fontSize='small' /> : <ArrowDownward fontSize='small' />}
              </IconButton>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#555' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#555' }}>Cliente</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#555' }}>Campo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#555' }}>Lote</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#555' }}>Detalles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedOrdenes.map((orden) => (
            <TableRow key={orden.nroOrdenTrabajo} sx={{ height: '40px' }}>
              <TableCell sx={{ fontSize: '0.9rem', color: '#333' }}>{new Date(orden.fecha).toLocaleDateString()}</TableCell>
              <TableCell sx={{ fontSize: '0.9rem', color: '#333' }}>{orden.tipo}</TableCell>
              <TableCell sx={{ fontSize: '0.9rem', color: '#333' }}>{orden.lote?.campo?.cliente?.clienteNombre || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.9rem', color: '#333' }}>{orden.lote?.campo?.campoNombre || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.9rem', color: '#333' }}>{orden.lote?.loteNro || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.9rem', color: '#333' }}>
                {orden.tipo === 'cosecha' && orden.Cosecha && (
                  <div>
                    <p>Rendimiento: {orden.Cosecha.rendimiento}</p>
                    <p>Precio: {orden.Cosecha.precio}</p>
                  </div>
                )}
                {orden.tipo === 'siembra' && orden.Siembra && (
                  <div>
                    <p>Variedad: {orden.Siembra.variedad}</p>
                    <p>Kilos: {orden.Siembra.kilos}</p>
                    <p>Precio: {orden.Siembra.precio}</p>
                  </div>
                )}
                {orden.tipo === 'fumigacion' && orden.Fumigacion && (
                  <div>
                    <p>Producto: {orden.Fumigacion.producto}</p>
                    <p>Dosis: {orden.Fumigacion.dosis}</p>
                    <p>Precio: {orden.Fumigacion.precio}</p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación Fija */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Opciones para cambiar el número de elementos por página
        component='div'
        count={sortedOrdenes.length} // Total de elementos
        rowsPerPage={rowsPerPage} // Elementos por página
        page={page} // Página actual
        onPageChange={handleChangePage} // Cambiar de página
        onRowsPerPageChange={handleChangeRowsPerPage} // Cambiar el número de elementos por página
        sx={{
          position: 'sticky',
          bottom: 0, // Fijar la paginación al fondo
          backgroundColor: 'white', // Asegurarse que el fondo sea blanco para que no se vea el contenido debajo
          zIndex: 1, // Asegurarse de que la paginación quede encima del resto del contenido
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-select, & .MuiTablePagination-actions': {
            fontSize: '0.875rem',
          },
        }}
      />
    </TableContainer>
  );
};

export default OrdenesTrabajoList;
