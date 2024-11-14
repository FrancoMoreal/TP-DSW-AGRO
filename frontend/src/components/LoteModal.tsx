import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import NotificationService from '../utils/NotificationService';
import { Lote } from '../types/Lote';
import LoteService from '../services/LoteService';

// export interface LoteData {
//   loteId?: number;
//   campoId: number;
//   loteNro: number;
//   loteHectareas: number;
// }

interface LoteModalProps {
  open: boolean;
  handleClose: () => void;
  onSave: (Lote: Lote) => void;
  campoId: number;
}

const LoteModal: React.FC<LoteModalProps> = ({ open, handleClose, onSave, campoId }) => {
  const [loteNro, setLoteNro] = useState<string>('');
  const [loteHectareas, setLoteHectareas] = useState<number>(0);

  const handleSave = async () => {
    // const token = localStorage.getItem('token');
    // const response = await fetch(`http://localhost:3000/api/lotes/${campoId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ loteNro, loteHectareas }),
    // });

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   console.error('Error al crear el lote:', errorData);
    //   throw new Error(errorData.message || 'Error al crear el lote');
    // }

    // const nuevoLote: Lote = await response.json();

    const creatingLote: Lote = {
      loteId: 0,
      campoId: 0,
      loteNro: Number(loteNro),
      loteHectareas: loteHectareas,
      // campo: undefined
    };

    LoteService.createLoteByCampo(campoId, creatingLote)
      .then((res) => {
        onSave(res.data);
        NotificationService.info('Lote agregado exitosamente');
      })
      .catch(() => {
        NotificationService.error('No se pudo crear el lote');
      })
      .finally(() => {
        setLoteNro('');
        setLoteHectareas(0);
        handleClose();
      });
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
          Agregar Lote
        </Typography>
        <TextField fullWidth margin='normal' label='Número de Lote' value={loteNro} onChange={(e) => setLoteNro(e.target.value)} />
        <TextField
          fullWidth
          margin='normal'
          label='Hectáreas'
          type='number'
          value={loteHectareas}
          onChange={(e) => setLoteHectareas(Number(e.target.value))}
        />
        <Button variant='contained' color='primary' onClick={handleSave} sx={{ mt: 2 }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default LoteModal;
