import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Profissao } from 'app/model/profissao';

@Injectable()
export class ProfissoesService {

  constructor(private db: AngularFirestore,
    private userService: UserService) { }

  insertProfissao(profissao: Profissao) {
    return this.db.collection('condominios').doc(this.userService.getIdCondominioUsuarioLogado())
      .collection('profissoes').add(profissao.getData());
  }

  updateProfissao(profissao: Profissao) {
    return this.db.collection('condominios')
      .doc(this.userService.getIdCondominioUsuarioLogado())
      .collection('profissoes')
      .doc(profissao.id)
      .update(profissao);
  }

  getAll() {
    return this.db.collection('condominios').doc(this.userService.getIdCondominioUsuarioLogado())
      .collection('profissoes', ref => {
        return ref.orderBy('dataCriacao');
      }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
  }

}
