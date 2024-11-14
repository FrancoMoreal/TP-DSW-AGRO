import { Lote } from "./Lote.ts";

export type OrdenTrabajo = {
  nroOrdenTrabajo: number;
  fecha: string; // o Date, según prefieras manejar el formato
  costototal: number;
  loteId: number;
  tipo: "cosecha" | "siembra" | "fumigacion";
  Cosecha?: Cosecha;
  Siembra?: Siembra;
  Fumigacion?: Fumigacion;
  lote: Lote;
};

export type Cosecha = {
  rendimiento: number;
  precio: number;
};

export type Siembra = {
  variedad: string;
  kilos: number;
  precio: number;
};

export type Fumigacion = {
  producto: string;
  dosis: number;
  precio: number;
};
