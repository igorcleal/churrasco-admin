import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProdutosService } from 'app/services/produtos.service';

@Component({
  selector: 'app-produtos-lista',
  templateUrl: './produtos-lista.component.html',
  styleUrls: ['./produtos-lista.component.css']
})
export class ProdutosListaComponent implements OnInit {

  columns = [
    { name: 'Nome' },
    { name: 'Valor Venda' },
    { name: 'Quantidade Estoque' }
  ];
  rows = [];
  rowsNoFilter = [];

  btnSalvarClicked = false;

  @Output() alterar = new EventEmitter();

  constructor(private produtosService: ProdutosService) { }

  ngOnInit() {
    this.produtosService.getAll().subscribe((res) => {
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
