import { Usuario } from 'app/model/usuario';
import { Sala } from './sala';
export class ReservaSala {
    id: string;
    dataReserva: string;
    horaInicial: number;
    dataCriacao: Date;
    usuario: Usuario;
    sala: Sala;
    ativo = true;
}
