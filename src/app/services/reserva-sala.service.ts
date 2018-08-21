import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Collections } from './../utils/collections';
import { Injectable } from '@angular/core';
import { Usuario } from 'app/model/usuario';

@Injectable()
export class ReservaSalaService {

  usuarioLogado: Usuario;

  collection = Collections.CONDOMINIOS_RESERVAS_SALAS;

  constructor(private db: AngularFirestore, private userService: UserService) {
    this.usuarioLogado = userService.getUsuarioLogado();
  }

  getAll() {
    return this.db.collection(Collections.CONDOMINIOS).doc(this.usuarioLogado.condominio.id)
      .collection(this.collection, ref => {
        return ref.where('ativo', '==', true);
      }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
  }

  getByDate(idSala, dataInicial, dataFinal) {
    return this.db.collection(Collections.CONDOMINIOS).doc(this.usuarioLogado.condominio.id)
      .collection(this.collection, ref => {
        return ref.orderBy('dataReserva')
          .where('dataReserva', '>=', dataInicial)
          .where('dataReserva', '<=', dataFinal)
          .where('sala.id', '==', idSala)
          .where('ativo', '==', true);

      }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
  }

  insert(obj) {
    return this.db.collection(Collections.CONDOMINIOS).doc(this.usuarioLogado.condominio.id)
      .collection(this.collection).add(JSON.parse(JSON.stringify(obj)));
  }

  update(obj) {
    return this.db.collection(Collections.CONDOMINIOS)
      .doc(this.usuarioLogado.condominio.id)
      .collection(this.collection)
      .doc(obj.id)
      .update(obj);
  }

}
