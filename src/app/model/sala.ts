export class Sala {
    id: string;
    nome: string;
    isPaga = false;
    dataCriacao: Date;
    ativo = true;
    diasPermitidos: Array<boolean> = [true, true, true, true, true, true, true];
}
