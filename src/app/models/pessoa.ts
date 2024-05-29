import { endereco } from "./endereco";
import { foto } from "./foto";

export interface pessoa {
  cpf: string;
  endereco: endereco;
  foto?: foto;
  id?: number;
  nome: string;
}
