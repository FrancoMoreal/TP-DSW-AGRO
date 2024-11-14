import { useState, useEffect } from 'react';
import { Campo } from '../models/Campo.ts';
import CampoService from '../services/CampoService';

const useCampos = (clienteId: string) => {
  const [campos, setCampos] = useState<Campo[]>([]);

  useEffect(() => {
    const fetchCampos = async () => {
      if (!clienteId) return;
      try {
        const response = await CampoService.getAllCamposByClienteId(clienteId);
        console.log(response);
        // Agregar manejo de errores

        /* 
      
        esto esta devolviendo un objeto  

        {  datadelcliente , campos:Campo[] }
      
      
      */
        
        setCampos(response.data);
      } catch (error) {
        console.error('Error al obtener campos:', error);
        // agregar manejo de errores
      }
    };

    fetchCampos();
  }, [clienteId]);

  return { campos, setCampos };
};

export default useCampos;
