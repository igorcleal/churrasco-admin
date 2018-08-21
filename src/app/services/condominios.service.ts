import { Sala } from 'app/model/sala';
import { Collections } from './../utils/collections';
import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class CondominiosService {

    usuarioLogado;

    collection = Collections.CONDOMINIOS;

    constructor(private db: AngularFirestore, private userService: UserService) {
        this.usuarioLogado = userService.getUsuarioLogado();
    }

    getAll() {
        return this.db.collection(Collections.CONDOMINIOS, ref => {
            return ref.orderBy('nome');
        }).snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            });
        })
    }

    insert(sala: Sala) {
        return this.db.collection(Collections.CONDOMINIOS).doc(this.usuarioLogado.idCondominio)
            .collection(this.collection).add(JSON.parse(JSON.stringify(sala)));
    }

    update(sala: Sala) {
        return this.db.collection(Collections.CONDOMINIOS)
            .doc(this.usuarioLogado.idCondominio)
            .collection(this.collection)
            .doc(sala.id)
            .update(sala);
    }

}
