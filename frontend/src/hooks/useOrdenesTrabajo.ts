import { useEffect, useState } from 'react';
import axios from 'axios';
import { OrdenTrabajo } from '../models/OrdenTrabajo.ts';

export const useOrdenesTrabajo = () => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/ordenTrabajo', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setOrdenes(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener las órdenes de trabajo.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  return { ordenes, loading, error };
};
