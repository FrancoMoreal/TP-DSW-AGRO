import { AxiosResponse } from 'axios';

import HttpClient from './axiosInstance';
import { Lote } from '../models/Lote.ts';

class LoteService {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  getAllLotesByCampoId(campoId: string): Promise<AxiosResponse<Lote[]>> {
    return HttpClient.get<Lote[]>(`${this.path}/${campoId}`);
  }

  createLoteByCampo(campoId: number, loteCreation: Partial<Lote> ): Promise<AxiosResponse<Lote>> {
    return HttpClient.post<Lote>(`${this.path}/${campoId}`, loteCreation);
  }
}

export default new LoteService('/lotes');

// `http://localhost:3000/api/lotes/${campo}`
