import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, TextField, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {jwtDecode} from 'jwt-decode';
import { fetchUsuario, updateUsuario } from '../services/UserService';
import { Usuario } from '../models/Usuario.ts';

const UserProfile: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedEmail, setUpdatedEmail] = useState<string>('');
  const [updatedPassword, setUpdatedPassword] = useState<string>('');

  const decodeUserIdFromToken = (): number | null => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        interface DecodedToken {
          usuarioId: number;
        }
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        return decoded.usuarioId;
      }
      return null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const userId = decodeUserIdFromToken();
        if (userId) {
          const fetchedUsuario = await fetchUsuario(userId);
          setUsuario(fetchedUsuario);
          setUpdatedEmail(fetchedUsuario.usuarioEmail);
        } else {
          setError('Usuario no autenticado.');
        }
      } catch (err) {
        console.error('Error al obtener el usuario:', err);
        setError('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };
    loadUsuario();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (usuario) {
      try {
        const updatedUsuario = await updateUsuario(usuario.usuarioId, {
          usuarioEmail: updatedEmail,
          usuarioContraseña: updatedPassword,
        });
        setUsuario(updatedUsuario);
        setIsEditing(false);
      } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        setError('No se pudo actualizar el perfil.');
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>Perfil de Usuario</Typography>
        <IconButton 
          onClick={handleEditClick} 
          sx={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="edit"
        >
          <EditIcon />
        </IconButton>
        {usuario && (
          <Box>
            <Typography variant="h6">Nombre:</Typography>
            <Typography>{usuario.usuarioNombre}</Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>Correo Electrónico:</Typography>
            {isEditing ? (
              <TextField
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                fullWidth
                margin="dense"
              />
            ) : (
            <Typography>{usuario.usuarioEmail}</Typography>
          )}

            {isEditing && (
              <>
                <Typography variant="h6" sx={{ marginTop: 2 }}>Contraseña:</Typography>
                <TextField
                  type="password"
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ marginTop: 2 }}
                >
                  Guardar Cambios
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;