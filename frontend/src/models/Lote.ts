import { Campo } from './Campo.ts';

export interface Lote {
  loteId: number;
  campoId: number;
  loteNro: number;
  loteHectareas: number;
  campo?: Campo;
}
