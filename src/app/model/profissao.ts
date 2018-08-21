export class Profissao {
    id: string;
    nome: string;
    dataCriacao: Date;

    getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
    }
}