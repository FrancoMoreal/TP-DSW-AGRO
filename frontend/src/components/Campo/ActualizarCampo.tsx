import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Campo } from '../../models/Campo.ts';

interface ActualizarCampoProps {
  campo: Campo | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedCampo: Campo) => void;
}

const ActualizarCampo: React.FC<ActualizarCampoProps> = ({
  campo,
  open,
  onClose,
  onSave,
}) => {
  const [formValues, setFormValues] = useState<Campo | null>(null);

  useEffect(() => {
    // Inicializa los valores del formulario con el campo seleccionado cuando se abra el modal
    if (campo) {
      setFormValues(campo);
    }
  }, [campo]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (formValues) {
      const { name, value } = event.target;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (formValues) {
      onSave(formValues);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Actualizar Campo</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label='Nombre'
              name='campoNombre'
              fullWidth
              required
              value={formValues?.campoNombre || ''}
              onChange={handleChange}
            />
            <TextField
              label='Ubicación'
              name='campoUbicacion'
              fullWidth
              required
              value={formValues?.campoUbicacion || ''}
              onChange={handleChange}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActualizarCampo;
