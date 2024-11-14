import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import NotificationService from '../utils/NotificationService';

interface CampoModalProps {
  open: boolean;
  handleClose: () => void;
  onSave: (campoData: { campoNombre: string; campoUbicacion: string }) => void;
  clienteId: number;
}

const CampoModal: React.FC<CampoModalProps> = ({
  open,
  handleClose,
  onSave,
  clienteId,
}) => {
  const [campoNombre, setCampoNombre] = useState<string>('');
  const [campoUbicacion, setCampoUbicacion] = useState<string>('');

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/campos/${clienteId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ campoNombre, campoUbicacion }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear el campo:', errorData);
        throw new Error(errorData.message || 'Error al crear el campo');
      }

      const nuevoCampo = await response.json();
      onSave(nuevoCampo);

      NotificationService.info('Campo agregado exitosamente');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      NotificationService.error(
        error instanceof Error ? error.message : 'Error al crear el campo'
      );
    } finally {
      setCampoNombre('');
      setCampoUbicacion('');
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant='h6' component='h2'>
          Agregar Campo
        </Typography>
        <TextField
          fullWidth
          margin='normal'
          label='Nombre'
          value={campoNombre}
          onChange={(e) => setCampoNombre(e.target.value)}
        />
        <TextField
          fullWidth
          margin='normal'
          label='Ubicación'
          value={campoUbicacion}
          onChange={(e) => setCampoUbicacion(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default CampoModal;
