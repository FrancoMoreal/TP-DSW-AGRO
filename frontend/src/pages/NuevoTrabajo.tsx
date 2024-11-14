import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CampoModal from '../components/CampoModal';
import LoteModal from '../components/LoteModal';
import useClientes from '../hooks/useClientes';
import useCampos from '../hooks/useCampos';
import useLotes from '../hooks/useLotes';
import { Lote } from '../types/Lote';
import LoteService from '../services/LoteService';
import NotificationService from '../utils/NotificationService';
import { Campo } from '../types/Campo';
import OrdenTrabajoService from '../services/OrdenTrabajoService';

interface DetalleTrabajo {
  rendimiento?: number;
  precio?: number;
  variedad?: string;
  kilos?: number;
  producto?: string;
  dosis?: number;
}

const MisTrabajos: React.FC = () => {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  const [campoId, setCampoId] = useState<string>('');
  const [lote, setLote] = useState<string>('');
  const [hectareas, setHectareas] = useState<number | ''>('');
  // const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>(
  //   []
  // );
  // const [campos, setCampos] = useState<Campo[]>([]);

  const [detalle, setDetalle] = useState<DetalleTrabajo>({});
  const [openCampoModal, setOpenCampoModal] = useState<boolean>(false);
  const [openLoteModal, setOpenLoteModal] = useState<boolean>(false);
  // const [mensaje, setMensaje] = useState<string>('');
  const [importe, setImporte] = useState<number>(0);

  const handleOpenCampoModal = () => setOpenCampoModal(true);

  const handleCloseCampoModal = () => {
    setOpenCampoModal(false);
  };

  const handleCampoSave = (campoData: { campoNombre: string; campoUbicacion: string }) => {
    // Solucion temporal para agregar un campo a la lista
    const nuevoCampo: Campo = {
      campoId: Math.random(),
      clienteId: parseInt(clienteId),
      campoNombre: campoData.campoNombre,
      campoUbicacion: campoData.campoUbicacion,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cliente: {} as any,
    };
    setCampos((prevCampos) => [...prevCampos, nuevoCampo]);
    NotificationService.info('Campo agregado exitosamente');
    handleCloseCampoModal();
  };
  const handleLoteSave = (nuevoLote: Lote) => {
    setLotes((prevLotes) => [...prevLotes, nuevoLote]); // Agrega el nuevo lote a la lista
    NotificationService.info('Lote agregado exitosamente');
  };

  const handleOpenLoteModal = () => setOpenLoteModal(true);
  const handleCloseLoteModal = () => setOpenLoteModal(false);

  const { clientes } = useClientes();
  const { campos, setCampos } = useCampos(clienteId);
  const { lotes, setLotes } = useLotes(campoId);

  const handleClienteChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const clienteId = event.target.value;
    setClienteId(clienteId);

    setCampoId('');
    setLotes([]);
  };

  const handleCampoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const campoId = event.target.value;
    setCampoId(campoId);
    LoteService.getAllLotesByCampoId(campoId)
      .then((res) => {
        setLotes(res.data);
      })
      .catch((e) => {
        console.log(e);
        NotificationService.error(`Error al buscar lotes para el campo con el id ${campoId}`);
      });
  };

  const handleLoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const loteId = event.target.value;
    setLote(loteId);

    const loteSeleccionado = lotes.find((lote) => lote.loteId === parseInt(loteId));
    if (loteSeleccionado) {
      setHectareas(loteSeleccionado.loteHectareas);
    } else {
      setHectareas('');
    }
  };

  useEffect(() => {
    // Calcula el importe cuando cambian el precio o las hectáreas
    const precio = detalle.precio || 0;
    const hectareasNumber = typeof hectareas === 'number' ? hectareas : 0;
    setImporte(precio * hectareasNumber);
  }, [detalle.precio, hectareas]);

  const handleTipoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTipo = event.target.value;
    setTipo(selectedTipo);
    setDetalle({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const ordenData = {
        fecha,
        tipo,
        loteId: lote,
        campoId,
        detalle,
      };

      const response = await OrdenTrabajoService.createOrdenTrabajo(ordenData);
      console.log('Response data:', response.data); //temporal para ver la respuesta
      NotificationService.info('Orden de trabajo creada exitosamente');
      setTimeout(() => {
        navigate('/app/home');
      }, 2000);
    } catch (error) {
      console.error('Error al crear la orden de trabajo:', error);
      NotificationService.error('Error al crear la orden de trabajo');
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 600,
          margin: 'auto',
          p: 3,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant='h4' gutterBottom>
          Nuevo Trabajo
        </Typography>
        <form noValidate autoComplete='off' onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label='Fecha'
              type='date'
              fullWidth
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField select label='Tipo' fullWidth value={tipo} onChange={handleTipoChange}>
              <MenuItem value='Cosecha'>Cosecha</MenuItem>
              <MenuItem value='Fumigacion'>Fumigación</MenuItem>
              <MenuItem value='Siembra'>Siembra</MenuItem>
            </TextField>

            {tipo === 'Cosecha' && (
              <>
                <TextField
                  label='Rendimiento'
                  type='number'
                  fullWidth
                  value={detalle.rendimiento || ''}
                  onChange={(e) =>
                    setDetalle({
                      ...detalle,
                      rendimiento: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  label='Precio'
                  type='number'
                  fullWidth
                  value={detalle.precio || ''}
                  onChange={(e) => setDetalle({ ...detalle, precio: Number(e.target.value) })}
                />
              </>
            )}

            {tipo === 'Siembra' && (
              <>
                <TextField
                  label='Variedad'
                  fullWidth
                  value={detalle.variedad || ''}
                  onChange={(e) => setDetalle({ ...detalle, variedad: e.target.value })}
                />
                <TextField
                  label='Kilos'
                  type='number'
                  fullWidth
                  value={detalle.kilos || ''}
                  onChange={(e) => setDetalle({ ...detalle, kilos: Number(e.target.value) })}
                />
                <TextField
                  label='Precio'
                  type='number'
                  fullWidth
                  value={detalle.precio || ''}
                  onChange={(e) => setDetalle({ ...detalle, precio: Number(e.target.value) })}
                />
              </>
            )}

            {tipo === 'Fumigacion' && (
              <>
                <TextField
                  label='Producto'
                  fullWidth
                  value={detalle.producto || ''}
                  onChange={(e) => setDetalle({ ...detalle, producto: e.target.value })}
                />
                <TextField
                  label='Dosis'
                  type='number'
                  fullWidth
                  value={detalle.dosis || ''}
                  onChange={(e) => setDetalle({ ...detalle, dosis: Number(e.target.value) })}
                />
                <TextField
                  label='Precio'
                  type='number'
                  fullWidth
                  value={detalle.precio || ''}
                  onChange={(e) => setDetalle({ ...detalle, precio: Number(e.target.value) })}
                />
              </>
            )}

            <TextField select label='Cliente' fullWidth value={clienteId} onChange={handleClienteChange}>
              {clientes.map((cliente) => (
                <MenuItem key={cliente.clienteId} value={cliente.clienteId}>
                  {cliente.clienteNombre}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', columnGap: '8px' }}>
              <TextField select label='Campo' fullWidth value={campoId} onChange={handleCampoChange} disabled={!clienteId}>
                {campos.map((campo) => (
                  <MenuItem key={campo.campoId} value={campo.campoId}>
                    {campo.campoNombre}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant='contained' color='secondary' onClick={handleOpenCampoModal}>
                {' '}
                +{' '}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', columnGap: '8px' }}>
              <TextField select label='Lote' fullWidth value={lote} onChange={handleLoteChange} disabled={!campoId}>
                {lotes?.map((lote) => (
                  <MenuItem key={lote.loteId} value={lote.loteId}>
                    {lote.loteNro}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant='contained'
                color='secondary'
                // onClick={() => console.log(lotes)}
                onClick={handleOpenLoteModal}
              >
                {' '}
                A{' '}
              </Button>
            </Box>

            <TextField label='Hectareas' type='number' fullWidth value={hectareas} disabled />

            <TextField label='Importe' type='number' fullWidth value={importe} disabled />

            <Button variant='contained' color='primary' type='submit'>
              Guardar Trabajo
            </Button>
          </Stack>
        </form>
      </Box>
      <CampoModal handleClose={handleCloseCampoModal} open={openCampoModal} onSave={handleCampoSave} clienteId={parseInt(clienteId)} />
      <LoteModal handleClose={handleCloseLoteModal} open={openLoteModal} onSave={handleLoteSave} campoId={parseInt(campoId)} />
    </>
  );
};

export default MisTrabajos;
