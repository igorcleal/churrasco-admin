import { UtilsService } from './../../services/utils.service';
import { ModalBasicComponent } from './../../shared/modal-basic/modal-basic.component';
import { Produto } from './../../model/produto';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import swal from 'sweetalert2';
import { ProdutosService } from 'app/services/produtos.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  @ViewChild(ModalBasicComponent)
  modalBasicComponent: ModalBasicComponent;

  btnSalvarClicked: boolean;

  form: FormGroup;

  produto: Produto = new Produto();

  constructor(private fb: FormBuilder,
    private produtosService: ProdutosService,
    private utils: UtilsService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      valorVenda: ['', [Validators.required]],
      quantidadeEstoque: ['', [Validators.required]],
      descricao: ['']
    });
  }

  iniciarEntidade() {
    this.produto = new Produto();
  }

  salvar() {

    if (this.form.invalid) {
      console.warn('form invalid');
      return;
    }

    this.utils.showLoading();
    if (!this.produto.id) {

      this.produtosService.insert(this.produto).then((res) => {
        this.modalBasicComponent.hide();
        this.utils.addToast({
          title: 'Sucesso',
          msg: 'Sala criada com sucesso',
          type: 'success'
        });
        this.utils.hideLoading();
      }).catch(err => {
        this.utils.hideLoading();
        console.error(err);
      });
    } else {
      this.produtosService.update(this.produto).then(() => {
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

  abrirPopupIncluir() {
    this.btnSalvarClicked = false;
    this.iniciarEntidade();
    this.buildForm();
    this.modalBasicComponent.show();
  }

  abrirAlteracao(ev) {
    this.btnSalvarClicked = false;
    this.produto = JSON.parse(JSON.stringify(ev.row));
    delete this.produto['$$index'];
    this.modalBasicComponent.show();
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
      this.produto.ativo = false;
      this.utils.showLoading();
      this.produtosService.update(this.produto).then(() => {
        this.modalBasicComponent.hide();
        this.utils.hideLoading();
        swal(
          'Apagado!',
          'Sala apagada.',
          'success'
        )
      }).catch(err => {
        console.error(err);
      })
    }).catch(swal.noop);
  }

}
