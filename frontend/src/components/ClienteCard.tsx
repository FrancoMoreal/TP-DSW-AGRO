import { Card, CardContent, Typography, Box } from '@mui/material';

interface ClienteData {
  clienteId: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  clienteDireccion: string;
  clienteLocalidad: string;
  clienteProvincia: string;
}

interface ClienteCardProps {
  cliente: ClienteData;
}

const ClienteCard: React.FC<ClienteCardProps> = ({ cliente }) => {
  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant='h6' color='primary' gutterBottom>
          Información del Cliente
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='textSecondary'>
            Nombre:
          </Typography>
          <Typography variant='body1'>{cliente.clienteNombre}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='textSecondary'>
            Email:
          </Typography>
          <Typography variant='body1'>{cliente.clienteEmail}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='textSecondary'>
            Teléfono:
          </Typography>
          <Typography variant='body1'>{cliente.clienteTelefono}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='textSecondary'>
            Dirección:
          </Typography>
          <Typography variant='body1'>{cliente.clienteDireccion}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='textSecondary'>
            Localidad:
          </Typography>
          <Typography variant='body1'>{cliente.clienteLocalidad}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='textSecondary'>
            Provincia:
          </Typography>
          <Typography variant='body1'>{cliente.clienteProvincia}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClienteCard;
