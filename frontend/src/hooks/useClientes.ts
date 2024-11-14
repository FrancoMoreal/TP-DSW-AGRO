import { useState, useEffect } from 'react';
import { Cliente } from '../models/Cliente.ts';
import ClienteService from '../services/ClienteService';

const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await ClienteService.getAllClientes();

      setClientes(response.data);
    };
    fetchClientes();
  }, []);

  return { clientes };
};

export default useClientes;
