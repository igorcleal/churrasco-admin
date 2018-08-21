import { Condominio } from "app/model/condominio";

export class Usuario {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    condominio: Condominio;
    dataCadastro = new Date();

    getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
    }
}
