// NuevoCliente.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import NotificationService from '../utils/NotificationService';
import ClienteService from '../services/ClienteService';

interface NuevoClienteProps {
  open: boolean;
  onClose: () => void;
  onClienteCreado: () => void;
}

interface FormValues {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  provincia: string;
}

const NuevoCliente: React.FC<NuevoClienteProps> = ({ open, onClose, onClienteCreado }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    localidad: '',
    provincia: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Llamada a la API mediante ClienteService
      const response = await ClienteService.createCliente({
        clienteNombre: formValues.nombre,
        clienteEmail: formValues.email,
        clienteTelefono: formValues.telefono,
        clienteDireccion: formValues.direccion,
        clienteLocalidad: formValues.localidad,
        clienteProvincia: formValues.provincia,
      });

      if (response.status !== 201) {
        setError('Error al crear cliente');
        NotificationService.error('Error al crear el cliente');
        return;
      }

      setSuccess('Cliente creado con éxito');
      NotificationService.info('Cliente creado con éxito');
      setFormValues({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        localidad: '',
        provincia: '',
      });
      onClienteCreado();
      onClose();
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor');
      NotificationService.error('Error al conectar con el servidor');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Crear Nuevo Cliente</DialogTitle>
      <DialogContent>
        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label='Nombre' name='nombre' fullWidth required value={formValues.nombre} onChange={handleChange} />
            <TextField label='Email' name='email' fullWidth required type='email' value={formValues.email} onChange={handleChange} />
            <TextField label='Teléfono' name='telefono' fullWidth required value={formValues.telefono} onChange={handleChange} />
            <TextField label='Dirección' name='direccion' fullWidth required value={formValues.direccion} onChange={handleChange} />
            <TextField label='Localidad' name='localidad' fullWidth required value={formValues.localidad} onChange={handleChange} />
            <TextField label='Provincia' name='provincia' fullWidth required value={formValues.provincia} onChange={handleChange} />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Guardar Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NuevoCliente;
