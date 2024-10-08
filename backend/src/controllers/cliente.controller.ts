import { Request, Response, NextFunction } from 'express';
import clienteRepository from '../repositories/cliente.repository';
import { getUserFromToken } from '../services/user.services';

// sanitizacion middleware
// function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
//   req.body.sanitizedCliente = {
//     clienteId: req.body.nroCliente,
//     nombre: req.body.nombre,
//     mail: req.body.mail,
//     telefono: req.body.telefono,
//     direccion: req.body.direccion,
//     localidad: req.body.localidad,
//     provincia: req.body.provincia,
//   };

//   //nos quedamos con los elementos que son not null para el patch
//   Object.keys(req.body.sanitizedCliente).forEach((key) => {
//     if (req.body.sanitizedCliente[key] === undefined) {
//       delete req.body.sanitizedCliente[key];
//     }
//   });
//   next();
// }

// obtener todos los clientes
const getClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    // agregar error si usuario no esta en el token...
    console.log(user?.usuarioId);
    const clientes = await clienteRepository.getClientes(user?.usuarioId || 0);
    res.status(200).json(clientes);
  } catch (error) {
    console.error(error); // Log para entender el error
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

// // obtener un cliente
const getCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    //  const usuarioId = parseInt(req.params.usuarioId, 10);
    //const clienteId = parseInt(req.params.clienteId, 10);
    // Obtenemos el usuario desde el token

    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    console.log(user);
    res.status(200).json({});
    return;
    // const cliente = await clienteRepository.getCliente(clienteId, usuarioId);

    //res.status(200).json(cliente);
  } catch (error) {
    console.error(error); // Log para entender el error
    res.status(500).json({ message: 'Error al obtener un cliente' });
  }
};

// Crear cliente
const createCliente = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const {
    clienteNombre,
    clienteEmail,
    clienteTelefono,
    clienteDireccion,
    clienteLocalidad,
    clienteProvincia,
  } = req.body;

  if (!clienteNombre) {
    res.status(400).json({ message: 'El nombre es requerido' });
    return;
  }

  const existeNombre = await clienteRepository.getClienteByName(
    clienteNombre,
    usuarioId
  );

  if (existeNombre && existeNombre.clienteNombre === clienteNombre) {
    res.status(400).json({ message: 'Ya existe un cliente con ese nombre' });
    return;
  }

  try {
    const newCliente = await clienteRepository.createCliente(
      usuarioId,
      clienteNombre,
      clienteEmail,
      clienteTelefono,
      clienteDireccion,
      clienteLocalidad,
      clienteProvincia
    );
    res.status(201).json(newCliente);
  } catch (error) {
    console.error(error); // Log para entender el error
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

// modificar cliente
const updateCliente = async (req: Request, res: Response): Promise<void> => {
  const clienteId = parseInt(req.params.clienteId, 10);
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const {
    clienteNombre,
    clienteEmail,
    clienteTelefono,
    clienteDireccion,
    clienteLocalidad,
    clienteProvincia,
  } = req.body;

  try {
    // Obtenemos el cliente actual por su ID
    const clienteActual = await clienteRepository.getCliente(
      clienteId,
      usuarioId
    );

    if (!clienteActual) {
      res.status(404).json({ message: 'Cliente no encontrado' });
      return;
    }

    // Si el nombre ha cambiado, validamos que no exista otro cliente con el mismo nombre
    if (clienteActual && clienteNombre !== clienteActual.clienteNombre) {
      const existeNombre = await clienteRepository.getClienteByName(
        clienteNombre,
        usuarioId
      );

      if (existeNombre) {
        res
          .status(400)
          .json({ message: 'Ya existe un cliente con ese nombre' });
        return;
      }
    }

    // Realizamos la actualización solo con los campos que se enviaron
    const updatedCliente = await clienteRepository.updateCliente(clienteId, {
      clienteNombre: clienteNombre || clienteActual.clienteNombre, // Si no se envía un nuevo nombre, mantenemos el nombre actual
      clienteEmail,
      clienteTelefono,
      clienteDireccion,
      clienteLocalidad,
      clienteProvincia,
    });

    // Retornar la respuesta exitosa
    res.status(200).json(updatedCliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

// borrar un cliente
const deleteCliente = async (req: Request, res: Response): Promise<void> => {
  const { clienteId } = req.params;

  try {
    const clienteEliminado = await clienteRepository.deleteCliente(
      parseInt(clienteId)
    );

    if (clienteEliminado) {
      res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};

export const controller = {
  // sanitizeClienteInput,
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
};