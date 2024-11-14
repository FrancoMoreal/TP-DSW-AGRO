import { Cliente } from "./Cliente.ts";

export interface Campo {
campoId: number;
clienteId: number;
campoNombre: string;
campoUbicacion: string;
createdAt: string;
updatedAt: string;
cliente: Cliente;
}