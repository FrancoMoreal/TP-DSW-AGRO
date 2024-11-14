import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Box, Container, Paper } from '@mui/material';
import ClienteCard from '../components/ClienteCard';
import ClienteService from '../services/ClienteService';
import NotificationService from '../utils/NotificationService';
import CampoList from '../components/CampoList';

interface ClienteData {
  clienteId: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  clienteDireccion: string;
  clienteLocalidad: string;
  clienteProvincia: string;
}

const ClientePage: React.FC = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);

        if (!clienteId) throw new Error('ID del cliente no especificado');

        const response = await ClienteService.getClienteById(clienteId);
        setCliente(response.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los datos del cliente';
        NotificationService.error(errorMessage);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId]);

  if (loading) {
    return <CircularProgress sx={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />;
  }

  if (!cliente) {
    return (
      <Typography color='error' variant='h6' sx={{ textAlign: 'center', marginTop: '20px' }}>
        No se encontraron datos para este cliente.
      </Typography>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ marginTop: 4 }}>
      {/* Contenedor Flex para ClienteCard y CampoList */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {/* Contenedor para el ClienteCard a la izquierda */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <ClienteCard cliente={cliente} />
          </Paper>
        </Box>

        {/* Contenedor para el CampoList a la derecha */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <CampoList clienteId={clienteId!} />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ClientePage;
