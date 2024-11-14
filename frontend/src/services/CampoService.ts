// import { AxiosResponse } from 'axios';
// import { Campo } from '../types/Campo';
// import HttpClient from './axiosInstance';

class CampoService {
  path: string;

  constructor(path: string) {
    this.path = path;
  }
}

export default new CampoService('/clientes');

// `http://localhost:3000/api/clientes/${clienteId}/campos`
