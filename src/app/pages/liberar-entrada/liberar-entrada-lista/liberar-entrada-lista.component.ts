import { Subscription } from 'rxjs/Subscription';
import { UtilsService } from './../../../services/utils.service';
import { LiberarEntradasService } from './../../../services/liberar-entradas.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-liberar-entrada-lista',
  templateUrl: './liberar-entrada-lista.component.html',
  styleUrls: ['./liberar-entrada-lista.component.css']
})
export class LiberarEntradaListaComponent implements OnInit {

  columns = [
    { name: 'Nome' },
    { name: 'Usuario' },
    { name: 'Data' }
  ];
  rows = [];
  rowsNoFilter = [];

  btnSalvarClicked = false;

  @Output() alterar = new EventEmitter();

  dataPesquisa;
  get _dataPesquisaFormatada() {
    return moment(this.dataPesquisa).format('DD/MM/YYYY');
  }

  subscriptionPesquisa: Subscription;

  constructor(
    private utils: UtilsService,
    private liberarEntradasService: LiberarEntradasService) { }

  ngOnInit() {

    this.dataPesquisa = this.utils.convertDate(new Date());
    this.search();
  }

  search() {

    if (this.subscriptionPesquisa) {
      this.subscriptionPesquisa.unsubscribe();
    }

    this.subscriptionPesquisa = this.liberarEntradasService.getByDate(this.dataPesquisa).subscribe((res) => {
      console.log(res);
      this.rows = res;
      this.rowsNoFilter = this.rows;
    }, (err) => {
      console.error(err);
    })
  }

  onClickLine(e) {
    if (e.type === "click") {
      this.alterar.emit(e)
    }
  }

  nextDate() {

    this.dataPesquisa = moment(this.dataPesquisa).add(1, 'day').format().substr(0, 10);
    this.search();

  }

  backDate() {
    this.dataPesquisa = moment(this.dataPesquisa).subtract(1, 'day').format().substr(0, 10);
    this.search();
  }

  dataPesquisaChanged(event) {
    console.log(event);
  }

}
