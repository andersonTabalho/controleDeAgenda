import { usuario } from "./usuario"

export interface objectUsuario {
    message: string;
    object: {
      tipos: [
        string
      ];
      usuario: usuario;
    }
  }