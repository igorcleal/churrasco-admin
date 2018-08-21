import { ToastData } from 'ng2-toasty';
import { ToastOptions } from 'ng2-toasty';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalBasicComponent } from 'app/shared/modal-basic/modal-basic.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SalasService } from 'app/services/salas.service';
import { Sala } from 'app/model/sala';
import { UtilsService } from 'app/services/utils.service';
import { ToastyService } from 'ng2-toasty';
import swal from 'sweetalert2';

@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})
export class SalasComponent implements OnInit {

  @ViewChild(ModalBasicComponent)
  modalBasicComponent: ModalBasicComponent;

  btnSalvarClicked;

  form: FormGroup;

  sala: Sala = new Sala();

  constructor(private fb: FormBuilder,
    private salasService: SalasService,
    private utils: UtilsService,
    private toastyService: ToastyService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      domingo: [''],
      segunda: [''],
      terca: [''],
      quarta: [''],
      quinta: [''],
      sexta: [''],
      sabado: [''],
      isPaga: ['']
    });
  }

  iniciarEntidade() {
    this.sala = new Sala();
  }

  abrirPopupIncluir() {
    this.btnSalvarClicked = false;
    this.iniciarEntidade();
    this.buildForm();
    this.modalBasicComponent.show();
  }

  salvar() {
    this.utils.showLoading()
    if (!this.sala.id) {

      this.sala.dataCriacao = new Date();
      this.salasService.insert(this.sala).then((res) => {
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
      this.salasService.update(this.sala).then(() => {
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
    this.sala = JSON.parse(JSON.stringify(ev.row));
    delete this.sala['$$index'];
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
      this.sala.ativo = false;
      this.utils.showLoading();
      this.salasService.update(this.sala).then(() => {
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
