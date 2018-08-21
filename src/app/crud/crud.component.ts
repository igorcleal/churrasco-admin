import { ModalBasicComponent } from './../shared/modal-basic/modal-basic.component';
import { Profissao } from './../model/profissao';
import { ProfissoesService } from './../services/profissoes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  @ViewChild(ModalBasicComponent)
  modalBasicComponent: ModalBasicComponent;

  columns = [
    { name: 'Nome' },
    { prop: 'dataCriacao' }
  ];
  rows = [];
  rowsNoFilter = [];
  loadingIndicator = true;
  reorderable = true;

  search: string;

  profissao = new Profissao();

  form: FormGroup;

  constructor(private profissoesService: ProfissoesService) {
    const nome = new FormControl('', Validators.required);

    this.form = new FormGroup({
      nome: nome
    });
  }

  ngOnInit() {
    this.profissoesService.getAll().subscribe((res) => {
      this.rows = res;
      this.rowsNoFilter = this.rows;
    }, (err) => {
      console.error(err);
    })
  }

  filtrar() {

    if (!this.search) {
      this.rows = this.rowsNoFilter;
    }

    this.rows = this.rowsNoFilter.filter((profissao: Profissao) => {
      return profissao.nome.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
    })
  }

  onUserEvent(e) {
    if (e.type === "click") {
      this.profissao = e.row;
      this.modalBasicComponent.show();
    }
  }

  salvar() {

    if (!this.form.valid) {
      return;
    }

    if (!this.profissao.id) {
      this.profissao.dataCriacao = new Date();
      this.profissoesService.insertProfissao(this.profissao).then((res) => {
        this.modalBasicComponent.hide();
        this.openSuccessSwal();
      }).catch(err => {
        this.openErrSwal();
      })
    } else {
      this.profissoesService.updateProfissao(this.profissao).then((res) => {
        this.modalBasicComponent.hide();
        this.openSuccessSwal();
      }).catch(err => {
        this.openErrSwal();
      })
    }
  }

  abrirPopupIncluir() {
    this.profissao = new Profissao();
    this.modalBasicComponent.show();
  }

  openSuccessSwal() {
    swal({
      title: 'Sucesso!',
      text: 'Profissão salva!',
      type: 'success'
    }).catch(swal.noop);
  }

  openErrSwal() {
    swal(
      'Erro',
      'Erro ao salvar profissão!',
      'error'
    ).catch(swal.noop);
  }

}
