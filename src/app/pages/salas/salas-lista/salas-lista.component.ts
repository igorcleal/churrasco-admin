import { UserService } from 'app/services/user.service';
import { SalasService } from 'app/services/salas.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-salas-lista',
  templateUrl: './salas-lista.component.html',
  styleUrls: ['./salas-lista.component.css']
})
export class SalasListaComponent implements OnInit {

  columns = [
    { name: 'Nome' }
  ];
  rows = [];
  rowsNoFilter = [];

  btnSalvarClicked = false;

  @Output() alterar = new EventEmitter();

  constructor(private salasService: SalasService) { }

  ngOnInit() {
    this.salasService.getAll().subscribe((res) => {
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

}
