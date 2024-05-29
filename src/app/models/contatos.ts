import { pessoa } from "./pessoa";
import { usuario } from "./usuario";

export interface contato {
    email?: string;
    id?: number; 
    pessoa: pessoa;
    privado: boolean;
    tag: string;
    telefone?: string;
    tipoContato: string;
    usuario: usuario;
}
