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
import { Cliente } from '../types/Cliente';

interface ActualizarClienteProps {
  cliente: Cliente | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedCliente: Cliente) => void;
}

const ActualizarCliente: React.FC<ActualizarClienteProps> = ({
  cliente,
  open,
  onClose,
  onSave,
}) => {
  const [formValues, setFormValues] = useState<Cliente | null>(null);

  useEffect(() => {
    // Inicializa los valores del formulario con el cliente seleccionado cuando se abra el modal
    if (cliente) {
      setFormValues(cliente);
    }
  }, [cliente]);

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
      <DialogTitle>Actualizar Cliente</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label='Nombre'
              name='clienteNombre'
              fullWidth
              required
              value={formValues?.clienteNombre || ''}
              onChange={handleChange}
            />
            <TextField
              label='Email'
              name='clienteEmail'
              fullWidth
              required
              type='email'
              value={formValues?.clienteEmail || ''}
              onChange={handleChange}
            />
            <TextField
              label='Teléfono'
              name='clienteTelefono'
              fullWidth
              required
              value={formValues?.clienteTelefono || ''}
              onChange={handleChange}
            />
            <TextField
              label='Dirección'
              name='clienteDireccion'
              fullWidth
              required
              value={formValues?.clienteDireccion || ''}
              onChange={handleChange}
            />
            <TextField
              label='Localidad'
              name='clienteLocalidad'
              fullWidth
              required
              value={formValues?.clienteLocalidad || ''}
              onChange={handleChange}
            />
            <TextField
              label='Provincia'
              name='clienteProvincia'
              fullWidth
              required
              value={formValues?.clienteProvincia || ''}
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

export default ActualizarCliente;
