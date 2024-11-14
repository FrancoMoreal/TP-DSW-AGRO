import { useState, useEffect } from 'react';
import { Campo } from '../types/Campo';
import ClienteService from '../services/ClienteService';

const useCampos = (clienteId: string) => {
  const [campos, setCampos] = useState<Campo[]>([]);

  useEffect(() => {
    const fetchCampos = async () => {
      if (!clienteId) return;
      try {
        const response = await ClienteService.getAllCamposByClienteId(clienteId);
        console.log(response);
        // Agregar manejo de errores

        /* 
      
        esto esta devolviendo un objeto  

        {  datadelcliente , campos:Campo[] }
      
      
      */
        // @ts-expect-error
        setCampos(response.data.campos);
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
