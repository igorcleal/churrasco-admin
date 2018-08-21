import { UserService } from './user.service';
import { Collections } from './../utils/collections';
import { Funcionario } from './../model/funcionario';
import { Usuario } from './../model/usuario';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class FuncionariosService {

  usuarioLogado: Usuario;

  constructor(private db: AngularFirestore, private userService: UserService) {
    this.usuarioLogado = userService.getUsuarioLogado();
    console.log(this.usuarioLogado);
  }

  getFuncionarios() {
    return 'funcionarios'
  }

  getAll(usuario: Usuario) {
    return this.db.collection(Collections.CONDOMINIOS).doc(usuario.condominio.id)
      .collection(Collections.FUNCIONARIOS, ref => {
        return ref.orderBy('dataCriacao');
      }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
  }

  insert(funcionario: Funcionario) {
    return this.db.collection(Collections.CONDOMINIOS).doc(this.usuarioLogado.condominio.id)
      .collection(Collections.FUNCIONARIOS).add(JSON.parse(JSON.stringify(funcionario)));
  }

  update(profissao: Funcionario) {
    return this.db.collection(Collections.CONDOMINIOS)
      .doc(this.usuarioLogado.condominio.id)
      .collection(Collections.FUNCIONARIOS)
      .doc(profissao.id)
      .update(profissao);
  }
}
