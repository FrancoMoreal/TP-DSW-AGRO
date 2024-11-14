// import { AxiosResponse } from 'axios';
// import { Campo } from '../types/Campo';
// import HttpClient from './axiosInstance';

import { AxiosResponse } from "axios";
import HttpClient from "./axiosInstance";
import { Campo } from "../models/Campo.ts";

class CampoService {
  path: string;

  constructor(path: string) {
    this.path = path;
  }
  getAllCamposByClienteId(clienteId: string): Promise<AxiosResponse<Campo[]>> {
    return HttpClient.get<Campo[]>(`${this.path}/${clienteId}`);
  }
  
  createCampo(clienteId: string, nuevoCampo: Partial<Campo>): Promise<AxiosResponse<Campo>> {
    return HttpClient.post<Campo>(`${this.path}/${clienteId}`, nuevoCampo);
  }

  updateCampo(campoId: number, updatedCampo: Campo): Promise<AxiosResponse<Campo>> {
    return HttpClient.put<Campo>(`${this.path}/${campoId}`, updatedCampo);
  }
  
  deleteCampo(campoId: number): Promise<AxiosResponse<void>> {
    return HttpClient.delete<void>(`${this.path}/${campoId}`);
  }
}

export default new CampoService('/campos');

