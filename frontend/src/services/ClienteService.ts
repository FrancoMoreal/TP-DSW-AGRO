import { AxiosResponse } from 'axios';
import { Cliente } from '../models/Cliente.ts';
import HttpClient from './axiosInstance';
import { Campo } from '../models/Campo.ts';

class ClienteService {
  path: string;

  constructor(path: string) {
    this.path = path;
  }
  getClienteById(clienteId: string): Promise<AxiosResponse<Cliente>> {
    return HttpClient.get<Cliente>(`${this.path}/${clienteId}`);
  }
  getAllClientes(): Promise<AxiosResponse<Cliente[]>> {
    return HttpClient.get<Cliente[]>(`${this.path}/misClientes`);
  }

  getAllCamposByClienteId(clienteId: string): Promise<AxiosResponse<Campo[]>> {
    return HttpClient.get<Campo[]>(`${this.path}/${clienteId}/campos`);
  }

  createCliente(nuevoCliente: Partial<Cliente>): Promise<AxiosResponse<Cliente>> {
    return HttpClient.post<Cliente>(`${this.path}`, nuevoCliente);
  }
  updateCliente(clienteId: number, updatedCliente: Cliente): Promise<AxiosResponse<Cliente>> {
    return HttpClient.put<Cliente>(`${this.path}/${clienteId}`, updatedCliente);
  }
  deleteCliente(clienteId: number): Promise<AxiosResponse<void>> {
    return HttpClient.delete<void>(`${this.path}/${clienteId}`);
  }
}

export default new ClienteService('/clientes');
// `http://localhost:3000/api/clientes/${clienteId}/campos`,

// `http://localhost:3000/api/campos/cliente/{id}`, GEt by cliente
// `http://localhost:3000/api/campos/`, get all
