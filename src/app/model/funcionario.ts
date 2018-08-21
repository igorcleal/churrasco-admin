import { Profissao } from './profissao';
export class Funcionario {
    id: string;
    nome: string;
    email: string;
    dataCriacao: Date;
    profissao: Profissao;
    telefone: string;

    getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
    }
}
