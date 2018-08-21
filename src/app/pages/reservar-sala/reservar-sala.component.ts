import { ModalBasicComponent } from './../../shared/modal-basic/modal-basic.component';
import { UtilsService } from 'app/services/utils.service';
import { Subscription } from 'rxjs/Subscription';
import { ReservaSalaService } from './../../services/reserva-sala.service';
import { UserService } from './../../services/user.service';
import { Usuario } from 'app/model/usuario';
import { Sala } from 'app/model/sala';
import { SalasService } from 'app/services/salas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { ReservaSala } from 'app/model/reserva-sala';

@Component({
  selector: 'app-reservar-sala',
  templateUrl: './reservar-sala.component.html',
  styleUrls: ['./reservar-sala.component.css']
})
export class ReservarSalaComponent implements OnInit {

  @ViewChild(ModalBasicComponent)
  modalInformacoesReserva: ModalBasicComponent;

  semanaAtual: string;
  diaAtual = moment();
  public dataSelecionada;
  listHoras = []
  listDiasSemana = [];
  listSalas: Array<Sala>;
  idSalaSelecionada: string;
  salaSelecionada: Sala;

  entidade: ReservaSala;
  usuarioLogado: Usuario;

  listReservas: Array<ReservaSala>;
  hashDiaOcupado: IHash = {};

  subscription: Subscription;

  constructor(private salasService: SalasService,
    private userService: UserService,
    private reservaSalaService: ReservaSalaService,
    private utils: UtilsService) { }

  ngOnInit() {
    this.usuarioLogado = this.userService.getUsuarioLogado();
    this.getSemanaAtual();
    this.preencherListHoras();
    this.carregarSalas();

  }

  carregarSalas() {
    this.salasService.getAll().subscribe((salas: Array<Sala>) => {
      this.listSalas = salas;
    });
  }

  changeSala() {
    this.salaSelecionada = this.getSalaSelecionada();
    this.buscarReservas();
  }

  buscarReservas() {

    this.reiniciarCampos();

    this.utils.showLoading();
    this.subscription = this.reservaSalaService
      .getByDate(this.idSalaSelecionada, this.listDiasSemana[0], this.listDiasSemana[this.listDiasSemana.length - 1])
      .subscribe((listReservas: Array<ReservaSala>) => {
        this.listReservas = listReservas;
        console.log(this.listReservas);

        this.listReservas.forEach(reserva => {
          if (!this.hashDiaOcupado[reserva.dataReserva + " " + reserva.horaInicial]) {
            this.hashDiaOcupado[reserva.dataReserva + " " + reserva.horaInicial] = reserva;
          }
        });
        this.utils.hideLoading();
      }, (err) => {
        this.utils.hideLoading();
        console.error(err);
      });
  }

  reiniciarCampos() {
    this.listReservas = [];
    this.hashDiaOcupado = {};
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  preencherListHoras() {
    for (let i = 6; i <= 24; i++) {
      if (i % 2 === 0) {
        this.listHoras.push(i)
      }
    }
  }

  getSemanaAtual() {
    let startWeek = this.diaAtual.isoWeekday(0);

    this.semanaAtual = startWeek.format('DD-MM-YYYY') + ' até '
      + startWeek.add(6, 'days').format('DD-MM-YYYY');

    startWeek = this.diaAtual.isoWeekday(0);
    this.listDiasSemana = [];
    this.listDiasSemana.push(
      startWeek.format('YYYY-MM-DD'));
    for (let i = 0; i <= 5; i++) {
      this.listDiasSemana.push(
        startWeek.add(1, 'days').format('YYYY-MM-DD'));
    }
  }

  nextDate() {
    this.diaAtual.add(7, 'days');
    this.getSemanaAtual();
    this.buscarReservas();
  }

  backDate() {
    this.diaAtual.subtract(7, 'days');
    this.getSemanaAtual();
    this.buscarReservas();
  }

  confirmReserva(dia, hora) {
    swal({
      title: 'Você confirma a reserva?',
      text: `Reserva feita para a sala X no seguinte horário: ${hora}:00h - ${hora + 2}:00h`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(() => {
      this.entidade = new ReservaSala();
      this.entidade.dataCriacao = new Date();
      this.entidade.usuario = new Usuario();
      this.entidade.usuario.id = this.usuarioLogado.id;
      this.entidade.usuario.nome = this.usuarioLogado.nome;
      this.entidade.horaInicial = hora;
      const salaSelecionada = this.getSalaSelecionada();
      this.entidade.sala = new Sala();
      this.entidade.sala.id = salaSelecionada.id;
      this.entidade.sala.nome = salaSelecionada.nome;
      this.entidade.dataReserva = dia;


      this.reservaSalaService.insert(this.entidade).then(() => {
        console.log('success inserir');
        swal(
          'Sucesso!',
          'Reserva realizada com sucesso.',
          'success'
        )
      }).catch(err => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  getSalaSelecionada(): Sala {
    for (const element of this.listSalas) {
      if (element.id == this.idSalaSelecionada) {
        return element;
      }
    }
    return null;
  }

  isOcupado(dia, hora) {
    if (!this.listReservas) {
      return false;
    }

    if (this.hashDiaOcupado[dia + " " + hora]) {
      return true;
    }
    return false

  }

  abrirModalInformacoes(dia, hora) {
    this.entidade = this.hashDiaOcupado[dia + " " + hora]
    console.log(this.entidade);
    this.modalInformacoesReserva.show();
  }

  podeApagar() {
    if (!this.entidade) {
      return false;
    }
    // caso a reserva seja anterior ao dia de hoje, não pode apagar
    if (this.entidade.dataReserva <= moment().format(('YYYY-MM-DD'))) {
      return false;
    }
    // somente o usuário que criou pode apagar
    if (this.usuarioLogado.id == this.entidade.usuario.id) {
      return true;
    }
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
      this.reservaSalaService.update(this.entidade).then(() => {
        this.hashDiaOcupado[this.entidade.dataReserva + " " + this.entidade.horaInicial] = null;
        this.modalInformacoesReserva.hide();
        this.utils.hideLoading();
        swal(
          'Apagado!',
          'Reserva cancelada!',
          'success'
        )
      }).catch(err => {
        console.error(err);
      })
    }).catch(swal.noop);
  }

  dataMenorHoje(data) {
    if (data <= moment().format('YYYY-MM-DD')) {
      return true;
    }
    return false;
  }

}

export interface IHash {
  [details: string]: ReservaSala;
}
