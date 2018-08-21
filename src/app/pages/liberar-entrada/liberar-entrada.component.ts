import { Usuario } from 'app/model/usuario';
import { UserService } from 'app/services/user.service';
import swal from 'sweetalert2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalBasicComponent } from './../../shared/modal-basic/modal-basic.component';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Entrada } from 'app/model/entrada';
import { UtilsService } from 'app/services/utils.service';
import { LiberarEntradasService } from './../../services/liberar-entradas.service';

@Component({
  selector: 'app-liberar-entrada',
  templateUrl: './liberar-entrada.component.html',
  styleUrls: ['./liberar-entrada.component.css']
})
export class LiberarEntradaComponent implements OnInit {

  @ViewChild(ModalBasicComponent)
  modalBasicComponent: ModalBasicComponent;

  btnSalvarClicked;

  form: FormGroup;

  entidade = new Entrada();
  usuarioLogado;

  constructor(private fb: FormBuilder,
    private utils: UtilsService,
    private userService: UserService,
    private liberarEntradasService: LiberarEntradasService) {
  }

  ngOnInit() {
    this.usuarioLogado = this.userService.getUsuarioLogado();
  }

  buildForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      data: ['', [Validators.required]]
    });
  }

  iniciarEntidade() {
    this.entidade = new Entrada();
    this.entidade.data = this.utils.convertDate(new Date());
  }

  abrirPopupIncluir() {
    this.btnSalvarClicked = false;
    this.iniciarEntidade();
    this.buildForm();
    this.modalBasicComponent.show();
  }

  salvar() {

    if (this.form.invalid) {
      return;
    }

    if (this.entidade.data < this.utils.convertDate(new Date())) {
      swal({
        title: 'Ops!',
        text: 'Data da liberação não pode ser menor do que hoje!',
        type: 'warning'
      }).catch(swal.noop);
      return;
    }

    this.utils.showLoading()
    if (!this.entidade.id) {

      this.entidade.dataCriacao = new Date();
      this.entidade.usuario = new Usuario();
      this.entidade.usuario.id = this.usuarioLogado.id;
      this.entidade.usuario.nome = this.usuarioLogado.nome;
      this.liberarEntradasService.insert(this.entidade).then((res) => {
        this.modalBasicComponent.hide();
        this.utils.addToast({
          title: 'Sucesso!',
          msg: 'Entrada será liberada!',
          type: 'success'
        });
        this.utils.hideLoading();
      }).catch(err => {
        this.utils.hideLoading();
        console.error(err);
      });
    } else {
      this.liberarEntradasService.update(this.entidade).then(() => {
        this.modalBasicComponent.hide();
        this.utils.hideLoading();
        this.utils.addToast({
          title: 'Sucesso',
          msg: 'Sala alterada com sucesso',
          type: 'success'
        });
      }).catch(err => {
        this.utils.hideLoading();
        console.error(err);
      })
    }
  }

  abrirAlteracao(ev) {
    this.btnSalvarClicked = false;
    this.entidade = JSON.parse(JSON.stringify(ev.row));
    delete this.entidade['$$index'];
    this.buildForm();
    this.modalBasicComponent.show();
  }

  podeAlterar() {

    // caso seja inclusão, pode
    if (!this.entidade || !this.entidade.usuario) {
      return true;
    }

    // se for uma alteração e a data é menor do que hoje, não pode alterá-la
    if (this.entidade && this.entidade.data) {
      if (this.entidade.data < this.utils.convertDate(new Date())) {
        return false;
      }
    }

    if (this.entidade.usuario.id === this.usuarioLogado.id) {
      return true;
    }
    return false;
  }

  confirmApagar() {
    swal({
      title: 'Tem certeza?',
      text: "Você não poderar reverter essa ação!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1abc9c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!',
      cancelButtonText: 'Cancelar!',
      confirmButtonClass: 'btn btn-primary m-r-10',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(() => {
      this.entidade.ativo = false;
      this.utils.showLoading();
      this.liberarEntradasService.update(this.entidade).then(() => {
        this.modalBasicComponent.hide();
        this.utils.hideLoading();
        swal(
          'Apagado!',
          'Liberação de entrada apagada!',
          'success'
        )
      }).catch(err => {
        console.error(err);
      })
    }).catch(swal.noop);
  }

}
