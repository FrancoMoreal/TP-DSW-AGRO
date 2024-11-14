import { Request, Response } from "express";
import campoRepository from "../repositories/campo.repository";

// obtener todos los campos
const getCampos = async (req: Request, res: Response): Promise<void> => {
  try {
    const clienteId = parseInt(req.params.clienteId, 10);
    const campos = await campoRepository.getCampos(clienteId);
    res.status(200).json(campos);
  } catch (error) {
    console.error(error); // Log para entender el error
    res.status(500).json({ message: "Error al obtener campos" });
  }
};

// // obtener un campo
const getCampo = async (req: Request, res: Response): Promise<void> => {
  try {
    const campoId = parseInt(req.params.campoId, 10);
    //const clienteId = parseInt(req.params.clienteId, 10);

    const campo = await campoRepository.getCampo(campoId );

    res.status(200).json(campo);
  } catch (error) {
    console.error(error); // Log para entender el error
    res.status(500).json({ message: "Error al obtener un campo" });
  }
};

const createCampo = async (req: Request, res: Response): Promise<void> => {
  try {
    const clienteId = parseInt(req.params.clienteId, 10);
    const {  campoNombre, campoUbicacion } = req.body;

    if (!clienteId || !campoNombre) {
      res.status(400).json({ message: "El nombre es requerido" });
      return;
    }
  
    const existeNombre = await campoRepository.getCampoByName(campoNombre, clienteId);
  
    if (existeNombre && existeNombre.campoNombre === campoNombre) {
      res.status(400).json({ message: "Ya existe un campo con ese nombre" });
      return;
    }

    const newCampo = await campoRepository.createCampo(
      {clienteId, campoNombre, campoUbicacion}
    );
    res.status(201).json(newCampo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear campo" });
  }
};

// modificar campo
const updatecampo = async (req: Request, res: Response): Promise<void> => {
  const clienteId = parseInt(req.params.clienteId, 10);
  const  campoId  = parseInt(req.params.campoId, 10);
  const {campoNombre, campoUbicacion } = req.body;

  try {
    // Obtenemos el campo actual por su ID
    const campoActual = await campoRepository.getCampo(campoId);

    if (!campoActual) {
      res.status(404).json({ message: "campo no encontrado" });
      return;
    }

    // Realizamos la actualización solo con los campos que se enviaron
    const updatedcampo = await campoRepository.updateCampo(campoId, {
      
      campoNombre: campoNombre,
      campoUbicacion: campoUbicacion
    });

    // Retornar la respuesta exitosa
    res.status(200).json(updatedcampo);
  } catch (error) {
    console.error("Error al actualizar campo:", error);
    res.status(500).json({ message: "Error al actualizar campo" });
  }
};

// borrar un campo
const deletecampo = async (req: Request, res: Response): Promise<void> => {
  const { campoId } = req.params;

  try {
    const campoEliminado = await campoRepository.deleteCampo(
      parseInt(campoId)
    );

    if (campoEliminado) {
      res.status(200).json({ message: "campo eliminado correctamente" });
    } else {
      res.status(404).json({ message: "campo no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar campo:", error);
    res.status(500).json({ message: "Error al eliminar campo" });
  }
};

export const controller = {
  // sanitizecampoInput,
  getCampos,
  getCampo,
  createCampo,
  updatecampo,
  deletecampo,
};
