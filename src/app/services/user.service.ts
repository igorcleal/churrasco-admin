import { Usuario } from './../model/usuario';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn;
  private userName;
  usuarioLogado: Usuario;

  constructor(private af: AngularFirestore) {
    this.isUserLoggedIn = false;

    this.usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  }

  setUserLoggedIn() {
    this.isUserLoggedIn = true;
  }

  getUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  getUsuarioLogado(): Usuario {
    return this.usuarioLogado;
  }

  getIdCondominioUsuarioLogado() {
    if (!this.usuarioLogado) {
      return '03FMss0QFzOcekQDZUsO';
    }
    return this.usuarioLogado.condominio ? this.usuarioLogado.condominio.id : null;
  }

  recuperarUsuario(id) {
    return this.af.collection('usuarios').doc(id).valueChanges()
  }

  criarUsuario(usuario: Usuario) {

    const promises = []

    promises.push(this.af.collection('condominios').doc(usuario.condominio.id)
      .collection('usuarios').doc(usuario.id)
      .set(JSON.parse(JSON.stringify(usuario))));

    promises.push(this.af.collection('usuarios').doc(usuario.id)
      .set(JSON.parse(JSON.stringify(usuario))));

    return Promise.all(promises)
  }

}
