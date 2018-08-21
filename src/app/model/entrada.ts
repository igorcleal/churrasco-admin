import { Usuario } from './usuario';
export class Entrada {
    id: string;
    nome: string;
    data: string; // yyyy-mm-dd
    dataCriacao: Date = new Date();
    usuario: Usuario;
    ativo = true;

}
