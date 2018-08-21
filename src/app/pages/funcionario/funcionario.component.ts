import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalBasicComponent } from 'app/shared/modal-basic/modal-basic.component';
import swal from 'sweetalert2';

import { FuncionariosService } from './../../services/funcionarios.service';
import { Profissao } from './../../model/profissao';
import { ProfissoesService } from 'app/services/profissoes.service';
import { UserService } from 'app/services/user.service';
import { Funcionario } from 'app/model/funcionario';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  @ViewChild(ModalBasicComponent)
  modalBasicComponent: ModalBasicComponent;

  columns = [
    { name: 'Nome' },
    { name: 'profissão' },
    { name: 'email' },
    { name: 'telefone' }
  ];
  rows = [];
  rowsNoFilter = [];

  form: FormGroup;

  funcionario = new Funcionario();
  profissoes: Array<Profissao>;

  btnSalvarClicked = false;
  validateEmail = "[a-zA-Z0-9._-]+[@]+[a-zA-Z0-9-]+[.]+[a-zA-Z]{2,6}";

  search;

  constructor(private funcionariosService: FuncionariosService,
    private profissoesService: ProfissoesService,
    private userService: UserService, private fb: FormBuilder) {

  }

  buildForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      idProfissao: ['', [Validators.required]],
      telefone: [''],
      email: ['', [Validators.pattern(this.validateEmail)]]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.iniciarEntidade();
    this.funcionariosService.getAll(this.userService.getUsuarioLogado()).subscribe((res) => {
      console.log(res);
      this.rows = res;
      this.rowsNoFilter = this.rows;
    }, (err) => {
      console.error(err);
    })
  }

  iniciarEntidade() {
    this.funcionario = new Funcionario();
    this.funcionario.profissao = new Profissao();
    this.funcionario.profissao.id = '';
    console.log(this.funcionario);
  }

  abrirPopupIncluir() {
    this.buildForm();
    this.btnSalvarClicked = false;
    this.iniciarEntidade();
    this.carregarProfissoes();
    this.modalBasicComponent.show();
  }

  carregarProfissoes() {
    if (this.profissoes && this.profissoes.length > 0) {
      return;
    }

    this.profissoesService.getAll().subscribe((rows: Array<Profissao>) => {
      this.profissoes = rows;
    })
  }

  onClickLine(e) {
    if (e.type === "click") {
      this.btnSalvarClicked = false;
      this.carregarProfissoes();
      this.funcionario = JSON.parse(JSON.stringify(e.row));
      this.modalBasicComponent.show();
    }
  }

  salvar() {

    if (!this.form.valid) {
      return;
    }

    if (!this.funcionario.id) {
      this.funcionario.dataCriacao = new Date();
      const profissaoEscolhida = this.getProfissao(this.form.value.idProfissao);
      this.funcionario.profissao.nome = profissaoEscolhida.nome;

      this.funcionariosService.insert(this.funcionario).then((res) => {
        this.modalBasicComponent.hide();
        this.openSuccessSwal();
      }).catch(err => {
        this.openErrSwal();
      })
    } else {

      const profissaoEscolhida = this.getProfissao(this.form.value.idProfissao);
      this.funcionario.profissao.nome = profissaoEscolhida.nome;

      this.funcionariosService.update(this.funcionario).then((res) => {
        this.modalBasicComponent.hide();
        this.openSuccessSwal();
      }).catch(err => {
        this.openErrSwal();
      })
    }
  }

  getProfissao(idProfissao): Profissao {

    for (const element of this.profissoes) {
      if (element.id == idProfissao) {
        return element;
      }
    }
    return null;
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

  filtrar() {

    if (!this.search) {
      this.rows = this.rowsNoFilter;
    }

    this.rows = this.rowsNoFilter.filter((funcionario: Funcionario) => {
      return funcionario.nome.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
    })
  }

}
