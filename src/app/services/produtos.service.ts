import { Produto } from './../model/produto';
import { Usuario } from 'app/model/usuario';
import { Sala } from 'app/model/sala';
import { Collections } from './../utils/collections';
import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class ProdutosService {

  usuarioLogado: Usuario;

  collection = Collections.PRODUTOS;

  constructor(private db: AngularFirestore, private userService: UserService) {
    this.usuarioLogado = userService.getUsuarioLogado();
  }

  getAll() {
    return this.db.collection(this.collection, ref => {
        return ref.where('ativo', '==', true);
      }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
  }

  insert(produto: Produto) {
    return this.db.collection(Collections.PRODUTOS).add(JSON.parse(JSON.stringify(produto)));
  }

  update(produto: Produto) {
    return this.db.collection(Collections.PRODUTOS)
      .doc(produto.id)
      .update(produto);
  }

}
